// SOLUÇÃO ROBUSTA - MockAPI que realmente funciona
import { ESGAnalysisResult } from './mock-api';

export class RobustMockAPI {
  
  // Análise robusta que sempre retorna resultado
  static async analyzeContractRobust(contractId: string, fileName: string, fileSize: number): Promise<ESGAnalysisResult> {
    console.log('🔍 ROBUST ANALYSIS STARTED');
    console.log('📄 File Name:', fileName);
    console.log('📊 File Size:', fileSize, 'bytes');
    console.log('🆔 Contract ID:', contractId);
    
    // Determina tipo baseado em múltiplos critérios
    const contractType = this.determineContractTypeRobust(fileName, fileSize);
    console.log('🎯 Contract Type Detected:', contractType);
    
    // Simula tempo de processamento
    await this.delay(2000);
    
    const result = this.generateContractResult(contractId, fileName, contractType);
    
    console.log('✅ ANALYSIS COMPLETE - Result Generated:', result);
    console.log('📈 Overall Score:', result.overallScore);
    console.log('🌱 Environmental Score:', result.categories.environmental.score);
    console.log('👥 Social Score:', result.categories.social.score);
    console.log('🏛️ Governance Score:', result.categories.governance.score);
    
    return result;
  }
  
  // Detecção robusta - múltiplos critérios
  private static determineContractTypeRobust(fileName: string, fileSize: number): 'excellent' | 'problematic' | 'critical' {
    const name = fileName.toLowerCase();
    
    console.log('🔍 Analyzing file characteristics:');
    console.log('  📝 Filename keywords:', name);
    console.log('  📏 File size category:', this.getFileSizeCategory(fileSize));
    
    // Detecção por nome do arquivo
    if (name.includes('sustentavel') || name.includes('exploracao') || name.includes('upstream') || 
        name.includes('green') || name.includes('eco') || name.includes('sustainable')) {
      console.log('  ✅ EXCELLENT contract detected by filename');
      return 'excellent';
    }
    
    if (name.includes('refinaria') || name.includes('distribuicao') || name.includes('downstream') || 
        name.includes('refinery') || name.includes('industrial')) {
      console.log('  ⚠️ CRITICAL contract detected by filename');
      return 'critical';
    }
    
    if (name.includes('transporte') || name.includes('oleoduto') || name.includes('midstream') || 
        name.includes('pipeline') || name.includes('transport')) {
      console.log('  🟡 PROBLEMATIC contract detected by filename');
      return 'problematic';
    }
    
    // Fallback baseado em tamanho (arquivos maiores = mais complexos = mais problemas potenciais)
    if (fileSize > 5000000) { // > 5MB
      console.log('  ⚠️ CRITICAL contract detected by large file size');
      return 'critical';
    } else if (fileSize > 2000000) { // > 2MB
      console.log('  🟡 PROBLEMATIC contract detected by medium file size');
      return 'problematic';
    } else {
      console.log('  ✅ EXCELLENT contract detected by small file size (likely simple/clean)');
      return 'excellent';
    }
  }
  
