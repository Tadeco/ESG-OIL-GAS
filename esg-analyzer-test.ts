import { Test, TestingModule } from '@nestjs/testing';
import { ESGAnalyzerService } from './esgAnalyzer.service';
import { NLPService } from '../nlp/nlp.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';
import { MetricsService } from '../monitoring/metrics.service';
import { 
  ESGAnalysisResult, 
  ESGCategory, 
  RiskLevel,
  ComplianceStatus 
} from './interfaces/esg.interface';

describe('ESGAnalyzerService', () => {
  let service: ESGAnalyzerService;
  let nlpService: NLPService;
  let configService: ConfigService;
  let cacheManager: Cache;
  let metricsService: MetricsService;

  const mockNLPService = {
    analyzeText: jest.fn(),
    extractEntities: jest.fn(),
    analyzeSentiment: jest.fn(),
    classifyText: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      const config = {
        'openai.apiKey': 'test-api-key',
        'esg.analysisModel': 'gpt-4',
        'esg.confidenceThreshold': 0.7,
        'cache.ttl': 3600,
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

  const mockMetricsService = {
    incrementCounter: jest.fn(),
    recordHistogram: jest.fn(),
    recordGauge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ESGAnalyzerService,
        { provide: NLPService, useValue: mockNLPService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: MetricsService, useValue: mockMetricsService },
        Logger,
      ],
    }).compile();

    service = module.get<ESGAnalyzerService>(ESGAnalyzerService);
    nlpService = module.get<NLPService>(NLPService);
    configService = module.get<ConfigService>(ConfigService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeContract', () => {
    const mockContractText = `
      This agreement establishes environmental compliance standards requiring 
      the contractor to reduce carbon emissions by 30% and implement sustainable 
      waste management practices. The contractor must ensure fair labor practices 
      and maintain ISO 14001 certification.
    `;

    const mockNLPAnalysis = {
      entities: [
        { text: 'carbon emissions', type: 'ENVIRONMENTAL_METRIC', confidence: 0.9 },
        { text: 'ISO 14001', type: 'CERTIFICATION', confidence: 0.95 },
        { text: 'fair labor practices', type: 'SOCIAL_POLICY', confidence: 0.88 },
      ],
      sentiment: { score: 0.7, magnitude: 0.8 },
      categories: [
        { name: 'Environmental Compliance', confidence: 0.92 },
        { name: 'Labor Standards', confidence: 0.85 },
      ],
    };

    beforeEach(() => {
      mockNLPService.analyzeText.mockResolvedValue(mockNLPAnalysis);
      mockNLPService.extractEntities.mockResolvedValue(mockNLPAnalysis.entities);
      mockNLPService.analyzeSentiment.mockResolvedValue(mockNLPAnalysis.sentiment);
      mockNLPService.classifyText.mockResolvedValue(mockNLPAnalysis.categories);
    });

    it('should successfully analyze ESG contract', async () => {
      const result = await service.analyzeContract(mockContractText);

      expect(result).toBeDefined();
      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(result.categories).toHaveProperty('environmental');
      expect(result.categories).toHaveProperty('social');
      expect(result.categories).toHaveProperty('governance');
      expect(result.risks).toBeInstanceOf(Array);
      expect(result.recommendations).toBeInstanceOf(Array);
      expect(mockMetricsService.incrementCounter).toHaveBeenCalledWith('esg_analysis_total');
    });

    it('should cache analysis results', async () => {
      const cacheKey = service['generateCacheKey'](mockContractText);
      mockCacheManager.get.mockResolvedValue(null);

      await service.analyzeContract(mockContractText);

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        cacheKey,
        expect.any(Object),
        expect.any(Number)
      );
    });

    it('should return cached results when available', async () => {
      const cachedResult: ESGAnalysisResult = {
        overallScore: 85,
        categories: {
          environmental: { score: 90, findings: [], risks: [] },
          social: { score: 80, findings: [], risks: [] },
          governance: { score: 85, findings: [], risks: [] },
        },
        risks: [],
        recommendations: [],
        confidence: 0.9,
        timestamp: new Date(),
      };

      mockCacheManager.get.mockResolvedValue(cachedResult);

      const result = await service.analyzeContract(mockContractText);

      expect(result).toEqual(cachedResult);
      expect(mockNLPService.analyzeText).not.toHaveBeenCalled();
    });

    it('should handle analysis errors gracefully', async () => {
      mockNLPService.analyzeText.mockRejectedValue(new Error('NLP service error'));

      await expect(service.analyzeContract(mockContractText)).rejects.toThrow('NLP service error');
      expect(mockMetricsService.incrementCounter).toHaveBeenCalledWith('esg_analysis_errors');
    });

    it('should detect high-risk ESG issues', async () => {
      const riskyContract = `
        The contractor may employ child labor if necessary to meet deadlines.
        Environmental regulations can be bypassed for cost savings.
        No governance oversight required.
      `;

      mockNLPService.analyzeText.mockResolvedValue({
        entities: [
          { text: 'child labor', type: 'RISK_FACTOR', confidence: 0.95 },
          { text: 'bypassed', type: 'NEGATIVE_ACTION', confidence: 0.9 },
        ],
        sentiment: { score: -0.8, magnitude: 0.9 },
        categories: [
          { name: 'Labor Violations', confidence: 0.95 },
          { name: 'Environmental Non-Compliance', confidence: 0.9 },
        ],
      });

      const result = await service.analyzeContract(riskyContract);

      expect(result.risks).toContainEqual(
        expect.objectContaining({
          level: RiskLevel.HIGH,
          category: expect.any(String),
        })
      );
      expect(result.overallScore).toBeLessThan(50);
    });
  });

  describe('calculateESGScore', () => {
    it('should calculate weighted ESG scores correctly', () => {
      const categories = {
        environmental: { score: 80, findings: [], risks: [] },
        social: { score: 70, findings: [], risks: [] },
        governance: { score: 90, findings: [], risks: [] },
      };

      const score = service['calculateOverallScore'](categories);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeCloseTo(80, 0); // Weighted average
    });

    it('should apply risk penalties to scores', () => {
      const categories = {
        environmental: { 
          score: 80, 
          findings: [], 
          risks: [{ level: RiskLevel.HIGH, description: 'High risk', category: ESGCategory.ENVIRONMENTAL }] 
        },
        social: { score: 70, findings: [], risks: [] },
        governance: { score: 90, findings: [], risks: [] },
      };

      const scoreWithRisk = service['calculateOverallScore'](categories);
      const scoreWithoutRisk = 80; // Base score

      expect(scoreWithRisk).toBeLessThan(scoreWithoutRisk);
    });
  });

  describe('generateRecommendations', () => {
    it('should generate relevant recommendations based on findings', () => {
      const findings = [
        {
          text: 'No carbon reduction targets specified',
          category: ESGCategory.ENVIRONMENTAL,
          confidence: 0.9,
        },
        {
          text: 'Lack of diversity policies',
          category: ESGCategory.SOCIAL,
          confidence: 0.85,
        },
      ];

      const recommendations = service['generateRecommendations'](findings, []);

      expect(recommendations).toContainEqual(
        expect.objectContaining({
          category: ESGCategory.ENVIRONMENTAL,
          priority: expect.any(String),
        })
      );
      expect(recommendations).toContainEqual(
        expect.objectContaining({
          category: ESGCategory.SOCIAL,
          priority: expect.any(String),
        })
      );
    });

    it('should prioritize recommendations based on risk level', () => {
      const risks = [
        {
          level: RiskLevel.HIGH,
          category: ESGCategory.GOVERNANCE,
          description: 'No audit requirements',
        },
        {
          level: RiskLevel.LOW,
          category: ESGCategory.ENVIRONMENTAL,
          description: 'Minor reporting gaps',
        },
      ];

      const recommendations = service['generateRecommendations']([], risks);

      const highPriorityRecs = recommendations.filter(r => r.priority === 'HIGH');
      expect(highPriorityRecs.length).toBeGreaterThan(0);
      expect(highPriorityRecs[0].category).toBe(ESGCategory.GOVERNANCE);
    });
  });

  describe('validateComplianceRequirements', () => {
    it('should validate against regulatory requirements', async () => {
      const contractText = 'Contract must comply with EU Taxonomy and TCFD reporting standards';
      
      const compliance = await service['validateCompliance'](contractText);

      expect(compliance).toHaveProperty('status');
      expect(compliance).toHaveProperty('frameworks');
      expect(compliance.frameworks).toContain('EU_TAXONOMY');
      expect(compliance.frameworks).toContain('TCFD');
    });

    it('should detect non-compliance issues', async () => {
      const contractText = 'No environmental reporting required';
      
      mockNLPService.analyzeText.mockResolvedValue({
        entities: [{ text: 'No environmental reporting', type: 'NEGATIVE', confidence: 0.9 }],
        sentiment: { score: -0.5, magnitude: 0.7 },
        categories: [{ name: 'Non-Compliance', confidence: 0.85 }],
      });

      const compliance = await service['validateCompliance'](contractText);

      expect(compliance.status).toBe(ComplianceStatus.NON_COMPLIANT);
      expect(compliance.issues).toHaveLength(1);
    });
  });

  describe('performance and reliability', () => {
    it('should handle large contracts efficiently', async () => {
      const largeContract = 'Lorem ipsum '.repeat(10000); // ~20k words
      const startTime = Date.now();

      await service.analyzeContract(largeContract);

      const executionTime = Date.now() - startTime;
      expect(executionTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle concurrent analyses', async () => {
      const contracts = Array(10).fill(null).map((_, i) => `Contract ${i} content`);
      
      const results = await Promise.all(
        contracts.map(contract => service.analyzeContract(contract))
      );

      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toHaveProperty('overallScore');
        expect(result).toHaveProperty('categories');
      });
    });

    it('should recover from transient failures', async () => {
      let callCount = 0;
      mockNLPService.analyzeText.mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error('Transient error'));
        }
        return Promise.resolve({
          entities: [],
          sentiment: { score: 0, magnitude: 0 },
          categories: [],
        });
      });

      const result = await service.analyzeContract('Test contract');

      expect(result).toBeDefined();
      expect(callCount).toBe(3);
    });
  });
});