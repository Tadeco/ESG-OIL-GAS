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
      {/* Header Simplificado */}
      <div className={`rounded-lg p-6 ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Olá, {user.name}! 👋
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Pronto para analisar contratos ESG hoje?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-green-500" />
            <Leaf className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* Atalhos Rápidos */}
        <div className={`mt-6 grid grid-cols-1 md:grid-cols-3 gap-4`}>
          <button className={`p-4 rounded-lg text-left transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-700/50 hover:border-green-600' : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:border-green-300'
          }`}>
            <FileText className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold mb-1">Upload de Contrato</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Envie um PDF para análise ESG</p>
          </button>
          
          <button className={`p-4 rounded-lg text-left transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-700/50 hover:border-blue-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:border-blue-300'
          }`}>
            <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold mb-1">Ver Relatórios</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Acesse análises anteriores</p>
          </button>
          
          <button className={`p-4 rounded-lg text-left transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-700/50 hover:border-purple-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:border-purple-300'
          }`}>
            <Shield className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold mb-1">Compliance</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Verificar conformidade ESG</p>
          </button>
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

        {/* Resumo Simples */}
        <div className={`rounded-lg p-6 text-center ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold mb-3">🚀 Sistema de Análise ESG</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Analise contratos de petróleo e gás com inteligência artificial.<br/>
            Receba relatórios detalhados por email automaticamente.
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Desenvolvido por <strong>Eng. Tadeu Santana</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;