// TESTE SIMPLES DO SISTEMA DE ANÁLISE
import { PDFAnalyzer } from './pdf-reader-analyzer';

// Função para testar análise de texto
export function testKeywordAnalysis() {
  console.log('🧪 INICIANDO TESTE DE ANÁLISE DE PALAVRAS-CHAVE');
  
  // Texto de teste com palavras ESG conhecidas
  const testTexts = {
    sustainable: "Este contrato promove práticas sustentáveis e energia limpa, com certificação ambiental e monitoramento da biodiversidade.",
    problematic: "Operação com risco de vazamento, conflitos com comunidades locais e falta de transparência nos relatórios.",
    mixed: "Contrato de exploração sustentável mas com alguns conflitos e necessidade de auditoria independente."
  };
  
  Object.entries(testTexts).forEach(([type, text]) => {
    console.log(`\n🔍 TESTANDO TEXTO "${type.toUpperCase()}"`);
    console.log('📝 Texto:', text);
    
    // Chamar o método de análise diretamente
    const analysis = (PDFAnalyzer as any).analyzeKeywords(text);
    
    console.log('📊 RESULTADO:');
    console.log('  🟢 Positivas:', analysis.positive);
    console.log('  🔴 Negativas:', analysis.negative);
    console.log('  📋 Palavras encontradas:', analysis.keywords_found);
    
    // Calcular scores
    const envScore = (PDFAnalyzer as any).calculateScore(analysis.positive.environmental, analysis.negative.environmental);
    const socScore = (PDFAnalyzer as any).calculateScore(analysis.positive.social, analysis.negative.social);
    const govScore = (PDFAnalyzer as any).calculateScore(analysis.positive.governance, analysis.negative.governance);
    
    console.log('📈 SCORES:');
    console.log(`  🌱 Environmental: ${envScore}`);
    console.log(`  👥 Social: ${socScore}`);
    console.log(`  🏛️ Governance: ${govScore}`);
    console.log(`  📊 Overall: ${Math.round((envScore + socScore + govScore) / 3)}`);
  });
  
  console.log('\n✅ TESTE CONCLUÍDO');
}

// Auto-executar se chamado diretamente
if (typeof window !== 'undefined') {
  (window as any).testKeywordAnalysis = testKeywordAnalysis;
  console.log('🧪 Teste disponível: testKeywordAnalysis()');
}