  private static getFileSizeCategory(size: number): string {
    if (size > 5000000) return 'Large (>5MB)';
    if (size > 2000000) return 'Medium (2-5MB)';
    if (size > 500000) return 'Small (0.5-2MB)';
    return 'Tiny (<0.5MB)';
  }
  
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Gera resultado específico por tipo
  private static generateContractResult(contractId: string, fileName: string, type: string): ESGAnalysisResult {
    const timestamp = new Date().toISOString();
    
    switch (type) {
      case 'excellent':
        return {
          contractId,
          fileName,
          uploadDate: timestamp,
          overallScore: 91.8,
          confidence: 0.94,
          categories: {
            environmental: {
              score: 94,
              findings: [
                { text: 'Compromisso de neutralidade de carbono até 2030', category: 'Climate', confidence: 0.95, sentiment: 'POSITIVE' },
                { text: 'Sistema avançado de monitoramento da biodiversidade', category: 'Biodiversity', confidence: 0.92, sentiment: 'POSITIVE' },
                { text: 'Certificação ISO 14001 obrigatória', category: 'Standards', confidence: 0.98, sentiment: 'POSITIVE' }
              ],
              risks: [
                { id: 'env-low-001', level: 'LOW' as const, category: 'ENVIRONMENTAL', description: 'Risco mínimo de vazamentos com tecnologia avançada', probability: 0.05, impact: 'LOW', mitigation: 'Monitoramento 24/7 implementado' }
              ],
              strengths: ['Zero incidentes ambientais', 'Investimento R$ 500M em tecnologias limpas', 'Parcerias com ONGs ambientais'],
              weaknesses: ['Dependência de fornecedores terceiros para algumas tecnologias verdes']
            },
            social: {
              score: 89,
              findings: [
                { text: '70% de contratação local prioritária', category: 'Employment', confidence: 0.93, sentiment: 'POSITIVE' },
                { text: 'Programa educacional para 10.000 jovens', category: 'Education', confidence: 0.91, sentiment: 'POSITIVE' },
                { text: 'Fundo de desenvolvimento comunitário R$ 100M', category: 'Community', confidence: 0.96, sentiment: 'POSITIVE' }
              ],
              risks: [
                { id: 'soc-low-001', level: 'LOW' as const, category: 'SOCIAL', description: 'Baixo risco de conflitos devido ao forte engajamento', probability: 0.1, impact: 'LOW', mitigation: 'Diálogo permanente com lideranças' }
              ],
              strengths: ['Consulta prévia exemplar', 'Programas de saúde para comunidades', 'Centro de treinamento profissional'],
              weaknesses: ['Necessidade de ampliar diversidade em cargos executivos']
            },
            governance: {
              score: 92,
              findings: [
                { text: 'Auditoria ESG independente trimestral', category: 'Transparency', confidence: 0.97, sentiment: 'POSITIVE' },
                { text: 'Comitê de sustentabilidade com 60% de membros independentes', category: 'Governance', confidence: 0.95, sentiment: 'POSITIVE' },
                { text: 'Portal público com dados em tempo real', category: 'Transparency', confidence: 0.94, sentiment: 'POSITIVE' }
              ],
              risks: [
                { id: 'gov-low-001', level: 'LOW' as const, category: 'GOVERNANCE', description: 'Estrutura sólida com mínimo risco de compliance', probability: 0.03, impact: 'LOW', mitigation: 'Revisões regulares e atualizações normativas' }
              ],
              strengths: ['Transparência total', 'Whistleblower protection', 'Relatórios públicos detalhados'],
              weaknesses: ['Processos podem ser lentos devido ao rigor']
            }
          },
          risks: [
            { id: 'general-001', level: 'LOW' as const, category: 'ENVIRONMENTAL', description: 'Risco geral baixo devido às práticas exemplares', probability: 0.05, impact: 'LOW', mitigation: 'Monitoramento contínuo' }
          ],
          recommendations: [
            { id: 'rec-001', category: 'ENVIRONMENTAL' as const, priority: 'MEDIUM' as const, title: 'Acelerar inovação em energia renovável', description: 'Aumentar P&D em soluções energéticas', action: 'Investir adicional R$ 50M em pesquisa', timeline: '12 meses' },
            { id: 'rec-002', category: 'SOCIAL' as const, priority: 'LOW' as const, title: 'Expandir programas de diversidade', description: 'Aumentar representatividade nos conselhos', action: 'Meta de 40% mulheres em liderança', timeline: '18 meses' }
          ],
          compliance: {
            status: 'COMPLIANT' as const,
            frameworks: {
              gri: { score: 96, compliant: true, details: ['Excelência em todas as dimensões', 'Relatório exemplar'] },
              sasb: { score: 94, compliant: true, details: ['Métricas robustas', 'Benchmarking setorial'] },
              tcfd: { score: 92, compliant: true, details: ['Análise de cenários completa', 'Estratégia climática clara'] },
              ipieca: { score: 95, compliant: true, details: ['Liderança em práticas sustentáveis', 'Engajamento exemplar'] }
            },
            issues: []
          }
        };
        
      case 'critical':
        return {
          contractId,
          fileName,
          uploadDate: timestamp,
          overallScore: 28.4,
          confidence: 0.96,
          categories: {
            environmental: {
              score: 22,
              findings: [
                { text: 'Histórico de 18 acidentes ambientais graves', category: 'Safety', confidence: 0.98, sentiment: 'NEGATIVE' },
                { text: 'Localização em área de alta vulnerabilidade', category: 'Location', confidence: 0.94, sentiment: 'NEGATIVE' },
                { text: 'Emissões 300% acima do permitido', category: 'Emissions', confidence: 0.92, sentiment: 'NEGATIVE' }
              ],
              risks: [
                { id: 'env-crit-001', level: 'CRITICAL' as const, category: 'ENVIRONMENTAL', description: 'Risco extremo de catástrofe ambiental', probability: 0.85, impact: 'CRITICAL', mitigation: 'Inadequada - requer ação imediata' }
              ],
              strengths: ['Alguns equipamentos modernos instalados recentemente'],
              weaknesses: ['Histórico terrível de acidentes', 'Localização péssima', 'Falta de investimento em segurança', 'Multas ambientais recorrentes']
            },
            social: {
              score: 18,
              findings: [
                { text: 'Taxa de câncer 400% acima da média regional', category: 'Health', confidence: 0.97, sentiment: 'NEGATIVE' },
                { text: '80% dos funcionários são terceirizados sem direitos', category: 'Labor', confidence: 0.93, sentiment: 'NEGATIVE' },
                { text: 'Conflitos permanentes com 15 comunidades', category: 'Community', confidence: 0.95, sentiment: 'NEGATIVE' }
              ],
              risks: [
                { id: 'soc-crit-001', level: 'CRITICAL' as const, category: 'SOCIAL', description: 'Grave crise de saúde pública', probability: 0.9, impact: 'CRITICAL', mitigation: 'Inexistente - situação descontrolada' }
              ],
              strengths: ['Alguns programas sociais pontuais'],
              weaknesses: ['Impactos devastadores na saúde', 'Práticas trabalhistas questionáveis', 'Conflitos sociais permanentes', 'Zero engajamento real']
            },
            governance: {
              score: 45,
              findings: [
                { text: 'Relatórios financeiros com múltiplas ressalvas', category: 'Financial', confidence: 0.96, sentiment: 'NEGATIVE' },
                { text: 'Ouvidoria sobrecarregada - 5000 denúncias/ano', category: 'Ethics', confidence: 0.89, sentiment: 'NEGATIVE' },
                { text: 'Conselhos dominados por família controladora', category: 'Independence', confidence: 0.92, sentiment: 'NEGATIVE' }
              ],
              risks: [
                { id: 'gov-crit-001', level: 'HIGH' as const, category: 'GOVERNANCE', description: 'Sérios problemas de governança e compliance', probability: 0.75, impact: 'HIGH', mitigation: 'Reestruturação urgente necessária' }
              ],
              strengths: ['Estrutura formal existe'],
              weaknesses: ['Transparência mínima', 'Compliance deficiente', 'Conflitos de interesse', 'Auditoria comprometida']
            }
          },
          risks: [
            { id: 'general-crit', level: 'CRITICAL' as const, category: 'ENVIRONMENTAL', description: 'Operação representa risco sistêmico', probability: 0.8, impact: 'CRITICAL', mitigation: 'Intervenção regulatória recomendada' }
          ],
          recommendations: [
            { id: 'rec-crit-001', category: 'ENVIRONMENTAL' as const, priority: 'CRITICAL' as const, title: 'INTERRUPÇÃO IMEDIATA DAS OPERAÇÕES', description: 'Suspender atividades até correção dos problemas', action: 'Auditoria independente e plano de recuperação', timeline: 'IMEDIATO' },
            { id: 'rec-crit-002', category: 'SOCIAL' as const, priority: 'CRITICAL' as const, title: 'Programa emergencial de saúde', description: 'Atendimento médico para população afetada', action: 'Hospital de referência + monitoramento', timeline: '30 dias' },
            { id: 'rec-crit-003', category: 'GOVERNANCE' as const, priority: 'CRITICAL' as const, title: 'Reestruturação completa', description: 'Nova estrutura de governança', action: 'Conselho independente + compliance officer', timeline: '90 dias' }
          ],
          compliance: {
            status: 'NON_COMPLIANT' as const,
            frameworks: {
              gri: { score: 25, compliant: false, details: ['Múltiplas violações graves', 'Dados incompletos/incorretos'] },
              sasb: { score: 22, compliant: false, details: ['Métricas não reportadas', 'Impactos não quantificados'] },
              tcfd: { score: 18, compliant: false, details: ['Riscos climáticos ignorados', 'Sem estratégia'] },
              ipieca: { score: 20, compliant: false, details: ['Práticas totalmente inadequadas', 'Engajamento inexistente'] }
            },
            issues: [
              { id: 'issue-crit-001', severity: 'CRITICAL' as const, category: 'ENVIRONMENTAL', description: 'Operação representa ameaça ambiental', recommendation: 'Suspensão imediata até correções' },
              { id: 'issue-crit-002', severity: 'CRITICAL' as const, category: 'SOCIAL', description: 'Crise de saúde pública documentada', recommendation: 'Intervenção do Ministério da Saúde' }
            ]
          }
        };
        
      default: // problematic
        return {
          contractId,
          fileName,
          uploadDate: timestamp,
          overallScore: 56.7,
          confidence: 0.88,
          categories: {
            environmental: {
              score: 48,
              findings: [
                { text: 'Licenciamento ambiental parcialmente pendente', category: 'Licensing', confidence: 0.94, sentiment: 'NEGATIVE' },
                { text: 'Atravessa 2 áreas de preservação permanente', category: 'Protected Areas', confidence: 0.91, sentiment: 'NEGATIVE' },
                { text: 'Plano de contingência em elaboração', category: 'Emergency', confidence: 0.85, sentiment: 'NEGATIVE' }
              ],
              risks: [
                { id: 'env-med-001', level: 'HIGH' as const, category: 'ENVIRONMENTAL', description: 'Riscos significativos não totalmente mitigados', probability: 0.6, impact: 'HIGH', mitigation: 'Em desenvolvimento - precisa acelerar' }
              ],
              strengths: ['Tecnologia de detecção moderna', 'Algumas licenças já obtidas'],
              weaknesses: ['Licenciamento incompleto', 'Áreas sensíveis no traçado', 'Medidas mitigadoras atrasadas']
            },
            social: {
              score: 62,
              findings: [
                { text: 'Consulta a comunidades indígenas parcialmente realizada', category: 'Indigenous', confidence: 0.89, sentiment: 'NEGATIVE' },
                { text: '450 famílias precisam ser reassentadas', category: 'Resettlement', confidence: 0.93, sentiment: 'NEGATIVE' },
                { text: 'Compensações financeiras acordadas', category: 'Compensation', confidence: 0.87, sentiment: 'POSITIVE' }
              ],
              risks: [
                { id: 'soc-med-001', level: 'MEDIUM' as const, category: 'SOCIAL', description: 'Potencial para conflitos se consultas não forem concluídas', probability: 0.5, impact: 'MEDIUM', mitigation: 'Plano de engajamento sendo implementado' }
              ],
              strengths: ['Compensações adequadas previstas', 'Alguns acordos já firmados'],
              weaknesses: ['Consulta incompleta', 'Reassentamentos complexos', 'Cronograma apertado']
            },
            governance: {
              score: 60,
              findings: [
                { text: 'Comitê de sustentabilidade em formação', category: 'Governance', confidence: 0.82, sentiment: 'NEUTRAL' },
                { text: 'Auditoria independente contratada', category: 'Auditing', confidence: 0.91, sentiment: 'POSITIVE' },
                { text: 'Relatórios de progresso mensais', category: 'Reporting', confidence: 0.86, sentiment: 'POSITIVE' }
              ],
              risks: [
                { id: 'gov-med-001', level: 'MEDIUM' as const, category: 'GOVERNANCE', description: 'Estrutura de governança em transição', probability: 0.4, impact: 'MEDIUM', mitigation: 'Implementação de melhores práticas em andamento' }
              ],
              strengths: ['Compromisso com melhoria', 'Auditoria independente'],
              weaknesses: ['Estrutura ainda não completamente implementada', 'Processos em desenvolvimento']
            }
          },
          risks: [
            { id: 'general-med', level: 'HIGH' as const, category: 'ENVIRONMENTAL', description: 'Projeto viável mas precisa acelerar mitigações', probability: 0.5, impact: 'MEDIUM', mitigation: 'Cronograma de implementação sendo seguido' }
          ],
          recommendations: [
            { id: 'rec-med-001', category: 'ENVIRONMENTAL' as const, priority: 'HIGH' as const, title: 'Acelerar licenciamento', description: 'Obter licenças pendentes com urgência', action: 'Dedicar equipe exclusiva ao processo', timeline: '6 meses' },
            { id: 'rec-med-002', category: 'SOCIAL' as const, priority: 'HIGH' as const, title: 'Concluir consultas', description: 'Finalizar consulta a todas as comunidades', action: 'Cronograma intensivo de reuniões', timeline: '4 meses' },
            { id: 'rec-med-003', category: 'GOVERNANCE' as const, priority: 'MEDIUM' as const, title: 'Acelerar governança', description: 'Implementar estruturas ESG completas', action: 'Contratação de especialistas', timeline: '8 meses' }
          ],
          compliance: {
            status: 'PARTIALLY_COMPLIANT' as const,
            frameworks: {
              gri: { score: 65, compliant: false, details: ['Algumas diretrizes cumpridas', 'Lacunas em transparência'] },
              sasb: { score: 58, compliant: false, details: ['Métricas básicas reportadas', 'Dados incompletos'] },
              tcfd: { score: 52, compliant: false, details: ['Análise de riscos iniciada', 'Cenários em desenvolvimento'] },
              ipieca: { score: 60, compliant: false, details: ['Práticas parciais implementadas', 'Engajamento em progresso'] }
            },
            issues: [
              { id: 'issue-med-001', severity: 'HIGH' as const, category: 'ENVIRONMENTAL', description: 'Licenciamento incompleto', recommendation: 'Acelerar processo regulatório' },
              { id: 'issue-med-002', severity: 'MEDIUM' as const, category: 'SOCIAL', description: 'Consultas em andamento', recommendation: 'Finalizar engajamento comunitário' }
            ]
          }
        };
    }
  }
}