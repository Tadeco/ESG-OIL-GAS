import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Users,
  AlertCircle,
  Loader2,
  Shield,
  ArrowRight
} from 'lucide-react';

interface LoginProps {
  onLogin?: (name: string, email: string) => Promise<void>;
  onNavigate?: (path: string) => void;
  theme?: 'light' | 'dark';
}

const Login: React.FC<LoginProps> = ({ 
  onLogin = async () => {}, 
  onNavigate = () => {},
  theme = 'light' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Form state simplificado
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Form validation simplificada
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Validate name
  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError('Nome é obrigatório');
      return false;
    }
    if (value.trim().length < 2) {
      setNameError('Nome deve ter pelo menos 2 caracteres');
      return false;
    }
    setNameError('');
    return true;
  };

  // Validate email
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email é obrigatório');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Email inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    
    if (!isNameValid || !isEmailValid) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await onLogin(name.trim(), email.trim());
      onNavigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  // Função removida - não usamos mais MFA
  // Função removida - não usamos mais social login

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-white to-blue-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-green-900/20' : 'bg-green-200/30'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-200/30'
        }`} />
      </div>

      <div className="relative w-full max-w-md">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className={`px-8 pt-8 pb-6 text-center border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Acesso Simplificado
            </h1>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Entre no OIL & GAS ESG Contract Analyzer
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome Field */}
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Seu Nome
                  </label>
                  <div className="relative">
                    <Users className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) validateName(e.target.value);
                      }}
                      onBlur={() => validateName(name)}
                      autoComplete="name"
                      placeholder="Digite seu nome completo"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                      } ${nameError ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {nameError && (
                    <p className="mt-2 text-sm text-red-500">{nameError}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Seu Email
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) validateEmail(e.target.value);
                      }}
                      onBlur={() => validateEmail(email)}
                      autoComplete="email"
                      placeholder="seuemail@empresa.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                      } ${emailError ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-2 text-sm text-red-500">{emailError}</p>
                  )}
                </div>


                {/* Error Message */}
                {error && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${
                    theme === 'dark' ? 'bg-red-900/20 border border-red-900/30' : 'bg-red-50 border border-red-200'
                  }`}>
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !name.trim() || !email.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    !isLoading && name.trim() && email.trim()
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar no Sistema
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Aviso sobre envio por email */}
                <div className={`p-4 rounded-lg border-l-4 ${
                  theme === 'dark' 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`font-semibold text-sm mb-1 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-800'
                      }`}>
                        📧 Relatórios por Email
                      </h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        Após a análise ESG, o relatório detalhado será enviado automaticamente 
                        para o email informado acima.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
          </div>

          {/* Footer */}
          <div className={`px-8 py-6 text-center border-t ${
            theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'
          }`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('/register')}
                className="font-medium text-green-600 hover:text-green-700"
              >
                Sign up
              </button>
            </p>
            
            {/* Developer Credits */}
            <div className={`mt-4 pt-4 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Projeto desenvolvido por{' '}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Eng. Tadeu Santana
                </span>
              </p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                Sistema para análise ESG em contratos de petróleo e gás
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;