import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    validateOAuth: jest.fn(),
    generateMfaSecret: jest.fn(),
    verifyMfaToken: jest.fn(),
    enableMfa: jest.fn(),
    disableMfa: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      const config = {
        'jwt.secret': 'test-secret',
        'jwt.expiresIn': '15m',
        'jwt.refreshExpiresIn': '7d',
        'mfa.appName': 'Shell ESG Analyzer',
      };
      return config[key];
    }),
  };

  const mockUser: Partial<User> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@shell.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.ANALYST,
    isActive: true,
    isMfaEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@shell.com',
      password: 'SecurePass123!',
    };

    it('should successfully login a user', async () => {
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900,
        user: mockUser,
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(tokens);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        success: true,
        data: tokens,
      });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should handle MFA-enabled accounts', async () => {
      const mfaUser = { ...mockUser, isMfaEnabled: true };
      mockAuthService.validateUser.mockResolvedValue(mfaUser);

      const mfaLoginDto = { ...loginDto, mfaToken: '123456' };
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900,
        user: mfaUser,
      };

      mockAuthService.verifyMfaToken.mockResolvedValue(true);
      mockAuthService.login.mockResolvedValue(tokens);

      const result = await controller.login(mfaLoginDto);

      expect(result.success).toBe(true);
      expect(mockAuthService.verifyMfaToken).toHaveBeenCalledWith(
        mfaUser.id,
        mfaLoginDto.mfaToken
      );
    });

    it('should require MFA token for MFA-enabled accounts', async () => {
      const mfaUser = { ...mockUser, isMfaEnabled: true };
      mockAuthService.validateUser.mockResolvedValue(mfaUser);

      await expect(controller.login(loginDto)).rejects.toThrow(
        new BadRequestException('MFA token required')
      );
    });

    it('should reject invalid MFA tokens', async () => {
      const mfaUser = { ...mockUser, isMfaEnabled: true };
      mockAuthService.validateUser.mockResolvedValue(mfaUser);
      mockAuthService.verifyMfaToken.mockResolvedValue(false);

      const mfaLoginDto = { ...loginDto, mfaToken: 'invalid' };

      await expect(controller.login(mfaLoginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid MFA token')
      );
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'newuser@shell.com',
      username: 'newuser',
      password: 'SecurePass123!',
      firstName: 'New',
      lastName: 'User',
      department: 'ESG Analysis',
    };

    it('should successfully register a new user', async () => {
      const newUser = { ...mockUser, ...registerDto };
      mockAuthService.register.mockResolvedValue(newUser);

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        success: true,
        data: {
          user: expect.objectContaining({
            email: registerDto.email,
            username: registerDto.username,
          }),
        },
      });
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should handle duplicate email registration', async () => {
      mockAuthService.register.mockRejectedValue(
        new BadRequestException('Email already exists')
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        'Email already exists'
      );
    });

    it('should validate password requirements', async () => {
      const weakPasswordDto = { ...registerDto, password: '123' };

      await expect(controller.register(weakPasswordDto)).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const invalidEmailDto = { ...registerDto, email: 'invalid-email' };

      await expect(controller.register(invalidEmailDto)).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    it('should successfully refresh access token', async () => {
      const newTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 900,
      };

      mockAuthService.refreshToken.mockResolvedValue(newTokens);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(result).toEqual({
        success: true,
        data: newTokens,
      });
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken
      );
    });

    it('should handle invalid refresh tokens', async () => {
      mockAuthService.refreshToken.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token')
      );

      await expect(controller.refreshToken(refreshTokenDto)).rejects.toThrow(
        'Invalid refresh token'
      );
    });

    it('should handle expired refresh tokens', async () => {
      mockAuthService.refreshToken.mockRejectedValue(
        new UnauthorizedException('Refresh token expired')
      );

      await expect(controller.refreshToken(refreshTokenDto)).rejects.toThrow(
        'Refresh token expired'
      );
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      const req = {
        user: mockUser,
        headers: {
          authorization: 'Bearer access-token',
        },
      } as unknown as Request;

      mockAuthService.logout.mockResolvedValue(true);

      const result = await controller.logout(req);

      expect(result).toEqual({
        success: true,
        message: 'Logged out successfully',
      });
      expect(mockAuthService.logout).toHaveBeenCalledWith(mockUser.id);
    });

    it('should handle logout errors gracefully', async () => {
      const req = {
        user: mockUser,
      } as unknown as Request;

      mockAuthService.logout.mockRejectedValue(new Error('Logout failed'));

      const result = await controller.logout(req);

      expect(result).toEqual({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });

  describe('profile', () => {
    it('should return user profile', async () => {
      const req = {
        user: mockUser,
      } as unknown as Request;

      const result = await controller.getProfile(req);

      expect(result).toEqual({
        success: true,
        data: {
          user: expect.objectContaining({
            id: mockUser.id,
            email: mockUser.email,
            role: mockUser.role,
          }),
        },
      });
    });

    it('should exclude sensitive information from profile', async () => {
      const req = {
        user: { ...mockUser, password: 'hashed-password', mfaSecret: 'secret' },
      } as unknown as Request;

      const result = await controller.getProfile(req);

      expect(result.data.user).not.toHaveProperty('password');
      expect(result.data.user).not.toHaveProperty('mfaSecret');
    });
  });

  describe('OAuth authentication', () => {
    it('should handle Google OAuth callback', async () => {
      const oauthUser = {
        ...mockUser,
        provider: 'google',
        providerId: 'google-123',
      };

      const req = {
        user: oauthUser,
      } as unknown as Request;

      const res = {
        redirect: jest.fn(),
      } as unknown as Response;

      mockAuthService.login.mockResolvedValue({
        accessToken: 'oauth-access-token',
        refreshToken: 'oauth-refresh-token',
        expiresIn: 900,
        user: oauthUser,
      });

      await controller.googleCallback(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('oauth-access-token')
      );
    });

    it('should handle OAuth registration for new users', async () => {
      const newOAuthUser = {
        email: 'oauth@shell.com',
        firstName: 'OAuth',
        lastName: 'User',
        provider: 'microsoft',
        providerId: 'ms-123',
      };

      mockAuthService.validateOAuth.mockResolvedValue({
        isNewUser: true,
        user: { ...mockUser, ...newOAuthUser },
      });

      const req = {
        user: newOAuthUser,
      } as unknown as Request;

      const res = {
        redirect: jest.fn(),
      } as unknown as Response;

      await controller.microsoftCallback(req, res);

      expect(mockAuthService.validateOAuth).toHaveBeenCalledWith(newOAuthUser);
    });
  });

  describe('MFA management', () => {
    it('should generate MFA secret', async () => {
      const req = {
        user: mockUser,
      } as unknown as Request;

      const mfaSecret = {
        secret: 'JBSWY3DPEHPK3PXP',
        qrCode: 'data:image/png;base64,...',
        backupCodes: ['12345678', '87654321'],
      };

      mockAuthService.generateMfaSecret.mockResolvedValue(mfaSecret);

      const result = await controller.generateMfaSecret(req);

      expect(result).toEqual({
        success: true,
        data: mfaSecret,
      });
      expect(mockAuthService.generateMfaSecret).toHaveBeenCalledWith(mockUser.id);
    });

    it('should enable MFA with valid token', async () => {
      const req = {
        user: mockUser,
      } as unknown as Request;

      const enableMfaDto = {
        token: '123456',
        secret: 'JBSWY3DPEHPK3PXP',
      };

      mockAuthService.enableMfa.mockResolvedValue(true);

      const result = await controller.enableMfa(req, enableMfaDto);

      expect(result).toEqual({
        success: true,
        message: 'MFA enabled successfully',
      });
      expect(mockAuthService.enableMfa).toHaveBeenCalledWith(
        mockUser.id,
        enableMfaDto.secret,
        enableMfaDto.token
      );
    });

    it('should reject enabling MFA with invalid token', async () => {
      const req = {
        user: mockUser,
      } as unknown as Request;

      const enableMfaDto = {
        token: 'invalid',
        secret: 'JBSWY3DPEHPK3PXP',
      };

      mockAuthService.enableMfa.mockRejectedValue(
        new BadRequestException('Invalid MFA token')
      );

      await expect(controller.enableMfa(req, enableMfaDto)).rejects.toThrow(
        'Invalid MFA token'
      );
    });

    it('should disable MFA with password verification', async () => {
      const req = {
        user: { ...mockUser, isMfaEnabled: true },
      } as unknown as Request;

      const disableMfaDto = {
        password: 'SecurePass123!',
      };

      mockAuthService.disableMfa.mockResolvedValue(true);

      const result = await controller.disableMfa(req, disableMfaDto);

      expect(result).toEqual({
        success: true,
        message: 'MFA disabled successfully',
      });
      expect(mockAuthService.disableMfa).toHaveBeenCalledWith(
        mockUser.id,
        disableMfaDto.password
      );
    });
  });

  describe('session management', () => {
    it('should validate session tokens', async () => {
      const req = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      } as unknown as Request;

      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        exp: Math.floor(Date.now() / 1000) + 900,
      });

      const isValid = await controller['validateSession'](req);

      expect(isValid).toBe(true);
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token');
    });

    it('should reject expired sessions', async () => {
      const req = {
        headers: {
          authorization: 'Bearer expired-token',
        },
      } as unknown as Request;

      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        exp: Math.floor(Date.now() / 1000) - 100, // Expired
      });

      const isValid = await controller['validateSession'](req);

      expect(isValid).toBe(false);
    });

    it('should track active sessions', async () => {
      const req = {
        user: mockUser,
        headers: {
          'user-agent': 'Mozilla/5.0...',
          'x-forwarded-for': '192.168.1.1',
        },
      } as unknown as Request;

      await controller['trackSession'](req);

      expect(mockAuthService['sessionService'].createSession).toHaveBeenCalledWith({
        userId: mockUser.id,
        userAgent: 'Mozilla/5.0...',
        ipAddress: '192.168.1.1',
      });
    });
  });

  describe('rate limiting', () => {
    it('should enforce rate limits on login attempts', async () => {
      const loginDto: LoginDto = {
        email: 'test@shell.com',
        password: 'wrong-password',
      };

      mockAuthService.validateUser.mockResolvedValue(null);

      // Simulate multiple failed attempts
      for (let i = 0; i < 5; i++) {
        try {
          await controller.login(loginDto);
        } catch (e) {
          // Expected to fail
        }
      }

      // 6th attempt should be rate limited
      await expect(controller.login(loginDto)).rejects.toThrow(
        'Too many login attempts'
      );
    });

    it('should reset rate limit after successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@shell.com',
        password: 'SecurePass123!',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresIn: 900,
        user: mockUser,
      });

      await controller.login(loginDto);

      // Rate limit should be reset
      expect(controller['rateLimiter'].reset).toHaveBeenCalledWith(
        loginDto.email
      );
    });
  });
});