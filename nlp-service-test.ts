import { Test, TestingModule } from '@nestjs/testing';
import { NLPService } from './nlp.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  NLPAnalysisResult,
  Entity,
  Sentiment,
  TextCategory,
  EntityType,
} from './interfaces/nlp.interface';

describe('NLPService', () => {
  let service: NLPService;
  let httpService: HttpService;
  let configService: ConfigService;
  let cacheManager: Cache;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      const config = {
        'openai.apiKey': 'test-api-key',
        'openai.endpoint': 'https://api.openai.com/v1',
        'openai.model': 'gpt-4',
        'nlp.maxTokens': 4000,
        'nlp.temperature': 0.3,
        'cache.ttl': 1800,
      };
      return config[key];
    }),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NLPService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        Logger,
      ],
    }).compile();

    service = module.get<NLPService>(NLPService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeText', () => {
    const mockText = 'The company must reduce carbon emissions by 40% and ensure fair wages for all employees.';
    
    const mockOpenAIResponse: AxiosResponse = {
      data: {
        choices: [{
          message: {
            content: JSON.stringify({
              entities: [
                { text: 'carbon emissions', type: 'ENVIRONMENTAL_METRIC', confidence: 0.92 },
                { text: 'fair wages', type: 'SOCIAL_POLICY', confidence: 0.88 },
              ],
              sentiment: { score: 0.6, magnitude: 0.7 },
              categories: [
                { name: 'Environmental Compliance', confidence: 0.9 },
                { name: 'Labor Standards', confidence: 0.85 },
              ],
            }),
          },
        }],
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    it('should analyze text successfully', async () => {
      mockHttpService.post.mockReturnValue(of(mockOpenAIResponse));
      mockCacheManager.get.mockResolvedValue(null);

      const result = await service.analyzeText(mockText);

      expect(result).toBeDefined();
      expect(result.entities).toHaveLength(2);
      expect(result.sentiment).toHaveProperty('score');
      expect(result.categories).toHaveLength(2);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/chat/completions'),
        expect.objectContaining({
          model: 'gpt-4',
          messages: expect.any(Array),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
          }),
        })
      );
    });

    it('should use cached results when available', async () => {
      const cachedResult: NLPAnalysisResult = {
        entities: [{ text: 'cached entity', type: EntityType.OTHER, confidence: 0.9 }],
        sentiment: { score: 0.5, magnitude: 0.6 },
        categories: [{ name: 'Cached Category', confidence: 0.8 }],
      };

      mockCacheManager.get.mockResolvedValue(cachedResult);

      const result = await service.analyzeText(mockText);

      expect(result).toEqual(cachedResult);
      expect(mockHttpService.post).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockHttpService.post.mockReturnValue(
        throwError(() => new Error('API request failed'))
      );
      mockCacheManager.get.mockResolvedValue(null);

      await expect(service.analyzeText(mockText)).rejects.toThrow('API request failed');
    });

    it('should handle malformed API responses', async () => {
      const malformedResponse: AxiosResponse = {
        data: { choices: [{ message: { content: 'invalid json' } }] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockHttpService.post.mockReturnValue(of(malformedResponse));
      mockCacheManager.get.mockResolvedValue(null);

      await expect(service.analyzeText(mockText)).rejects.toThrow();
    });
  });

  describe('extractEntities', () => {
    const mockText = 'Shell must comply with ISO 14001 and reduce CO2 emissions by 30% by 2030.';

    it('should extract entities with correct types', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                entities: [
                  { text: 'Shell', type: 'ORGANIZATION', confidence: 0.95 },
                  { text: 'ISO 14001', type: 'CERTIFICATION', confidence: 0.93 },
                  { text: 'CO2 emissions', type: 'ENVIRONMENTAL_METRIC', confidence: 0.91 },
                  { text: '30%', type: 'PERCENTAGE', confidence: 0.88 },
                  { text: '2030', type: 'DATE', confidence: 0.9 },
                ],
              }),
            },
          }],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const entities = await service.extractEntities(mockText);

      expect(entities).toHaveLength(5);
      expect(entities).toContainEqual(
        expect.objectContaining({
          text: 'ISO 14001',
          type: 'CERTIFICATION',
        })
      );
      expect(entities.every(e => e.confidence >= 0 && e.confidence <= 1)).toBe(true);
    });

    it('should filter entities by confidence threshold', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                entities: [
                  { text: 'high confidence', type: 'OTHER', confidence: 0.95 },
                  { text: 'low confidence', type: 'OTHER', confidence: 0.3 },
                ],
              }),
            },
          }],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const entities = await service.extractEntities(mockText, 0.5);

      expect(entities).toHaveLength(1);
      expect(entities[0].text).toBe('high confidence');
    });

    it('should handle empty text input', async () => {
      const entities = await service.extractEntities('');
      expect(entities).toEqual([]);
    });
  });

  describe('analyzeSentiment', () => {
    it('should analyze sentiment correctly', async () => {
      const positiveText = 'The company has excellent environmental practices and strong governance.';
      const negativeText = 'The contractor violated labor laws and ignored safety regulations.';

      const positiveResponse: AxiosResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                sentiment: { score: 0.8, magnitude: 0.9 },
              }),
            },
          }],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const negativeResponse: AxiosResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                sentiment: { score: -0.7, magnitude: 0.8 },
              }),
            },
          }],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockHttpService.post
        .mockReturnValueOnce(of(positiveResponse))
        .mockReturnValueOnce(of(negativeResponse));

      const positiveSentiment = await service.analyzeSentiment(positiveText);
      const negativeSentiment = await service.analyzeSentiment(negativeText);

      expect(positiveSentiment.score).toBeGreaterThan(0);
      expect(negativeSentiment.score).toBeLessThan(0);
      expect(positiveSentiment.magnitude).toBeGreaterThan(0);
      expect(negativeSentiment.magnitude).toBeGreaterThan(0);
    });

    it('should handle neutral sentiment', async () => {
      const neutralText = 'The contract contains standard terms and conditions.';

      const neutralResponse: AxiosResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                sentiment: { score: 0.1, magnitude: 0.2 },
              }),
            },
          }],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockHttpService.post.mockReturnValue(of(neutralResponse));

      const sentiment = await service.analyzeSentiment(neutralText);

      expect(Math.abs(sentiment.score)).toBeLessThan(0.3);
      expect(sentiment.magnitude).toBeLessThan(0.5);
    });
  });

  describe('classifyText', () => {
    const mockText = 'This agreement covers environmental protection, worker safety, and corporate governance.';

    it('should classify text into appropriate categories', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                categories: [
                  { name: 'Environmental Protection', confidence: 0.92 },
                  { name: 'Occupational Health & Safety', confidence: 0.88 },
                  { name: 'Corporate Governance', confidence: 0.85 },
                ],
              }),
            },
          }],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const categories = await service.classifyText(mockText);

      expect(categories).toHaveLength(3);
      expect(categories[0].confidence).toBeGreaterThan(categories[1].confidence);
      expect(categories[1].confidence).toBeGreaterThan(categories[2].confidence);
      expect(categories.map(c => c.name)).toContain('Environmental Protection');
    });

    it('should handle domain-specific classification', async () => {
      const esgText = 'Carbon neutrality targets and diversity initiatives';
      
      const mockResponse: AxiosResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                categories: [
                  { name: 'Climate Action', confidence: 0.94 },
                  { name: 'Diversity & Inclusion', confidence: 0.91 },
                ],
              }),
            },
          }],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const categories = await service.classifyText(esgText, ['ESG']);

      expect(categories).toHaveLength(2);
      expect(categories.every(c => c.confidence > 0.9)).toBe(true);
    });
  });

  describe('performance optimization', () => {
    it('should batch process multiple texts efficiently', async () => {
      const texts = Array(5).fill(null).map((_, i) => `Text ${i} for analysis`);
      
      const mockResponse: AxiosResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                results: texts.map((_, i) => ({
                  entities: [{ text: `Entity ${i}`, type: 'OTHER', confidence: 0.8 }],
                  sentiment: { score: 0.5, magnitude: 0.5 },
                  categories: [{ name: `Category ${i}`, confidence: 0.8 }],
                })),
              }),
            },
          }],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const results = await service['batchAnalyze'](texts);

      expect(results).toHaveLength(5);
      expect(mockHttpService.post).toHaveBeenCalledTimes(1); // Single batch request
    });

    it('should handle rate limiting with retry logic', async () => {
      const rateLimitResponse: AxiosResponse = {
        data: { error: { message: 'Rate limit exceeded' } },
        status: 429,
        statusText: 'Too Many Requests',
        headers: { 'retry-after': '2' },
        config: {},
      };

      const successResponse: AxiosResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                entities: [],
                sentiment: { score: 0, magnitude: 0 },
                categories: [],
              }),
            },
          }],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockHttpService.post
        .mockReturnValueOnce(throwError(() => rateLimitResponse))
        .mockReturnValueOnce(of(successResponse));

      const result = await service.analyzeText('Test text');

      expect(result).toBeDefined();
      expect(mockHttpService.post).toHaveBeenCalledTimes(2);
    });

    it('should implement token counting and text chunking', () => {
      const longText = 'Lorem ipsum '.repeat(1000);
      
      const chunks = service['chunkText'](longText, 1000);
      
      expect(chunks.length).toBeGreaterThan(1);
      chunks.forEach(chunk => {
        expect(service['estimateTokenCount'](chunk)).toBeLessThanOrEqual(1000);
      });
    });
  });

  describe('language detection and support', () => {
    it('should detect and handle multiple languages', async () => {
      const multilingualText = 'Environmental compliance. Conformité environnementale. 环境合规。';
      
      const mockResponse: AxiosResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                detectedLanguages: [
                  { language: 'en', confidence: 0.9 },
                  { language: 'fr', confidence: 0.85 },
                  { language: 'zh', confidence: 0.8 },
                ],
                entities: [
                  { text: 'Environmental compliance', type: 'CONCEPT', confidence: 0.9, language: 'en' },
                  { text: 'Conformité environnementale', type: 'CONCEPT', confidence: 0.85, language: 'fr' },
                  { text: '环境合规', type: 'CONCEPT', confidence: 0.8, language: 'zh' },
                ],
              }),
            },
          }],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await service['detectLanguage'](multilingualText);

      expect(result.detectedLanguages).toHaveLength(3);
      expect(result.entities).toHaveLength(3);
      expect(result.entities.every(e => e.language)).toBe(true);
    });
  });
});