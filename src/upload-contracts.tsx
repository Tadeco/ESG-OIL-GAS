import React, { useState, useCallback } from 'react';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileCheck,
  Building2,
  MapPin,
  Calendar,
  Tag,
  Zap,
  BarChart3,
  Eye,
  Download
} from 'lucide-react';
import { mockApi } from './mock-api';

interface UploadContractsProps {
  theme?: 'light' | 'dark';
  onNavigate?: (path: string) => void;
}

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'analyzing' | 'completed' | 'error';
  progress: number;
  contractId?: string;
  result?: any;
  error?: string;
}

const UploadContracts: React.FC<UploadContractsProps> = ({
  theme = 'light',
  onNavigate = () => {}
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [metadata, setMetadata] = useState({
    contractType: '',
    region: '',
    operator: ''
  });

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Process uploaded files
  const handleFiles = async (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return validTypes.includes(file.type) && file.size <= 50 * 1024 * 1024; // 50MB limit
    });

    for (const file of validFiles) {
      const fileId = `file-${Date.now()}-${Math.random()}`;
      const uploadedFile: UploadedFile = {
        file,
        id: fileId,
        status: 'uploading',
        progress: 0
      };

      setFiles(prev => [...prev, uploadedFile]);

      try {
        console.log('Iniciando upload do arquivo:', file.name);
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          ));
        }

        console.log('Upload concluído, iniciando análise...');

        // Upload to mock API
        const uploadResult = await mockApi.uploadContract({ file, metadata });
        console.log('Upload result:', uploadResult);
        
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'analyzing', 
            contractId: uploadResult.contractId,
            progress: 100 
          } : f
        ));

        // Start analysis
        console.log('Iniciando análise ESG...');
        const analysisResult = await mockApi.analyzeContract(uploadResult.contractId);
        console.log('Análise concluída:', analysisResult);
        
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'completed',
            result: analysisResult
          } : f
        ));

        console.log('Processo completo para arquivo:', file.name);

      } catch (error) {
        console.error('Erro no upload/análise:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'error',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          } : f
        ));
      }
    }
  };

  // Remove file
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // View analysis results
  const viewResults = (file: UploadedFile) => {
    console.log('Tentando ver resultados para arquivo:', file);
    if (file.result && file.contractId) {
      console.log('Navegando para análise:', `/analysis/${file.contractId}`);
      onNavigate(`analysis`); // Simplificado para testar se a navegação funciona
    } else {
      console.log('Arquivo não tem resultados ou contractId:', file);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'analyzing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Fazendo upload...';
      case 'analyzing':
        return 'Analisando com IA...';
      case 'completed':
        return 'Análise concluída';
      case 'error':
        return 'Erro no processamento';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Upload de Contratos</h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Faça upload de contratos para análise ESG automatizada com IA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          <span className="text-sm font-medium">Powered by GPT-4</span>
        </div>
      </div>

      {/* Upload Area */}
      <div className={`rounded-lg border-2 border-dashed transition-all duration-200 ${
        dragActive 
          ? theme === 'dark' 
            ? 'border-green-500 bg-green-900/20' 
            : 'border-green-500 bg-green-50'
          : theme === 'dark'
            ? 'border-gray-600 hover:border-gray-500'
            : 'border-gray-300 hover:border-gray-400'
      }`}>
        <div
          className="p-8 text-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className={`mx-auto w-12 h-12 mb-4 ${
            dragActive ? 'text-green-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          
          <h3 className={`text-lg font-semibold mb-2 ${
            dragActive ? 'text-green-600 dark:text-green-400' : ''
          }`}>
            {dragActive ? 'Solte os arquivos aqui' : 'Arraste contratos ou clique para selecionar'}
          </h3>
          
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Suporta PDF, DOC, DOCX até 50MB
          </p>

          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 cursor-pointer"
          >
            <FileText className="w-5 h-5" />
            Selecionar Arquivos
          </label>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span>Upstream/Downstream</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>Score ESG Automático</span>
            </div>
            <div className="flex items-center gap-1">
              <FileCheck className="w-4 h-4" />
              <span>Compliance Check</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Form */}
      {files.length > 0 && (
        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Informações Adicionais (Opcional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Tag className="w-4 h-4 inline mr-1" />
                Tipo de Contrato
              </label>
              <select
                value={metadata.contractType}
                onChange={(e) => setMetadata(prev => ({ ...prev, contractType: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Selecionar...</option>
                <option value="upstream">Upstream (E&P)</option>
                <option value="downstream">Downstream (Refino)</option>
                <option value="midstream">Midstream (Transporte)</option>
                <option value="service">Serviços</option>
                <option value="joint-venture">Joint Venture</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <MapPin className="w-4 h-4 inline mr-1" />
                Região
              </label>
              <select
                value={metadata.region}
                onChange={(e) => setMetadata(prev => ({ ...prev, region: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Selecionar...</option>
                <option value="brazil">Brasil</option>
                <option value="gulf-mexico">Golfo do México</option>
                <option value="north-sea">Mar do Norte</option>
                <option value="middle-east">Oriente Médio</option>
                <option value="africa">África</option>
                <option value="asia">Ásia</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Building2 className="w-4 h-4 inline mr-1" />
                Operadora
              </label>
              <input
                type="text"
                value={metadata.operator}
                onChange={(e) => setMetadata(prev => ({ ...prev, operator: e.target.value }))}
                placeholder="Ex: Shell, Petrobras, Equinor..."
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className={`rounded-lg ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">Arquivos em Processamento</h3>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {files.filter(f => f.status === 'completed').length} de {files.length} concluídos
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {files.map((file) => (
              <div key={file.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(file.status)}
                    
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {file.file.name}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getStatusText(file.status)}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {(file.file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                        {file.result && (
                          <p className={`text-sm font-medium ${
                            file.result.overallScore >= 80 ? 'text-green-600 dark:text-green-400' :
                            file.result.overallScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            Score ESG: {file.result.overallScore}/100
                          </p>
                        )}
                        {file.status === 'error' && file.error && (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Erro: {file.error}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === 'completed' && (
                      <button
                        onClick={() => viewResults(file)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Análise
                      </button>
                    )}

                    <button
                      onClick={() => removeFile(file.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {(file.status === 'uploading' || file.status === 'analyzing') && (
                  <div className="mt-4">
                    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.status === 'analyzing' ? 100 : file.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Quick Results Preview */}
                {file.result && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className={`text-center p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {file.result.categories.environmental.score}
                      </p>
                      <p className="text-xs text-gray-500">Environmental</p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {file.result.categories.social.score}
                      </p>
                      <p className="text-xs text-gray-500">Social</p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {file.result.categories.governance.score}
                      </p>
                      <p className="text-xs text-gray-500">Governance</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className={`rounded-lg p-6 ${
        theme === 'dark' ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'
      }`}>
        <h3 className={`font-semibold mb-3 ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-800'
        }`}>
          💡 Dicas para Melhor Análise
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <ul className={`space-y-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            <li>• Contratos completos geram análises mais precisas</li>
            <li>• PDFs com texto pesquisável são preferíveis</li>
            <li>• Inclua anexos ambientais e sociais quando possível</li>
          </ul>
          <ul className={`space-y-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            <li>• A análise considera frameworks GRI, SASB e TCFD</li>
            <li>• Resultados são baseados em padrões do setor O&G</li>
            <li>• Relatórios detalhados disponíveis após análise</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadContracts;