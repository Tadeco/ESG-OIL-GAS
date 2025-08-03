# 📄 Contratos de Teste para Análise ESG

## 🎯 Objetivo
Estes 3 contratos simulados foram criados para testar a funcionalidade completa da aplicação **OIL & GAS ESG Contract Analyzer**, permitindo validar diferentes cenários de análise ESG.

## 📋 Contratos Disponíveis

### 1. **Contrato de Exploração Sustentável** (contrato-exploracao-sustentavel.html)
- **Setor:** Upstream (Exploração e Produção)
- **Características ESG:** 🟢 **EXCELENTE**
- **Cenário:** Empresa com práticas exemplares de sustentabilidade
- **Pontos fortes:**
  - Compromissos ambientais rigorosos (neutralidade de carbono, zero vazamentos)
  - Forte engajamento social (60% mão de obra local, programas comunitários)
  - Governança transparente (auditoria ESG trimestral, relatórios públicos)
  - Investimento de R$ 2,5 bilhões em sustentabilidade
- **Resultado esperado:** Score ESG alto (85-95 pontos)

### 2. **Contrato de Transporte de Petróleo** (contrato-transporte-petroleo.html)
- **Setor:** Midstream (Transporte)
- **Características ESG:** 🟡 **MÉDIO/ALTO RISCO**
- **Cenário:** Projeto com licenciamento incompleto e riscos ambientais
- **Problemas identificados:**
  - Licenciamento ambiental pendente
  - Atravessa unidades de conservação e terras indígenas
  - Consulta inadequada às comunidades
  - Sistema de governança deficiente
  - Medidas mitigadoras não implementadas
- **Resultado esperado:** Score ESG médio-baixo (45-65 pontos)

### 3. **Contrato de Refinaria e Distribuição** (contrato-refinaria-distribuicao.html)
- **Setor:** Downstream (Refino e Distribuição)
- **Características ESG:** 🔴 **CRÍTICO**
- **Cenário:** Empresa com histórico de acidentes e problemas sociais graves
- **Problemas críticos:**
  - Histórico de 15 acidentes em 5 anos (3 com mortes)
  - Localização em área vulnerável (500.000 habitantes afetados)
  - Problemas trabalhistas e de saúde ocupacional
  - Governança corporativa deficiente
  - Múltiplas autuações de órgãos reguladores
- **Resultado esperado:** Score ESG baixo (20-40 pontos)

## 🔄 Como Converter para PDF

### Opção 1: Conversão Manual (Recomendado)
1. **Abra cada arquivo .html no seu navegador** (Chrome, Edge, Firefox)
2. **Use Ctrl+P** para abrir o diálogo de impressão
3. **Selecione "Salvar como PDF"** como destino
4. **Configure as opções:**
   - Orientação: Retrato
   - Páginas: Todas
   - Margem: Padrão
5. **Salve com o nome:**
   - `contrato-exploracao-sustentavel.pdf`
   - `contrato-transporte-petroleo.pdf`
   - `contrato-refinaria-distribuicao.pdf`

### Opção 2: Usando Chrome via Linha de Comando
```bash
# Navegue até a pasta dos contratos
cd "C:\Users\tadec\OneDrive\Área de Trabalho\SHELL AI\contratos-teste"

# Execute para cada arquivo (substitua o caminho do Chrome se necessário)
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless --disable-gpu --print-to-pdf="contrato-exploracao-sustentavel.pdf" "contrato-exploracao-sustentavel.html"

"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless --disable-gpu --print-to-pdf="contrato-transporte-petroleo.pdf" "contrato-transporte-petroleo.html"

"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless --disable-gpu --print-to-pdf="contrato-refinaria-distribuicao.pdf" "contrato-refinaria-distribuicao.html"
```

## 🧪 Como Usar para Teste

### 1. **Preparação**
- Converta os 3 arquivos HTML para PDF
- Acesse sua aplicação em: http://localhost:5173 (desenvolvimento) ou URL do Vercel

### 2. **Fluxo de Teste Completo**

