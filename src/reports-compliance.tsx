import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  Building2,
  Award,
  Shield,
  FileText,
  PieChart,
  LineChart,
  Globe,
  Target,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Users,
  Leaf,
  Scale,
  ExternalLink,
  Search,
  Eye,
  Share2
} from 'lucide-react';
import { mockApi } from './mock-api';

interface ReportsComplianceProps {
  theme?: 'light' | 'dark';
  onNavigate?: (path: string) => void;
}

const ReportsCompliance: React.FC<ReportsComplianceProps> = ({
  theme = 'light',
  onNavigate = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'frameworks' | 'reports' | 'trends'>('dashboard');
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [selectedFramework, setSelectedFramework] = useState('all');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await mockApi.getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Carregando relatórios...
          </p>
        </div>
      </div>
    );
  }

  const tabConfig = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'frameworks', label: 'Frameworks ESG', icon: <Award className="w-4 h-4" /> },
    { id: 'reports', label: 'Relatórios', icon: <FileText className="w-4 h-4" /> },
    { id: 'trends', label: 'Tendências', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const frameworks = [
    {
      id: 'gri',
      name: 'GRI Standards',
      description: 'Global Reporting Initiative - Padrão mundial para relatórios de sustentabilidade',
      compliance: 87,
      status: 'compliant',
      lastUpdate: '2024-01-15',
      coverage: ['Environmental', 'Social', 'Economic'],
      icon: <Globe className="w-6 h-6 text-blue-500" />
    },
    {
      id: 'sasb',
      name: 'SASB Oil & Gas',
      description: 'Sustainability Accounting Standards Board - Específico para setor de petróleo e gás',
      compliance: 92,
      status: 'compliant',
      lastUpdate: '2024-01-12',
      coverage: ['GHG Emissions', 'Water Management', 'Community Relations'],
      icon: <Building2 className="w-6 h-6 text-green-500" />
    },
    {
      id: 'tcfd',
      name: 'TCFD',
      description: 'Task Force on Climate-related Financial Disclosures',
      compliance: 78,
      status: 'partial',
      lastUpdate: '2024-01-10',
      coverage: ['Governance', 'Strategy', 'Risk Management', 'Metrics & Targets'],
      icon: <Target className="w-6 h-6 text-purple-500" />
    },
    {
      id: 'ipieca',
      name: 'IPIECA',
      description: 'International Petroleum Industry Environmental Conservation Association',
      compliance: 85,
      status: 'compliant',
      lastUpdate: '2024-01-08',
      coverage: ['Environment', 'Health & Safety', 'Social Responsibility'],
      icon: <Leaf className="w-6 h-6 text-emerald-500" />
    }
  ];

  const reports = [
    {
      id: 'sustainability-2024',
      title: 'Relatório de Sustentabilidade 2024',
      type: 'Annual Report',
      format: 'PDF',
      size: '2.4 MB',
      generated: '2024-01-15',
      downloads: 156,
      status: 'published'
    },
    {
      id: 'esg-quarterly-q4',
      title: 'Análise ESG Trimestral - Q4 2023',
      type: 'Quarterly',
      format: 'PDF',
      size: '1.8 MB',
      generated: '2024-01-02',
      downloads: 89,
      status: 'published'
    },
    {
      id: 'compliance-dashboard',
      title: 'Dashboard de Compliance Executivo',
      type: 'Executive Summary',
      format: 'Interactive',
      size: '-',
      generated: '2024-01-20',
      downloads: 234,
      status: 'live'
    },
    {
      id: 'risk-assessment-2024',
      title: 'Avaliação de Riscos ESG 2024',
      type: 'Risk Report',
      format: 'Excel',
      size: '3.2 MB',
      generated: '2024-01-18',
      downloads: 67,
      status: 'draft'
    }
  ];

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600 dark:text-green-400';
    if (compliance >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getComplianceBg = (compliance: number) => {
    if (compliance >= 90) return 'bg-green-100 dark:bg-green-900/30';
    if (compliance >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Relatórios e Compliance ESG</h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Análises detalhadas e conformidade com frameworks internacionais
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="1m">Último mês</option>
            <option value="3m">Últimos 3 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último ano</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Exportar Tudo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">+5.2%</span>
          </div>
          <p className="text-2xl font-bold mt-4">87.5%</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Compliance Médio
          </p>
        </div>

        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">+12</span>
          </div>
          <p className="text-2xl font-bold mt-4">47</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Relatórios Gerados
          </p>
        </div>

        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">4/4</span>
          </div>
          <p className="text-2xl font-bold mt-4">100%</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Frameworks Ativos
          </p>
        </div>

        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">-2</span>
          </div>
          <p className="text-2xl font-bold mt-4">8</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Não Conformidades
          </p>
        </div>
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
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className={`rounded-lg p-6 ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-6">Visão Geral de Performance ESG</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ESG Scores */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Scores por Categoria
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Environmental</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                        </div>
                        <span className="text-sm font-medium w-8">85</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Social</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }} />
                        </div>
                        <span className="text-sm font-medium w-8">72</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Governance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }} />
                        </div>
                        <span className="text-sm font-medium w-8">91</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Distribution */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Distribuição de Riscos
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      { level: 'Crítico', count: 2, color: 'bg-red-500' },
                      { level: 'Alto', count: 5, color: 'bg-orange-500' },
                      { level: 'Médio', count: 12, color: 'bg-yellow-500' },
                      { level: 'Baixo', count: 23, color: 'bg-green-500' }
                    ].map((risk) => (
                      <div key={risk.level} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${risk.color}`} />
                          <span className="text-sm">{risk.level}</span>
                        </div>
                        <span className="text-sm font-medium">{risk.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Trend */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Tendência Mensal
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +3.2%
                    </div>
                    <p className="text-sm text-gray-500">
                      Melhoria no score geral vs. mês anterior
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>Tendência positiva nos últimos 6 meses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-lg p-6 ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
              
              <div className="space-y-4">
                {[
                  {
                    action: 'Relatório GRI Standards gerado',
                    time: '2 horas atrás',
                    icon: <FileText className="w-4 h-4 text-blue-500" />,
                    status: 'completed'
                  },
                  {
                    action: 'Análise SASB Oil & Gas atualizada',
                    time: '4 horas atrás',
                    icon: <Award className="w-4 h-4 text-green-500" />,
                    status: 'completed'
                  },
                  {
                    action: 'Não conformidade TCFD identificada',
                    time: '1 dia atrás',
                    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
                    status: 'attention'
                  },
                  {
                    action: 'Dashboard executivo compartilhado',
                    time: '2 dias atrás',
                    icon: <Share2 className="w-4 h-4 text-purple-500" />,
                    status: 'completed'
                  }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-500' :
                      activity.status === 'attention' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'frameworks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {frameworks.map((framework) => (
                <div key={framework.id} className={`rounded-lg p-6 ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {framework.icon}
                      <div>
                        <h3 className="font-semibold">{framework.name}</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Atualizado em {new Date(framework.lastUpdate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getComplianceColor(framework.compliance)}`}>
                        {framework.compliance}%
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        framework.status === 'compliant'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {framework.status === 'compliant' ? 'Conforme' : 'Parcial'}
                      </span>
                    </div>
                  </div>

                  <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {framework.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Áreas Cobertas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {framework.coverage.map((area) => (
                        <span key={area} className={`px-2 py-1 rounded text-xs ${
                          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </button>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Baixar Relatório
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Buscar relatórios..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <select className={`px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}>
                <option value="all">Todos os tipos</option>
                <option value="annual">Anuais</option>
                <option value="quarterly">Trimestrais</option>
                <option value="executive">Executivos</option>
              </select>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports.map((report) => (
                <div key={report.id} className={`rounded-lg p-6 ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {report.type}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : report.status === 'live'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {report.status === 'published' ? 'Publicado' :
                       report.status === 'live' ? 'Ao Vivo' : 'Rascunho'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Formato:
                      </span>
                      <span>{report.format}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Tamanho:
                      </span>
                      <span>{report.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Gerado em:
                      </span>
                      <span>{new Date(report.generated).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Downloads:
                      </span>
                      <span>{report.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Baixar
                    </button>
                    <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}>
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                    <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}>
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* Trends Chart Placeholder */}
            <div className={`rounded-lg p-6 ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-6">Tendências de Performance ESG</h3>
              
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="text-center">
                  <LineChart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Gráfico de tendências interativo</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Mostra evolução dos scores ESG ao longo do tempo
                  </p>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`rounded-lg p-6 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Principais Melhorias
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Score Governança</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">+8.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance SASB</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">+12.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gestão de Riscos</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">+6.7%</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-6 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Áreas de Atenção
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Diversidade & Inclusão</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">-2.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Engajamento Comunitário</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">-1.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Transparência</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">-0.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsCompliance;