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
  category: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
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
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
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
  framework: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  solution: string;
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
        department: 'Sustainability & Compliance'
      },
      token: 'mock-jwt-token-123'
    };
  }

  // Simula upload de contrato
  async uploadContract(upload: ContractUpload): Promise<{ contractId: string; status: string }> {
    await this.delay(2000);
    
    // Simula progresso de upload
    const contractId = `contract-${Date.now()}`;
    
    return {
      contractId,
      status: 'uploaded'
    };
  }

  // Simula análise ESG do contrato
  async analyzeContract(contractId: string): Promise<ESGAnalysisResult> {
    await this.delay(3000);

    // Dados simulados baseados em cenários reais do setor
    const mockResult: ESGAnalysisResult = {
      contractId,
      fileName: 'Shell-Upstream-Contract-2024.pdf',
      uploadDate: new Date().toISOString(),
      overallScore: 78.5,
      confidence: 0.92,
      categories: {
        environmental: {
          score: 85,
          findings: [
            {
              text: 'Compromisso de redução de 40% nas emissões de CO2 até 2030',
              category: 'Climate Action',
              confidence: 0.95,
              sentiment: 'POSITIVE'
            },
            {
              text: 'Certificação ISO 14001 obrigatória para todas as operações',
              category: 'Environmental Management',
              confidence: 0.91,
              sentiment: 'POSITIVE'
            },
            {
              text: 'Ausência de plano específico para proteção da biodiversidade marinha',
              category: 'Biodiversity',
              confidence: 0.87,
              sentiment: 'NEGATIVE'
            }
          ],
          risks: [
            {
              id: 'env-001',
              level: 'MEDIUM',
              category: 'ENVIRONMENTAL',
              title: 'Risco de Vazamento Offshore',
              description: 'Operações em águas profundas sem plano de contingência detalhado',
              impact: 'Potencial dano ambiental significativo e multas regulatórias',
              recommendation: 'Implementar sistema de monitoramento 24/7 e plano de resposta a emergências'
            }
          ],
          strengths: [
            'Metas de emissões alinhadas com Acordo de Paris',
            'Certificação ambiental internacional obrigatória',
            'Investimento em tecnologias de captura de carbono'
          ],
          weaknesses: [
            'Falta plano específico para biodiversidade',
            'Ausência de métricas para economia circular'
          ]
        },
        social: {
          score: 72,
          findings: [
            {
              text: 'Garantia de direitos trabalhistas conforme OIT',
              category: 'Labor Rights',
              confidence: 0.89,
              sentiment: 'POSITIVE'
            },
            {
              text: 'Programa de desenvolvimento para comunidades locais',
              category: 'Community Relations',
              confidence: 0.84,
              sentiment: 'POSITIVE'
            },
            {
              text: 'Falta de consulta prévia com povos indígenas',
              category: 'Indigenous Rights',
              confidence: 0.92,
              sentiment: 'NEGATIVE'
            }
          ],
          risks: [
            {
              id: 'soc-001',
              level: 'HIGH',
              category: 'SOCIAL',
              title: 'Conflito com Comunidades Indígenas',
              description: 'Operações em território tradicional sem consulta prévia adequada',
              impact: 'Risco de paralisação das operações e danos reputacionais',
              recommendation: 'Implementar protocolo de consulta livre, prévia e informada'
            }
          ],
          strengths: [
            'Conformidade com padrões internacionais de trabalho',
            'Programas de capacitação profissional',
            'Investimento em infraestrutura local'
          ],
          weaknesses: [
            'Ausência de consulta com povos indígenas',
            'Falta de métricas de diversidade e inclusão'
          ]
        },
        governance: {
          score: 91,
          findings: [
            {
              text: 'Comitê de auditoria independente estabelecido',
              category: 'Corporate Governance',
              confidence: 0.96,
              sentiment: 'POSITIVE'
            },
            {
              text: 'Canal de denúncias anônimas implementado',
              category: 'Ethics & Compliance',
              confidence: 0.93,
              sentiment: 'POSITIVE'
            },
            {
              text: 'Transparência total em relatórios financeiros e ESG',
              category: 'Transparency',
              confidence: 0.88,
              sentiment: 'POSITIVE'
            }
          ],
          risks: [
            {
              id: 'gov-001',
              level: 'LOW',
              category: 'GOVERNANCE',
              title: 'Concentração de Poder Decisório',
              description: 'Falta de diversidade no conselho de administração',
              impact: 'Risco de decisões enviesadas e falta de perspectivas diversas',
              recommendation: 'Aumentar diversidade de gênero e origem no conselho'
            }
          ],
          strengths: [
            'Estrutura de governança robusta',
            'Auditoria independente estabelecida',
            'Transparência em relatórios',
            'Canal de ética funcional'
          ],
          weaknesses: [
            'Baixa diversidade no conselho',
            'Falta de metas ESG vinculadas à remuneração'
          ]
        }
      },
      risks: [
        {
          id: 'risk-critical-001',
          level: 'CRITICAL',
          category: 'ENVIRONMENTAL',
          title: 'Risco Climático Físico',
          description: 'Instalações em região com alta probabilidade de eventos climáticos extremos',
          impact: 'Interrupção das operações e perdas financeiras significativas',
          recommendation: 'Implementar análise de cenários climáticos e plano de adaptação'
        },
        {
          id: 'risk-high-001',
          level: 'HIGH',
          category: 'SOCIAL',
          title: 'Licença Social para Operar',
          description: 'Resistência comunitária devido à falta de engajamento adequado',
          impact: 'Atrasos no projeto e custos adicionais de mediação',
          recommendation: 'Estabelecer programa contínuo de engajamento comunitário'
        }
      ],
      recommendations: [
        {
          id: 'rec-001',
          category: 'ENVIRONMENTAL',
          priority: 'HIGH',
          title: 'Implementar Plano de Biodiversidade',
          description: 'Desenvolver estratégia específica para proteção da biodiversidade marinha',
          action: 'Contratar consultoria especializada e realizar estudo de impacto',
          timeline: '6 meses'
        },
        {
          id: 'rec-002',
          category: 'SOCIAL',
          priority: 'CRITICAL',
          title: 'Protocolo de Consulta Indígena',
          description: 'Estabelecer processo formal de consulta livre, prévia e informada',
          action: 'Parceria com FUNAI e organizações indígenas',
          timeline: '3 meses'
        },
        {
          id: 'rec-003',
          category: 'GOVERNANCE',
          priority: 'MEDIUM',
          title: 'Diversificar Conselho de Administração',
          description: 'Aumentar representatividade de gênero e origem étnica',
          action: 'Revisar política de nomeação e buscar candidatos diversos',
          timeline: '12 meses'
        }
      ],
      compliance: {
        status: 'PARTIALLY_COMPLIANT',
        frameworks: {
          gri: {
            score: 82,
            compliant: true,
            details: [
              'GRI 305: Emissões - Compliant',
              'GRI 403: Saúde e Segurança - Compliant',
              'GRI 413: Comunidades Locais - Parcialmente Compliant'
            ]
          },
          sasb: {
            score: 75,
            compliant: true,
            details: [
              'SASB EM-EP-110a.1: Emissões de GEE - Compliant',
              'SASB EM-EP-210a.1: Gestão de Água - Compliant',
              'SASB EM-EP-510a.1: Direitos Indígenas - Não Compliant'
            ]
          },
          tcfd: {
            score: 88,
            compliant: true,
            details: [
              'Governança: Compliant',
              'Estratégia: Compliant',
              'Gestão de Riscos: Compliant',
              'Métricas e Metas: Parcialmente Compliant'
            ]
          },
          ipieca: {
            score: 79,
            compliant: true,
            details: [
              'Princípio 1: Ética e Transparência - Compliant',
              'Princípio 2: Gestão Ambiental - Compliant',
              'Princípio 3: Saúde e Segurança - Compliant'
            ]
          }
        },
        issues: [
          {
            framework: 'SASB',
            severity: 'HIGH',
            description: 'Ausência de protocolo para direitos indígenas conforme EM-EP-510a.1',
            solution: 'Implementar processo de consulta livre, prévia e informada'
          },
          {
            framework: 'GRI',
            severity: 'MEDIUM',
            description: 'Relatório de engajamento comunitário incompleto (GRI 413)',
            solution: 'Documentar todas as atividades de engajamento e seus resultados'
          }
        ]
      }
    };

    return mockResult;
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