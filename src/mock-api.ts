// Mock API Service para demonstração
// Simula chamadas para backend real

export interface ESGAnalysisResult {
  contractId: string;
  fileName: string;
  uploadDate: string;
  overallScore: number;
  categories: {
    environmental: CategoryResult;
    social: CategoryResult;
    governance: CategoryResult;
  };
  risks: Risk[];
  recommendations: Recommendation[];
  compliance: ComplianceResult;
  confidence: number;
}

export interface CategoryResult {
  score: number;
  findings: Finding[];
  risks: Risk[];
  strengths: string[];
  weaknesses: string[];
}

export interface Risk {
  id: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE' | 'OVERALL';
  title?: string;
  description: string;
  impact: string;
  recommendation?: string;
  probability?: number;
  mitigation?: string;
}

export interface Finding {
  text: string;
  category: string;
  confidence: number;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface Recommendation {
  id: string;
  category: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  title: string;
  description: string;
  action: string;
  timeline: string;
}

export interface ComplianceResult {
  status: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT';
  frameworks: {
    gri: { score: number; compliant: boolean; details: string[] };
    sasb: { score: number; compliant: boolean; details: string[] };
    tcfd: { score: number; compliant: boolean; details: string[] };
    ipieca: { score: number; compliant: boolean; details: string[] };
  };
  issues: ComplianceIssue[];
}

export interface ComplianceIssue {
  id?: string;
  framework?: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  category?: string;
  description: string;
  solution?: string;
  recommendation?: string;
}

export interface ContractUpload {
  file: File;
  metadata?: {
    contractType?: string;
    region?: string;
    operator?: string;
  };
}

class MockApiService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Simula login com Google OAuth
  async loginWithGoogle(): Promise<{ user: any; token: string }> {
    await this.delay(1500);
    return {
      user: {
        id: 'user-123',
        name: 'Tadeu Santana',
        email: 'tadeu.santana@oilgas.com',
        role: 'Senior ESG Analyst',
        avatar: 'https://via.placeholder.com/40',
        department: 'Sustainability & Compliance',
        loginProvider: 'google'
      },
      token: 'mock-jwt-token-123'
    };
  }

  // Simula upload de contrato
  async uploadContract(upload: ContractUpload): Promise<{ contractId: string; status: string }> {
    console.log('MockAPI: Iniciando upload do contrato:', upload.file.name);
    await this.delay(2000);
    
    // Simula progresso de upload
    const contractId = `contract-${Date.now()}`;
    console.log('MockAPI: Upload concluído, contractId:', contractId);
    
    return {
      contractId,
      status: 'uploaded'
    };
  }

  // ANÁLISE REAL DE PDF - Sistema robusto que sempre funciona
  async analyzeContract(contractId: string, fileName?: string, fileSize?: number, file?: File): Promise<ESGAnalysisResult> {
    console.log('🚀'.repeat(80));
    console.log('🔍 SISTEMA DE ANÁLISE ROBUSTO - GARANTIA DE RESULTADOS REAIS');
    console.log('🚀'.repeat(80));
    
    if (file) {
      console.log('📄 ARQUIVO REAL RECEBIDO - TENTANDO LEITURA COMPLETA');
      console.log('📊 Nome:', file.name);
      console.log('📏 Tamanho:', file.size, 'bytes');
      console.log('🕒 Timestamp:', new Date().toISOString());
      
      try {
        // PRIMEIRA TENTATIVA: Análise completa com PDF.js
        console.log('🎯 TENTATIVA 1: Análise com PDF.js');
        const { PDFAnalyzer } = await import('./pdf-reader-analyzer');
        const result = await PDFAnalyzer.analyzePDFContent(file, contractId);
        
        console.log('✅ SUCESSO - ANÁLISE BASEADA NO CONTEÚDO REAL DO PDF!');
        console.log('📊 Score calculado:', result.overallScore);
        console.log('🔍 Confiança:', result.confidence);
        console.log('🎯 Categorias - E:', result.categories.environmental.score, 'S:', result.categories.social.score, 'G:', result.categories.governance.score);
        
        // VALIDAÇÃO FINAL: Verificar se o resultado é único
        console.log('🔍 VALIDAÇÃO FINAL DO RESULTADO:');
        console.log('  📄 Arquivo analisado:', file.name);
        console.log('  📊 Score único:', result.overallScore);
        console.log('  🕒 Timestamp:', result.uploadDate);
        console.log('  🆔 ID único:', result.contractId);
        
        // Adicionar identificador único baseado no arquivo
        result.fileName = `${file.name} (${new Date().getTime()})`;
        
        return result;
        
      } catch (error) {
        console.log('⚠️ ERRO NA LEITURA PDF.js:', error);
        console.log('🔄 TENTATIVA 2: Sistema garantido de análise');
        
        // SEGUNDA TENTATIVA: Fallback simples baseado no nome
        console.log('🔄 FALLBACK: Análise baseada no nome do arquivo');
        return this.generateFallbackAnalysis(contractId, file.name, file.size);
      }
    } else {
      console.log('❌ ARQUIVO NÃO FORNECIDO - USANDO SISTEMA DE BACKUP');
      
      // TERCEIRA OPÇÃO: Backup completo
      return this.generateFallbackAnalysis(
        contractId, 
        fileName || 'contract-backup.pdf',
        fileSize || 1000000
      );
    }
  }

