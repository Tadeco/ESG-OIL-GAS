import React, { useState, useEffect } from 'react';
import Layout from './layout-component';
import Login from './login-component';
import Dashboard from './dashboard-component';
import UploadContracts from './upload-contracts';
import AnalysisResults from './analysis-results';
import ReportsCompliance from './reports-compliance';
import { mockApi } from './mock-api';

// Simulação de router básico
type Route = 'login' | 'dashboard' | 'contracts' | 'upload' | 'analysis' | 'reports' | 'compliance';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
  loginProvider?: 'google' | 'microsoft' | 'email';
}

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('login');
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(false);
  const [contractId, setContractId] = useState<string>('');

  // Verificar se há usuário logado no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('oilgas-user');
    const savedTheme = localStorage.getItem('oilgas-theme') as 'light' | 'dark' | null;
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentRoute('dashboard');
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Aplicar tema ao body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50';
  }, [theme]);

  const handleLogin = async (email: string, password: string, mfaToken?: string): Promise<void> => {
    setLoading(true);
    try {
      // Usar mock API para login
      const result = await mockApi.loginWithGoogle();
      setUser(result.user);
      localStorage.setItem('oilgas-user', JSON.stringify(result.user));
      localStorage.setItem('oilgas-token', result.token);
      setCurrentRoute('dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft'): Promise<void> => {
    setLoading(true);
    try {
      // Simular OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await mockApi.loginWithGoogle();
      // Atualizar o loginProvider baseado no botão clicado
      const userWithProvider = {
        ...result.user,
        loginProvider: provider
      };
      setUser(userWithProvider);
      localStorage.setItem('oilgas-user', JSON.stringify(userWithProvider));
      localStorage.setItem('oilgas-token', result.token);
      setCurrentRoute('dashboard');
    } catch (error) {
      console.error('Social login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    setUser(null);
    localStorage.removeItem('oilgas-user');
    localStorage.removeItem('oilgas-token');
    setCurrentRoute('login');
  };

  const handleThemeToggle = (): void => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('oilgas-theme', newTheme);
  };

  const handleNavigate = (path: string): void => {
    // Mapear caminhos para rotas
    const routeMap: Record<string, Route> = {
      '/': 'dashboard',
      '/dashboard': 'dashboard',
      '/contracts': 'contracts',
      '/contracts/upload': 'upload',
      '/upload': 'upload',
      '/analysis': 'analysis',
      '/reports': 'reports',
      '/compliance': 'compliance',
      '/login': 'login'
    };

    // Extrair contract ID se for uma rota de análise
    if (path.startsWith('/analysis/')) {
      const id = path.split('/')[2];
      setContractId(id);
      setCurrentRoute('analysis');
      return;
    }

    const route = routeMap[path] || 'dashboard';
    setCurrentRoute(route);
  };

  // Renderizar conteúdo baseado na rota atual
  const renderContent = (): React.ReactNode => {
    if (!user && currentRoute !== 'login') {
      setCurrentRoute('login');
      return null;
    }

    switch (currentRoute) {
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onSocialLogin={handleSocialLogin}
            onNavigate={handleNavigate}
            theme={theme}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            user={user || undefined}
            theme={theme}
          />
        );

      case 'contracts':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Contratos</h1>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Gerencie e analise seus contratos ESG
                </p>
              </div>
              <button
                onClick={() => handleNavigate('/upload')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Novo Upload
              </button>
            </div>
            
            {/* Lista de contratos mockada */}
            <div className={`rounded-lg p-6 ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Contratos Recentes</h3>
              <div className="space-y-3">
                {[
                  { id: 'contract-001', name: 'Shell-Upstream-Brazil-2024.pdf', status: 'Analisado', score: 78.5 },
                  { id: 'contract-002', name: 'Petrobras-Partnership-Agreement.pdf', status: 'Analisado', score: 85.2 },
                  { id: 'contract-003', name: 'Equinor-Offshore-Contract.pdf', status: 'Processando', score: null }
                ].map((contract) => (
                  <div key={contract.id} className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{contract.name}</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status: {contract.status}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {contract.score && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            contract.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            contract.score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            Score: {contract.score}
                          </span>
                        )}
                        {contract.status === 'Analisado' && (
                          <button
                            onClick={() => handleNavigate(`/analysis/${contract.id}`)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                          >
                            Ver Análise
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'upload':
        return (
          <UploadContracts
            theme={theme}
            onNavigate={handleNavigate}
            user={user || undefined}
          />
        );

      case 'analysis':
        return (
          <AnalysisResults
            contractId={contractId}
            theme={theme}
            onNavigate={handleNavigate}
          />
        );

      case 'reports':
      case 'compliance':
        return (
          <ReportsCompliance
            theme={theme}
            onNavigate={handleNavigate}
          />
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Página em Desenvolvimento</h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Esta funcionalidade estará disponível em breve.
            </p>
            <button
              onClick={() => handleNavigate('/dashboard')}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        );
    }
  };

  // Se não estiver logado, mostrar apenas a tela de login
  if (!user && currentRoute === 'login') {
    return renderContent();
  }

  // Se estiver logado, mostrar o layout com navegação
  return (
    <Layout
      user={user || undefined}
      theme={theme}
      onThemeToggle={handleThemeToggle}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      currentPath={getCurrentPath()}
      notifications={3}
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Carregando...
            </p>
          </div>
        </div>
      ) : (
        renderContent()
      )}
    </Layout>
  );

  function getCurrentPath(): string {
    const pathMap: Record<Route, string> = {
      'login': '/login',
      'dashboard': '/dashboard',
      'contracts': '/contracts',
      'upload': '/contracts/upload',
      'analysis': '/analysis',
      'reports': '/reports',
      'compliance': '/compliance'
    };

    return pathMap[currentRoute] || '/dashboard';
  }
};

export default App;