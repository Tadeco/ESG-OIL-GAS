import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  FileText,
  Shield,
  Leaf,
  Users,
  Scale,
  Award,
  Target,
  Calendar,
  Building2,
  Globe,
  Info,
  ExternalLink,
  Filter,
  Search,
  Eye,
  Clock
} from 'lucide-react';
import { mockApi, ESGAnalysisResult } from './mock-api';

interface AnalysisResultsProps {
  contractId?: string;
  theme?: 'light' | 'dark';
  onNavigate?: (path: string) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  contractId = 'contract-001',
  theme = 'light',
  onNavigate = () => {}
}) => {
  const [analysis, setAnalysis] = useState<ESGAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'environmental' | 'social' | 'governance' | 'compliance'>('overview');
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const result = await mockApi.analyzeContract(contractId);
        setAnalysis(result);
      } catch (error) {
        console.error('Error loading analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [contractId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Carregando análise ESG...
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Análise não encontrada</h3>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Contrato não foi encontrado ou ainda não foi analisado.
        </p>
        <button
          onClick={() => onNavigate('/contracts')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Voltar aos Contratos
        </button>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'MEDIUM':
        return <Minus className="w-5 h-5 text-yellow-500" />;
      case 'LOW':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'HIGH':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'MEDIUM':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'LOW':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
    }
  };

  const tabConfig = [
    { id: 'overview', label: 'Visão Geral', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'environmental', label: 'Ambiental', icon: <Leaf className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
    { id: 'governance', label: 'Governança', icon: <Scale className="w-4 h-4" /> },
    { id: 'compliance', label: 'Compliance', icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/contracts')}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Análise ESG - {analysis.fileName}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(analysis.uploadDate).toLocaleDateString('pt-BR')}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Confiança: {(analysis.confidence * 100).toFixed(0)}%
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Análise concluída
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Target className="w-4 h-4" />
            Recomendações
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Relatório PDF
          </button>
          <button className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}>
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className={`rounded-lg p-6 ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Score ESG Geral</h2>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-500">Baseado em GRI, SASB, TCFD</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Overall Score */}
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold ${
              getScoreBgColor(analysis.overallScore)
            }`}>
              <span className={getScoreColor(analysis.overallScore)}>
                {analysis.overallScore}
              </span>
            </div>
            <p className="mt-2 font-semibold">Score Geral</p>
            <p className="text-xs text-gray-500">de 100 pontos</p>
          </div>

          {/* Environmental */}
          <div className="text-center">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${
              getScoreBgColor(analysis.categories.environmental.score)
            }`}>
              <span className={getScoreColor(analysis.categories.environmental.score)}>
                {analysis.categories.environmental.score}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Leaf className="w-4 h-4 text-green-500" />
              <p className="font-medium">Ambiental</p>
            </div>
            <p className="text-xs text-gray-500">
              {analysis.categories.environmental.risks.length} riscos
            </p>
          </div>

          {/* Social */}
          <div className="text-center">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${
              getScoreBgColor(analysis.categories.social.score)
            }`}>
              <span className={getScoreColor(analysis.categories.social.score)}>
                {analysis.categories.social.score}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Users className="w-4 h-4 text-blue-500" />
              <p className="font-medium">Social</p>
            </div>
            <p className="text-xs text-gray-500">
              {analysis.categories.social.risks.length} riscos
            </p>
          </div>

          {/* Governance */}
          <div className="text-center">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${
              getScoreBgColor(analysis.categories.governance.score)
            }`}>
              <span className={getScoreColor(analysis.categories.governance.score)}>
                {analysis.categories.governance.score}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Scale className="w-4 h-4 text-purple-500" />
              <p className="font-medium">Governança</p>
            </div>
            <p className="text-xs text-gray-500">
              {analysis.categories.governance.risks.length} riscos
            </p>
          </div>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { level: 'CRITICAL', count: analysis.risks.filter(r => r.level === 'CRITICAL').length, color: 'red' },
          { level: 'HIGH', count: analysis.risks.filter(r => r.level === 'HIGH').length, color: 'orange' },
          { level: 'MEDIUM', count: analysis.risks.filter(r => r.level === 'MEDIUM').length, color: 'yellow' },
          { level: 'LOW', count: analysis.risks.filter(r => r.level === 'LOW').length, color: 'green' }
        ].map(({ level, count, color }) => (
          <div key={level} className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getRiskIcon(level)}
                <span className="text-sm font-medium">{level}</span>
              </div>
              <span className="text-2xl font-bold">{count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <nav className="flex space-x-8">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Findings */}
            <div className={`rounded-lg p-6 ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Principais Descobertas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(analysis.categories).map(([category, data]) => (
                  <div key={category}>
                    <h4 className="font-medium mb-3 capitalize flex items-center gap-2">
                      {category === 'environmental' && <Leaf className="w-4 h-4 text-green-500" />}
                      {category === 'social' && <Users className="w-4 h-4 text-blue-500" />}
                      {category === 'governance' && <Scale className="w-4 h-4 text-purple-500" />}
                      {category === 'environmental' ? 'Ambiental' : 
                       category === 'social' ? 'Social' : 'Governança'}
                    </h4>
                    <div className="space-y-2">
                      {data.findings.slice(0, 3).map((finding, idx) => (
                        <div key={idx} className={`text-sm p-2 rounded ${
                          finding.sentiment === 'POSITIVE' 
                            ? theme === 'dark' ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700'
                            : finding.sentiment === 'NEGATIVE'
                            ? theme === 'dark' ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                            : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
                        }`}>
                          {finding.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Risks */}
            {analysis.risks.filter(r => r.level === 'CRITICAL' || r.level === 'HIGH').length > 0 && (
              <div className={`rounded-lg p-6 ${
                theme === 'dark' ? 'bg-red-900/20 border border-red-800/30' : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                  Riscos Críticos e Altos
                </h3>
                <div className="space-y-4">
                  {analysis.risks
                    .filter(r => r.level === 'CRITICAL' || r.level === 'HIGH')
                    .map((risk) => (
                    <div key={risk.id} className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        {getRiskIcon(risk.level)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{risk.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.level)}`}>
                              {risk.level}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {risk.description}
                          </p>
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            💡 {risk.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category-specific tabs */}
        {['environmental', 'social', 'governance'].includes(activeTab) && (
          <div className="space-y-6">
            {(() => {
              const categoryData = analysis.categories[activeTab as keyof typeof analysis.categories];
              return (
                <>
                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`rounded-lg p-6 ${
                      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
                        ✅ Pontos Fortes
                      </h3>
                      <ul className="space-y-2">
                        {categoryData.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`rounded-lg p-6 ${
                      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                        ⚠️ Pontos de Melhoria
                      </h3>
                      <ul className="space-y-2">
                        {categoryData.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Detailed Findings */}
                  <div className={`rounded-lg p-6 ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <h3 className="text-lg font-semibold mb-4">Descobertas Detalhadas</h3>
                    <div className="space-y-3">
                      {categoryData.findings.map((finding, idx) => (
                        <div key={idx} className={`p-3 rounded-lg ${
                          finding.sentiment === 'POSITIVE' 
                            ? theme === 'dark' ? 'bg-green-900/20 border border-green-800/30' : 'bg-green-50 border border-green-200'
                            : finding.sentiment === 'NEGATIVE'
                            ? theme === 'dark' ? 'bg-red-900/20 border border-red-800/30' : 'bg-red-50 border border-red-200'
                            : theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="flex items-start justify-between">
                            <p className="text-sm flex-1">{finding.text}</p>
                            <div className="flex items-center gap-2 ml-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                              }`}>
                                {finding.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(finding.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Compliance Status */}
            <div className={`rounded-lg p-6 ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Status de Compliance</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  analysis.compliance.status === 'COMPLIANT'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : analysis.compliance.status === 'PARTIALLY_COMPLIANT'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {analysis.compliance.status === 'COMPLIANT' ? 'Conforme' :
                   analysis.compliance.status === 'PARTIALLY_COMPLIANT' ? 'Parcialmente Conforme' :
                   'Não Conforme'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(analysis.compliance.frameworks).map(([framework, data]) => (
                  <div key={framework} className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm uppercase">{framework}</h4>
                      <span className={`w-3 h-3 rounded-full ${
                        data.compliant ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <p className={`text-2xl font-bold mb-2 ${getScoreColor(data.score)}`}>
                      {data.score}%
                    </p>
                    <div className="space-y-1">
                      {data.details.slice(0, 2).map((detail, idx) => (
                        <p key={idx} className="text-xs text-gray-500">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Issues */}
            {analysis.compliance.issues.length > 0 && (
              <div className={`rounded-lg p-6 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h3 className="text-lg font-semibold mb-4">Questões de Compliance</h3>
                <div className="space-y-4">
                  {analysis.compliance.issues.map((issue, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                      issue.severity === 'HIGH'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : issue.severity === 'MEDIUM'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{issue.framework}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(issue.severity)}`}>
                              {issue.severity}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {issue.description}
                          </p>
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            💡 {issue.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recommendations Sidebar */}
      {showRecommendations && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recomendações</h3>
              <button
                onClick={() => setShowRecommendations(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {analysis.recommendations.map((rec) => (
                <div key={rec.id} className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      rec.priority === 'CRITICAL' ? 'bg-red-500' :
                      rec.priority === 'HIGH' ? 'bg-orange-500' :
                      rec.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {rec.description}
                      </p>
                      <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        🎯 {rec.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        ⏱️ Prazo: {rec.timeline}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overlay for recommendations */}
      {showRecommendations && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowRecommendations(false)}
        />
      )}
    </div>
  );
};

export default AnalysisResults;