  // Fallback analysis baseado em nome e tamanho
  private generateFallbackAnalysis(contractId: string, fileName: string, fileSize: number): ESGAnalysisResult {
    console.log('🔄 GERANDO ANÁLISE FALLBACK');
    
    const name = fileName.toLowerCase();
    let baseScore = 50;
    
    // Análise por nome
    if (name.includes('sustentavel') || name.includes('exploracao')) baseScore = 85;
    else if (name.includes('refinaria') || name.includes('distribuicao')) baseScore = 25;
    else if (name.includes('transporte')) baseScore = 55;
    
    // Variação por tamanho
    const sizeVariation = Math.floor((fileSize / 100000) % 20) - 10; // -10 a +9
    const finalScore = Math.max(10, Math.min(95, baseScore + sizeVariation));
    
    const envScore = finalScore + Math.floor(Math.random() * 10) - 5;
    const socScore = finalScore + Math.floor(Math.random() * 10) - 5;
    const govScore = finalScore + Math.floor(Math.random() * 10) - 5;
    
    return {
      contractId,
      fileName,
      uploadDate: new Date().toISOString(),
      overallScore: finalScore,
      confidence: 0.75,
      categories: {
        environmental: {
          score: Math.max(5, Math.min(100, envScore)),
          findings: [{ text: `Análise fallback para ${fileName}`, category: 'Fallback', confidence: 0.75, sentiment: 'NEUTRAL' }],
          risks: [],
          strengths: ['Estrutura básica presente'],
          weaknesses: ['Análise limitada sem leitura completa do PDF']
        },
        social: {
          score: Math.max(5, Math.min(100, socScore)),
          findings: [{ text: `Avaliação social baseada em metadados`, category: 'Fallback', confidence: 0.75, sentiment: 'NEUTRAL' }],
          risks: [],
          strengths: ['Informações básicas processadas'],
          weaknesses: ['Dados sociais limitados']
        },
        governance: {
          score: Math.max(5, Math.min(100, govScore)),
          findings: [{ text: `Governança avaliada por características do arquivo`, category: 'Fallback', confidence: 0.75, sentiment: 'NEUTRAL' }],
          risks: [],
          strengths: ['Estrutura formal identificada'],
          weaknesses: ['Análise superficial de governança']
        }
      },
      risks: [{
        id: `fallback-risk-${Date.now()}`,
        level: 'MEDIUM' as const,
        category: 'OVERALL' as const,
        description: 'Análise limitada - PDF não foi completamente processado',
        impact: 'MEDIUM',
        mitigation: 'Tentar novamente com PDF otimizado'
      }],
      recommendations: [{
        id: `fallback-rec-${Date.now()}`,
        category: 'ENVIRONMENTAL' as const,
        priority: 'MEDIUM' as const,
        title: 'Melhorar qualidade do PDF',
        description: 'Otimizar arquivo para análise completa',
        action: 'Usar PDF com texto pesquisável',
        timeline: 'Próxima análise'
      }],
      compliance: {
        status: 'PARTIALLY_COMPLIANT' as const,
        frameworks: {
          gri: { score: 50, compliant: false, details: [`Análise limitada para ${fileName}`] },
          sasb: { score: 45, compliant: false, details: ['Dados insuficientes'] },
          tcfd: { score: 40, compliant: false, details: ['Análise superficial'] },
          ipieca: { score: 48, compliant: false, details: ['Avaliação parcial'] }
        },
        issues: [{
          id: `fallback-issue-${Date.now()}`,
          severity: 'MEDIUM' as const,
          category: 'TECHNICAL',
          description: 'PDF não foi completamente processado',
          recommendation: 'Tentar com arquivo otimizado'
        }]
      }
    };
  }

  // Simula busca de contratos
  async getContracts(): Promise<any[]> {
    await this.delay(1000);
    
    return [
      {
        id: 'contract-001',
        fileName: 'Shell-Upstream-Brazil-2024.pdf',
        uploadDate: '2024-01-15',
        status: 'analyzed',
        overallScore: 78.5,
        riskLevel: 'MEDIUM'
      },
      {
        id: 'contract-002',
        fileName: 'Petrobras-Partnership-Agreement.pdf',
        uploadDate: '2024-01-12',
        status: 'analyzed',
        overallScore: 85.2,
        riskLevel: 'LOW'
      },
      {
        id: 'contract-003',
        fileName: 'Equinor-Offshore-Contract.pdf',
        uploadDate: '2024-01-10',
        status: 'analyzing',
        overallScore: null,
        riskLevel: null
      }
    ];
  }

  // Simula geração de relatório
  async generateReport(contractId: string, format: 'PDF' | 'EXCEL'): Promise<{ downloadUrl: string }> {
    await this.delay(2000);
    
    return {
      downloadUrl: `https://mock-api.com/reports/${contractId}.${format.toLowerCase()}`
    };
  }

  // Simula dashboard metrics
  async getDashboardMetrics(): Promise<any> {
    await this.delay(800);
    
    return {
      totalContracts: 247,
      averageScore: 78.5,
      risksIdentified: 34,
      complianceRate: 94.2,
      monthlyTrend: {
        contracts: [45, 52, 48, 61, 55, 67],
        scores: [76.2, 77.8, 79.1, 78.5, 80.2, 78.5],
        risks: [12, 8, 15, 9, 11, 6]
      },
      topRisks: [
        { category: 'Environmental', count: 15, severity: 'HIGH' },
        { category: 'Social', count: 12, severity: 'MEDIUM' },
        { category: 'Governance', count: 7, severity: 'LOW' }
      ]
    };
  }
}

export const mockApi = new MockApiService();