#### **Teste 1: Contrato Sustentável** 🟢
1. Faça upload do `contrato-exploracao-sustentavel.pdf`
2. **Resultado esperado:**
   - Score Ambiental: 90-95 pontos
   - Score Social: 85-90 pontos  
   - Score Governança: 88-93 pontos
   - Riscos: Majoritariamente LOW/MEDIUM
   - Recomendações: Focadas em melhorias incrementais

#### **Teste 2: Contrato Transporte** 🟡
1. Faça upload do `contrato-transporte-petroleo.pdf`
2. **Resultado esperado:**
   - Score Ambiental: 45-55 pontos
   - Score Social: 50-60 pontos
   - Score Governança: 40-50 pontos
   - Riscos: Mix de MEDIUM/HIGH
   - Recomendações: Focadas em licenciamento e consulta

#### **Teste 3: Contrato Refinaria** 🔴
1. Faça upload do `contrato-refinaria-distribuicao.pdf`
2. **Resultado esperado:**
   - Score Ambiental: 25-35 pontos
   - Score Social: 20-30 pontos
   - Score Governança: 30-40 pontos
   - Riscos: Principalmente HIGH/CRITICAL
   - Recomendações: Ações corretivas urgentes

### 3. **Pontos de Validação**

#### **Funcionalidades a Testar:**
- ✅ Upload de arquivos funciona
- ✅ Análise IA processa corretamente
- ✅ Scores ESG são calculados
- ✅ Riscos são identificados e categorizados
- ✅ Recomendações são geradas adequadamente
- ✅ Interface responde bem a diferentes cenários
- ✅ Navegação entre páginas funciona
- ✅ Tema dark/light funciona
- ✅ Responsividade em mobile

#### **Cenários de Teste:**
1. **Upload múltiplo:** Teste com os 3 contratos em sequência
2. **Navegação:** Alterne entre Dashboard, Upload, Análise e Relatórios
3. **Filtros:** Use filtros de risco e categoria nas análises
4. **Responsividade:** Teste em diferentes tamanhos de tela
5. **Tema:** Alterne entre modo claro e escuro

## 📊 Resultados Esperados por Framework

### **GRI (Global Reporting Initiative)**
- Sustentável: 95% compliance
- Transporte: 60% compliance  
- Refinaria: 35% compliance

### **SASB (Sustainability Accounting Standards Board)**
- Sustentável: 90% compliance
- Transporte: 55% compliance
- Refinaria: 30% compliance

### **TCFD (Task Force on Climate-related Financial Disclosures)**
- Sustentável: 92% compliance
- Transporte: 45% compliance
- Refinaria: 25% compliance

### **IPIECA (International Petroleum Industry Environmental Conservation Association)**
- Sustentável: 88% compliance
- Transporte: 50% compliance
- Refinaria: 28% compliance

## 🎬 Para o Vídeo de Demonstração

Use esta sequência para criar o vídeo:

1. **Introdução** (30s)
   - Tela inicial da aplicação
   - Explicação do propósito

2. **Contrato Sustentável** (60s)
   - Upload do PDF
   - Mostrar análise em progresso
   - Destacar scores altos
   - Navegar pelas abas

3. **Contrato Problemático** (60s)
   - Upload do contrato da refinaria  
   - Mostrar scores baixos
   - Destacar riscos críticos
   - Mostrar recomendações

4. **Dashboard e Relatórios** (30s)
   - Visão geral das análises
   - Relatórios de compliance
   - Funcionalidades adicionais

**Total:** 3 minutos de demonstração prática

## 🚀 Próximos Passos

Após testar com estes contratos:

1. **Valide todas as funcionalidades**
2. **Documente qualquer bug encontrado**  
3. **Ajuste a interface conforme necessário**
4. **Prepare o vídeo de demonstração**
5. **Publique no LinkedIn para recrutadores**

---

**📝 Desenvolvido por Eng. Tadeu Santana**  
*Contratos simulados para fins de teste e demonstração técnica*