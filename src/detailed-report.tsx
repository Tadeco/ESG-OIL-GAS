import React, { useState } from 'react';
import {
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  FileDown,
  Printer,
  Share2,
  Calendar,
  Building2,
  Award,
  AlertCircle
} from 'lucide-react';
import { ESGAnalysisResult } from './mock-api';

interface DetailedReportProps {
  result: ESGAnalysisResult;
  fileName: string;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

const DetailedReport: React.FC<DetailedReportProps> = ({
  result,
  fileName,
  onClose,
  theme = 'light'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'environmental' | 'social' | 'governance' | 'compliance'>('overview');

  // Função para gerar e baixar relatório PDF
  const downloadPDF = () => {
    console.log('📄 GERANDO RELATÓRIO PDF...');
    
    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relatorio_ESG_${fileName.replace('.pdf', '')}_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('✅ RELATÓRIO PDF GERADO E BAIXADO');
  };

  // Função para gerar e baixar relatório Excel
  const downloadExcel = () => {
    console.log('📊 GERANDO RELATÓRIO EXCEL...');
    
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dados_ESG_${fileName.replace('.pdf', '')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('✅ RELATÓRIO EXCEL GERADO E BAIXADO');
  };

  const generateReportContent = (): string => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Relatório ESG - ${fileName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
        .score-box { background: #f0fdf4; border: 2px solid #10b981; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .score-large { font-size: 48px; font-weight: bold; color: #059669; }
        .category { margin: 20px 0; padding: 15px; border-left: 4px solid #10b981; }
        .strengths { background: #f0fdf4; padding: 15px; border-radius: 8px; }
        .weaknesses { background: #fef2f2; padding: 15px; border-radius: 8px; }
        .recommendations { background: #fefbf0; padding: 15px; border-radius: 8px; }
        ul { margin: 10px 0; padding-left: 20px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏢 RELATÓRIO DE ANÁLISE ESG</h1>
        <h2>OIL & GAS ESG Contract Analyzer</h2>
        <p><strong>Arquivo:</strong> ${fileName}</p>
        <p><strong>Data da Análise:</strong> ${new Date(result.uploadDate).toLocaleString('pt-BR')}</p>
        <p><strong>ID do Contrato:</strong> ${result.contractId}</p>
    </div>

    <div class="score-box">
        <div class="score-large">${result.overallScore}/100</div>
        <h3>SCORE ESG GERAL</h3>
        <p><strong>${result.overallScore >= 80 ? '🟢 EXCELENTE' : result.overallScore >= 60 ? '🟡 BOM' : '🔴 CRÍTICO'}</strong></p>
        <p>Confiabilidade: ${(result.confidence * 100).toFixed(1)}%</p>
    </div>

    <h2>📊 SCORES DETALHADOS</h2>
    <div style="display: flex; justify-content: space-around; margin: 20px 0;">
        <div style="text-align: center;">
            <h3>🌱 AMBIENTAL</h3>
            <div style="font-size: 24px; font-weight: bold; color: ${result.categories.environmental.score >= 70 ? '#059669' : result.categories.environmental.score >= 50 ? '#d97706' : '#dc2626'};">
                ${result.categories.environmental.score}/100
            </div>
        </div>
        <div style="text-align: center;">
            <h3>👥 SOCIAL</h3>
            <div style="font-size: 24px; font-weight: bold; color: ${result.categories.social.score >= 70 ? '#059669' : result.categories.social.score >= 50 ? '#d97706' : '#dc2626'};">
                ${result.categories.social.score}/100
            </div>
        </div>
        <div style="text-align: center;">
            <h3>🏛️ GOVERNANÇA</h3>
            <div style="font-size: 24px; font-weight: bold; color: ${result.categories.governance.score >= 70 ? '#059669' : result.categories.governance.score >= 50 ? '#d97706' : '#dc2626'};">
                ${result.categories.governance.score}/100
            </div>
        </div>
    </div>

    ${Object.entries(result.categories).map(([categoryName, categoryData]) => `
    <div class="category">
        <h2>${categoryName.toUpperCase()}</h2>
        
        <div class="strengths">
            <h3>✅ PONTOS FORTES</h3>
            <ul>
                ${categoryData.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
        </div>

        <div class="weaknesses">
            <h3>⚠️ PONTOS FRACOS</h3>
            <ul>
                ${categoryData.weaknesses.map(weakness => `<li>${weakness}</li>`).join('')}
            </ul>
        </div>
    </div>
    `).join('')}

    <h2>🎯 RECOMENDAÇÕES</h2>
    <div class="recommendations">
        <ul>
            ${result.recommendations.map(rec => `
                <li><strong>${rec.title}</strong> (${rec.priority}): ${rec.description}</li>
            `).join('')}
        </ul>
    </div>

    <h2>📋 COMPLIANCE</h2>
    <p><strong>Status:</strong> ${result.compliance.status}</p>
    <ul>
        <li><strong>GRI:</strong> ${result.compliance.frameworks.gri.score}/100 (${result.compliance.frameworks.gri.compliant ? 'Compliant' : 'Não Compliant'})</li>
        <li><strong>SASB:</strong> ${result.compliance.frameworks.sasb.score}/100 (${result.compliance.frameworks.sasb.compliant ? 'Compliant' : 'Não Compliant'})</li>
        <li><strong>TCFD:</strong> ${result.compliance.frameworks.tcfd.score}/100 (${result.compliance.frameworks.tcfd.compliant ? 'Compliant' : 'Não Compliant'})</li>
        <li><strong>IPIECA:</strong> ${result.compliance.frameworks.ipieca.score}/100 (${result.compliance.frameworks.ipieca.compliant ? 'Compliant' : 'Não Compliant'})</li>
    </ul>

    <div class="footer">
        <p>🤖 Relatório gerado automaticamente pelo OIL & GAS ESG Contract Analyzer</p>
        <p>Desenvolvido por Eng. Tadeu Santana | Powered by IA Avançada</p>
        <p>Data de geração: ${new Date().toLocaleString('pt-BR')}</p>
    </div>
</body>
</html>
    `;
  };

  const generateCSVContent = (): string => {
    return `Relatório ESG - ${fileName}
Data,${new Date(result.uploadDate).toLocaleString('pt-BR')}
Arquivo,${fileName}
ID Contrato,${result.contractId}

SCORES ESG
Categoria,Score,Status
Overall,${result.overallScore},${result.overallScore >= 80 ? 'Excelente' : result.overallScore >= 60 ? 'Bom' : 'Crítico'}
Ambiental,${result.categories.environmental.score},${result.categories.environmental.score >= 70 ? 'Bom' : 'Atenção'}
Social,${result.categories.social.score},${result.categories.social.score >= 70 ? 'Bom' : 'Atenção'}
Governança,${result.categories.governance.score},${result.categories.governance.score >= 70 ? 'Bom' : 'Atenção'}

PONTOS FORTES
${result.categories.environmental.strengths.concat(result.categories.social.strengths, result.categories.governance.strengths).map(strength => `"${strength}"`).join('\n')}

PONTOS FRACOS
${result.categories.environmental.weaknesses.concat(result.categories.social.weaknesses, result.categories.governance.weaknesses).map(weakness => `"${weakness}"`).join('\n')}

RECOMENDAÇÕES
Título,Prioridade,Descrição,Ação,Prazo
${result.recommendations.map(rec => `"${rec.title}","${rec.priority}","${rec.description}","${rec.action}","${rec.timeline}"`).join('\n')}

COMPLIANCE
Framework,Score,Status
GRI,${result.compliance.frameworks.gri.score},${result.compliance.frameworks.gri.compliant ? 'Compliant' : 'Não Compliant'}
SASB,${result.compliance.frameworks.sasb.score},${result.compliance.frameworks.sasb.compliant ? 'Compliant' : 'Não Compliant'}
TCFD,${result.compliance.frameworks.tcfd.score},${result.compliance.frameworks.tcfd.compliant ? 'Compliant' : 'Não Compliant'}
IPIECA,${result.compliance.frameworks.ipieca.score},${result.compliance.frameworks.ipieca.compliant ? 'Compliant' : 'Não Compliant'}
`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return theme === 'dark' ? 'text-green-400' : 'text-green-600';
    if (score >= 60) return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
    return theme === 'dark' ? 'text-red-400' : 'text-red-600';
  };

  const getScoreBg = (score: number): string => {
    if (score >= 80) return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
    return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">📊 Relatório ESG Detalhado</h2>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {fileName} • {new Date(result.uploadDate).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <FileDown className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={downloadExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className={`w-64 border-r p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                { id: 'environmental', label: 'Ambiental', icon: TrendingUp },
                { id: 'social', label: 'Social', icon: Building2 },
                { id: 'governance', label: 'Governança', icon: Award },
                { id: 'compliance', label: 'Compliance', icon: CheckCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className={`p-6 rounded-lg border-2 ${getScoreBg(result.overallScore)}`}>
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}/100
                    </div>
                    <h3 className="text-lg font-semibold mb-1">SCORE ESG GERAL</h3>
                    <p className={`text-sm ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore >= 80 ? '🟢 EXCELENTE' :
                       result.overallScore >= 60 ? '🟡 BOM' : '🔴 CRÍTICO'}
                    </p>
                    <p className="text-sm mt-2 opacity-75">
                      Confiabilidade: {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Category Scores */}
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(result.categories).map(([name, data]) => (
                    <div key={name} className={`p-4 rounded-lg border ${getScoreBg(data.score)}`}>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                          {data.score}
                        </div>
                        <h4 className="text-sm font-semibold uppercase">
                          {name === 'environmental' ? '🌱 Ambiental' :
                           name === 'social' ? '👥 Social' : '🏛️ Governança'}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Summary */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h3 className="font-semibold mb-3">📋 Resumo Executivo</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">✅ Principais Forças</h4>
                      <ul className="space-y-1">
                        {result.categories.environmental.strengths.slice(0, 2).map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">⚠️ Áreas de Melhoria</h4>
                      <ul className="space-y-1">
                        {result.categories.environmental.weaknesses.slice(0, 2).map((weakness, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'environmental' || activeTab === 'social' || activeTab === 'governance') && (
              <div className="space-y-6">
                {(() => {
                  const categoryData = result.categories[activeTab as keyof typeof result.categories];
                  const categoryName = activeTab === 'environmental' ? 'Ambiental' :
                                     activeTab === 'social' ? 'Social' : 'Governança';
                  const categoryIcon = activeTab === 'environmental' ? '🌱' :
                                     activeTab === 'social' ? '👥' : '🏛️';

                  return (
                    <>
                      <div className={`p-6 rounded-lg border ${getScoreBg(categoryData.score)}`}>
                        <div className="text-center">
                          <div className={`text-4xl font-bold mb-2 ${getScoreColor(categoryData.score)}`}>
                            {categoryData.score}/100
                          </div>
                          <h3 className="text-lg font-semibold">{categoryIcon} {categoryName.toUpperCase()}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                          <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Pontos Fortes
                          </h3>
                          <ul className="space-y-2">
                            {categoryData.strengths.map((strength, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                          <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Pontos Fracos
                          </h3>
                          <ul className="space-y-2">
                            {categoryData.weaknesses.map((weakness, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {categoryData.findings.length > 0 && (
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <h3 className="font-semibold mb-3">🔍 Principais Achados</h3>
                          <div className="space-y-2">
                            {categoryData.findings.map((finding, idx) => (
                              <div key={idx} className={`p-3 rounded border-l-4 ${
                                finding.sentiment === 'POSITIVE' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                                finding.sentiment === 'NEGATIVE' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                                'border-gray-500 bg-gray-50 dark:bg-gray-800'
                              }`}>
                                <p className="text-sm">{finding.text}</p>
                                <p className="text-xs opacity-75 mt-1">
                                  Confiança: {(finding.confidence * 100).toFixed(0)}% • {finding.category}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-lg border ${
                  result.compliance.status === 'COMPLIANT' ? getScoreBg(80) :
                  result.compliance.status === 'PARTIALLY_COMPLIANT' ? getScoreBg(60) :
                  getScoreBg(30)
                }`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">
                      {result.compliance.status === 'COMPLIANT' ? '✅ COMPLIANT' :
                       result.compliance.status === 'PARTIALLY_COMPLIANT' ? '⚠️ PARCIALMENTE COMPLIANT' :
                       '❌ NÃO COMPLIANT'}
                    </div>
                    <h3 className="text-lg font-semibold">STATUS DE COMPLIANCE</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(result.compliance.frameworks).map(([name, framework]) => (
                    <div key={name} className={`p-4 rounded-lg border ${getScoreBg(framework.score)}`}>
                      <div className="text-center mb-3">
                        <div className={`text-xl font-bold ${getScoreColor(framework.score)}`}>
                          {framework.score}/100
                        </div>
                        <h4 className="font-semibold uppercase">{name}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          framework.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {framework.compliant ? 'Compliant' : 'Não Compliant'}
                        </span>
                      </div>
                      <ul className="text-xs space-y-1">
                        {framework.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="w-1 h-1 bg-current rounded-full mt-1.5 flex-shrink-0"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {result.compliance.issues.length > 0 && (
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                    <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Issues Identificadas
                    </h3>
                    <div className="space-y-2">
                      {result.compliance.issues.map((issue, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium">{issue.description}</p>
                          <p className="text-xs opacity-75 mt-1">
                            Severidade: {issue.severity} • {issue.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedReport;