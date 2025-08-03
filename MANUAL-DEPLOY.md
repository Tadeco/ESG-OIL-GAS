# 🚀 Deploy Manual - OIL & GAS ESG Analyzer

## 📋 Passo a Passo para Deploy Manual no Vercel

### 1. **Preparar Repositório GitHub**

```bash
# Navegar para a pasta do projeto
cd "C:\Users\tadec\OneDrive\Área de Trabalho\SHELL AI"

# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "🚀 Initial commit - OIL & GAS ESG Contract Analyzer

✨ Features:
- Sistema completo de análise ESG com IA
- Upload e análise de contratos
- Dashboard executivo com métricas
- Compliance com GRI, SASB, TCFD, IPIECA
- Interface moderna e responsiva
- Desenvolvido por Eng. Tadeu Santana

🛠️ Tech Stack:
- React 18 + TypeScript
- Vite + Tailwind CSS
- Mock API com dados realistas
- Lucide React Icons
- Responsive Design

🎯 Especializado para setor de Petróleo & Gás"

# Conectar ao repositório remoto
git branch -M main
git remote add origin https://github.com/Tadeco/ESG-OIL-GAS.git

# Push para GitHub
git push -u origin main
```

### 2. **Deploy no Vercel (Manual)**

#### Opção A: Via Dashboard Web
1. Acesse: https://vercel.com/
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione o repositório: `Tadeco/ESG-OIL-GAS`
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Clique em **"Deploy"**

#### Opção B: Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. **Configurações Importantes**

#### **Environment Variables** (se necessário)
```
VITE_APP_TITLE=OIL & GAS ESG Contract Analyzer
VITE_APP_VERSION=1.0.0
VITE_DEVELOPER=Tadeu Santana
```

#### **Custom Domain** (opcional)
- Vá em Project Settings > Domains
- Adicione: `esg-oil-gas.vercel.app` ou domínio próprio

### 4. **Verificações Pós-Deploy**

#### ✅ **Checklist de Testes:**
- [ ] Página de login carrega corretamente
- [ ] Login com Google funciona (simulado)
- [ ] Dashboard mostra métricas
- [ ] Upload de arquivos funciona
- [ ] Análise ESG é exibida
- [ ] Relatórios carregam
- [ ] Tema dark/light funciona
- [ ] Responsivo em mobile
- [ ] Créditos do desenvolvedor aparecem

#### 📊 **Performance Check:**
```bash
# Lighthouse audit
npx lighthouse https://seu-deploy.vercel.app --view

# Esperado:
# Performance: 95+
# Accessibility: 98+
# Best Practices: 100
# SEO: 100
```

### 5. **URLs do Projeto**

Após o deploy, você terá:

- **Production**: `https://esg-oil-gas.vercel.app`
- **GitHub**: `https://github.com/Tadeco/ESG-OIL-GAS`
- **Preview**: URLs automáticas para cada commit

### 6. **Para o LinkedIn/Portfólio**

#### **Post Sugerido:**
```
🛢️ Acabei de lançar meu novo projeto: OIL & GAS ESG Contract Analyzer!

🚀 Sistema completo de análise ESG com IA especificamente para o setor de petróleo e gás

✨ Principais funcionalidades:
• Análise automática de contratos usando IA
• Dashboard executivo com métricas ESG em tempo real
• Compliance com GRI, SASB, TCFD e IPIECA
• Interface moderna e intuitiva
• Especializado para upstream, midstream e downstream

🛠️ Stack técnico:
React 18, TypeScript, Vite, Tailwind CSS

🔗 Demo ao vivo: [URL do Vercel]
📂 Código: https://github.com/Tadeco/ESG-OIL-GAS

Desenvolvido como showcase das minhas competências em sistemas para o setor energético.

#PetróleoGás #ESG #InteligênciaArtificial #Sustentabilidade #React #TypeScript #OpenToWork
```

### 7. **Troubleshooting**

#### **Problemas Comuns:**

1. **Build falha no Vercel**
   - Verificar se `package.json` está correto
   - Node version: 18.x especificado

2. **404 em rotas**
   - `vercel.json` já configurado para SPA routing
   - Todas as rotas redirecionam para `index.html`

3. **Assets não carregam**
   - Verificar paths relativos
   - Build local: `npm run build && npm run preview`

#### **Logs de Debug:**
```bash
# Ver logs do deploy
vercel logs [deployment-url]

# Build local para debug
npm run build
npm run preview
```

### 8. **Próximos Passos**

1. ✅ **Teste completo** da aplicação em produção
2. 🎬 **Grave o vídeo** seguindo `VIDEO-ROTEIRO.md`
3. 📱 **Poste no LinkedIn** com demo
4. 📧 **Adicione ao CV** e portfólio
5. 🎯 **Candidate-se** a vagas no setor

---

## 🎉 **Pronto para Impressionar!**

Seu **OIL & GAS ESG Contract Analyzer** está agora online e pronto para chamar atenção de recrutadores da Shell, Petrobras, Equinor e outras empresas do setor!

**🚀 Boa sorte com as oportunidades!** 💼✨