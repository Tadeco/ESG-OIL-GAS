import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Loader2,
  Shield,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Globe,
  Building2
} from 'lucide-react';

interface LoginProps {
  onLogin?: (email: string, password: string, mfaToken?: string) => Promise<void>;
  onSocialLogin?: (provider: 'google' | 'microsoft') => Promise<void>;
  onNavigate?: (path: string) => void;
  theme?: 'light' | 'dark';
}

const Login: React.FC<LoginProps> = ({ 
  onLogin = async () => {}, 
  onSocialLogin = async () => {},
  onNavigate = () => {},
  theme = 'light' 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  
  // Form validation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mfaError, setMfaError] = useState('');

  // Validate email
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Invalid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validate password
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Validate MFA token
  const validateMFA = (value: string) => {
    if (!value) {
      setMfaError('MFA token is required');
      return false;
    }
    if (!/^\d{6}$/.test(value)) {
      setMfaError('MFA token must be 6 digits');
      return false;
    }
    setMfaError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if MFA is required (mock logic)
      if (email.includes('mfa')) {
        setShowMFA(true);
      } else {
        await onLogin(email, password);
        onNavigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMFA(mfaToken)) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await onLogin(email, password, mfaToken);
      onNavigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid MFA token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    setIsLoading(true);
    setError('');
    
    try {
      await onSocialLogin(provider);
    } catch (err: any) {
      setError(err.message || `${provider} login failed`);
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-blue-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-green-900/20' : 'bg-green-200/30'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-200/30'
        }`} />
      </div>

      <div className="relative w-full max-w-md">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className={`px-8 pt-8 pb-6 text-center border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome Back
            </h1>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sign in to OIL & GAS ESG Contract Analyzer
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {!showMFA ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) validateEmail(e.target.value);
                      }}
                      onBlur={() => validateEmail(email)}
                      autoComplete="email"
                      placeholder="you@shell.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                      } ${emailError ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-2 text-sm text-red-500">{emailError}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) validatePassword(e.target.value);
                      }}
                      onBlur={() => validatePassword(password)}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                      } ${passwordError ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-500">{passwordError}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className={`ml-2 text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('/forgot-password')}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${
                    theme === 'dark' ? 'bg-red-900/20 border border-red-900/30' : 'bg-red-50 border border-red-200'
                  }`}>
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    !isLoading && email && password
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Divider */}
                {/* Aviso sobre envio por email */}
                <div className={`p-4 rounded-lg border-l-4 ${
                  theme === 'dark' 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`font-semibold text-sm mb-1 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-800'
                      }`}>
                        📧 Relatórios por Email
                      </h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        Após a análise ESG, o relatório detalhado será enviado automaticamente 
                        para o email informado no login.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleMFASubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <h2 className={`text-xl font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Two-Factor Authentication
                  </h2>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                {/* MFA Token Field */}
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={mfaToken}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setMfaToken(value);
                        if (mfaError) validateMFA(value);
                      }}
                      onBlur={() => validateMFA(mfaToken)}
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="one-time-code"
                      placeholder="000000"
                      className={`w-full text-center text-2xl font-mono tracking-widest px-4 py-4 rounded-lg border transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } ${mfaError ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {mfaError && (
                    <p className="mt-2 text-sm text-red-500 text-center">{mfaError}</p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${
                    theme === 'dark' ? 'bg-red-900/20 border border-red-900/30' : 'bg-red-50 border border-red-200'
                  }`}>
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || mfaToken.length !== 6}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    !isLoading && mfaToken.length === 6
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Verify & Sign In
                    </>
                  )}
                </button>

                {/* Back to Login */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMFA(false);
                    setMfaToken('');
                    setError('');
                  }}
                  className={`w-full text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  Back to login
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className={`px-8 py-6 text-center border-t ${
            theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'
          }`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('/register')}
                className="font-medium text-green-600 hover:text-green-700"
              >
                Sign up
              </button>
            </p>
            
            {/* Developer Credits */}
            <div className={`mt-4 pt-4 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Projeto desenvolvido por{' '}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Eng. Tadeu Santana
                </span>
              </p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                Sistema para análise ESG em contratos de petróleo e gás
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;