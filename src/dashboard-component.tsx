import React from 'react';
import {
  TrendingUp,
  FileText,
  Shield,
  BarChart3,
  Users,
  Leaf,
  Scale,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Globe,
  Info,
  ExternalLink,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface DashboardProps {
  user?: {
    name: string;
    role: string;
  };
  theme?: 'light' | 'dark';
}

const Dashboard: React.FC<DashboardProps> = ({
  user = { name: 'Usuário', role: 'Analista ESG' },
  theme = 'light'
}) => {
  // Mock data for dashboard metrics
  const metrics = [
    {
      title: 'Contratos Analisados',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: <FileText className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Score ESG Médio',
      value: '78.5',
      change: '+5.2',
      trend: 'up',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Riscos Identificados',
      value: '34',
      change: '-8%',
      trend: 'down',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'red'
    },
    {
      title: 'Compliance Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: <Shield className="w-6 h-6" />,
      color: 'purple'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'analysis',
      title: 'Contrato Petrobras - Análise Concluída',
      time: '2 horas atrás',
      status: 'completed',
      score: 85
    },
    {
      id: 2,
      type: 'risk',
      title: 'Alto risco identificado - Shell Upstream',
      time: '4 horas atrás',
      status: 'warning',
      score: 45
    },
    {
      id: 3,
      type: 'compliance',
      title: 'Revisão de compliance - Equinor',
      time: '1 dia atrás',
      status: 'completed',
      score: 92
    }
  ];

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Header com Introdução */}
      <div className={`rounded-lg p-6 ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Bem-vindo ao OIL & GAS ESG Contract Analyzer
            </h1>
            <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Olá, {user.name}! Pronto para analisar contratos ESG hoje?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-green-500" />
            <Leaf className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* Explicação Completa do Sistema */}
        <div className={`mt-6 p-6 rounded-lg ${
          theme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-blue-800/30' : 'bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200'
        }`}>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg mb-3 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-800'
              }`}>
                🏢 Sistema de Análise ESG para Petróleo & Gás
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className={`text-sm leading-relaxed mb-3 ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    <strong>Desenvolvido por:</strong> Eng. Tadeu Santana<br/>
                    <strong>Finalidade:</strong> Demonstração de expertise em ESG para recrutadores do setor O&G
                  </p>
                  
                  <h4 className={`font-semibold text-sm mb-2 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-700'
                  }`}>
                    🎯 Funcionalidades Principais:
                  </h4>
                  <ul className={`text-sm space-y-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <li>• Upload e análise de contratos em PDF</li>
                    <li>• Análise ESG com IA (simulação GPT-4)</li>
                    <li>• Scores automáticos para Environmental, Social, Governance</li>
                    <li>• Relatórios detalhados com download</li>
                    <li>• Compliance com GRI, SASB, TCFD, IPIECA</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className={`font-semibold text-sm mb-2 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
                  }`}>
                    🔧 Tecnologias Utilizadas:
                  </h4>
                  <ul className={`text-sm space-y-1 mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <li>• React 18 + TypeScript</li>
                    <li>• Vite + Tailwind CSS</li>
                    <li>• PDF.js para leitura real de PDFs</li>
                    <li>• Análise baseada em keywords ESG</li>
                    <li>• Deploy no Vercel via GitHub</li>
                  </ul>
                  
                  <h4 className={`font-semibold text-sm mb-2 ${
                    theme === 'dark' ? 'text-orange-400' : 'text-orange-700'
                  }`}>
                    🛢️ Aplicação Setorial:
                  </h4>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Adaptável para <strong>qualquer empresa</strong> de petróleo e gás: Shell, Petrobras, BP, Total, Equinor, etc.
                  </p>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-l-4 ${
                theme === 'dark' 
                  ? 'border-yellow-500 bg-yellow-900/20' 
                  : 'border-yellow-500 bg-yellow-50'
              }`}>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
                }`}>
                  📋 <strong>Dados de Demonstração:</strong> Este sistema utiliza diretrizes e exemplos reais da Shell, mas pode ser configurado para qualquer operadora. Os contratos simulados incluem cenários realistas de upstream, downstream e questões ESG típicas do setor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className={`rounded-lg p-6 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${
                metric.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                metric.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                metric.color === 'red' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
              }`}>
                {metric.icon}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                metric.trend === 'up' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.title}
              </h3>
              <p className="text-2xl font-bold mt-1">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold mb-4">Atividade Recente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'completed' 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {activity.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.time}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activity.score >= 80 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : activity.score >= 60
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      Score: {activity.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funcionalidades do Sistema */}
        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold mb-4">Capacidades do Sistema</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Análise AI com GPT-4 para contratos ESG</span>
            </div>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-sm">Identificação automática de riscos</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Scoring ESG baseado em frameworks internacionais</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-indigo-500" />
              <span className="text-sm">Suporte a múltiplas linguagens</span>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-cyan-500" />
              <span className="text-sm">Especializado em petróleo e gás</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Desenvolvido com tecnologias modernas: NestJS, React, PostgreSQL, Redis, Docker, Kubernetes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;