import React, { useState, useCallback, useEffect } from 'react';
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
  Download,
  FileDown,
  BarChart
} from 'lucide-react';
import { mockApi } from './mock-api';
import DetailedReport from './detailed-report';

interface UploadContractsProps {
  theme?: 'light' | 'dark';
  onNavigate?: (path: string) => void;
  user?: {
    name: string;
    email: string;
    role: string;
  };
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
  onNavigate = () => {},
  user
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [metadata, setMetadata] = useState({
    contractType: '',
    region: '',
    operator: ''
  });

  // Debug: monitorar mudanças no estado dos arquivos
  useEffect(() => {
    console.log('Estado dos arquivos mudou:', files);
    files.forEach((file, index) => {
      console.log(`Arquivo ${index + 1}:`, {
        nome: file.file.name,
        status: file.status,
        contractId: file.contractId,
        temResultado: !!file.result,
        resultado: file.result
      });
    });
  }, [files]);

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

        // Start analysis - LEITURA REAL DO PDF COM DEBUG COMPLETO
        console.log('🚀'.repeat(60));
        console.log('🔍 INICIANDO ANÁLISE COMPLETA DO PDF');
        console.log('🚀'.repeat(60));
        console.log('📄 Arquivo:', file.name);
        console.log('📏 Tamanho:', file.size, 'bytes');
        console.log('🕒 Hora:', new Date().toISOString());
        console.log('🆔 Contract ID:', uploadResult.contractId);
        console.log('🔍 ENVIANDO ARQUIVO REAL PARA ANÁLISE...');
        
        // DEBUG: Verificar se o arquivo é válido
        console.log('🔍 VALIDAÇÃO DO ARQUIVO:');
        console.log('  - Nome:', file.name);
        console.log('  - Tipo:', file.type);
        console.log('  - Tamanho:', file.size);
        console.log('  - Última modificação:', new Date(file.lastModified));
        
        // Incluir informações do usuário para envio automático de email
        const analysisResult = await mockApi.analyzeContract(
          uploadResult.contractId, 
          file.name, 
          file.size, 
          file,
          user?.email,  // EMAIL DO USUÁRIO PARA ENVIO AUTOMÁTICO
          user?.name    // NOME DO USUÁRIO PARA ENVIO AUTOMÁTICO
        );
        
        console.log('🎯'.repeat(60));
        console.log('✅ ANÁLISE CONCLUÍDA - RESULTADO RECEBIDO');
        console.log('🎯'.repeat(60));
        console.log('📊 Score Overall:', analysisResult?.overallScore);
        console.log('🌱 Score Environmental:', analysisResult?.categories?.environmental?.score);
        console.log('👥 Score Social:', analysisResult?.categories?.social?.score);
        console.log('🏛️ Score Governance:', analysisResult?.categories?.governance?.score);
        console.log('🔍 Confiança:', analysisResult?.confidence);
        
        // GARANTIR ATUALIZAÇÃO DO ESTADO COM VALIDAÇÃO
        console.log('🔄 INICIANDO ATUALIZAÇÃO FORÇADA DO ESTADO...');
        
        if (!analysisResult) {
          console.error('❌ ERRO: analysisResult é null/undefined');
          throw new Error('Resultado da análise não recebido');
        }
        
        if (!analysisResult.overallScore) {
          console.error('❌ ERRO: analysisResult sem overallScore');
          console.error('📊 Resultado recebido:', analysisResult);
        }
        
        const updatedFile: UploadedFile = {
          file,
          id: fileId,
          status: 'completed',
          progress: 100,
          contractId: uploadResult.contractId,
          result: analysisResult
        };
        
        console.log('📁 ARQUIVO FINAL PARA ATUALIZAÇÃO:');
        console.log('  - ID:', updatedFile.id);
        console.log('  - Status:', updatedFile.status);
        console.log('  - ContractId:', updatedFile.contractId);
        console.log('  - Tem resultado:', !!updatedFile.result);
        console.log('  - Score:', updatedFile.result?.overallScore);
        
        setFiles(prev => {
          const newFiles = prev.map(f => {
            if (f.id === fileId) {
              console.log('🎯 ATUALIZANDO ARQUIVO:', f.file.name);
              return updatedFile;
            }
            return f;
          });
          
          const updatedFileInList = newFiles.find(f => f.id === fileId);
          console.log('✅ ARQUIVO ATUALIZADO NA LISTA:', updatedFileInList);
          console.log('✅ Status final:', updatedFileInList?.status);
          console.log('✅ Tem resultado final:', !!updatedFileInList?.result);
          
          return newFiles;
        });

        // CONFIRMAÇÃO VISUAL PARA O USUÁRIO COM EMAIL CONFIRMADO
        if (user?.email && updatedFile.result) {
          const message = `
✅ ANÁLISE ESG CONCLUÍDA!

📄 Arquivo: ${updatedFile.file.name}
📊 Score ESG Geral: ${updatedFile.result.overallScore}/100
🌱 Ambiental: ${updatedFile.result.categories.environmental.score}/100
👥 Social: ${updatedFile.result.categories.social.score}/100
🏡 Governança: ${updatedFile.result.categories.governance.score}/100

📧 ✅ RELATÓRIO ENVIADO POR EMAIL PARA: ${user.email}
📨 Status: Email simulado enviado com sucesso!

👁️ Clique em "Ver Detalhes" para ver o relatório completo
🔍 Navegue para "Relatórios" ou "Compliance" para ver dados atualizados
          `;
          
          setTimeout(() => {
            alert(message);
          }, 1000);
        }
        
        // Verificação adicional após 1 segundo
        setTimeout(() => {
          console.log('🔍 VERIFICAÇÃO PÓS-ATUALIZAÇÃO...');
          setFiles(currentFiles => {
            console.log('📊 Estado atual dos arquivos:', currentFiles);
            const targetFile = currentFiles.find(f => f.id === fileId);
            console.log('🎯 Arquivo target encontrado:', targetFile);
            console.log('✅ Tem resultado?', !!targetFile?.result);
            return currentFiles;
          });
        }, 1000);

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

  // FUNÇÃO REMOVIDA - Email é processado durante a análise
  // Mantendo apenas para compatibilidade

  // Remove file
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // View analysis results - RELATÓRIO DETALHADO
  const viewResults = (file: UploadedFile) => {
    console.log('📊 ABRINDO RELATÓRIO DETALHADO');
    console.log('📄 Arquivo:', file.file.name);
    console.log('📊 Resultado completo:', file.result);
    
    if (file.result && file.contractId) {
      setSelectedFile(file);
      setShowDetailedReport(true);
      console.log('✅ RELATÓRIO DETALHADO ABERTO');
    } else {
      console.log('❌ ERRO: Arquivo sem resultados');
      alert(`❌ ERRO: Resultados não disponíveis para ${file.file.name}\n\nStatus: ${file.status}\nTente fazer upload novamente.`);
    }
  };

  // Quick view results - MODAL RÁPIDO
  const quickViewResults = (file: UploadedFile) => {
    console.log('👁️ VISUALIZAÇÃO RÁPIDA');
    
    if (file.result && file.contractId) {
      const result = file.result;
      const envScore = result.categories?.environmental?.score || 0;
      const socScore = result.categories?.social?.score || 0;
      const govScore = result.categories?.governance?.score || 0;
      
      const message = `
🏢 ANÁLISE ESG RÁPIDA
━━━━━━━━━━━━━━━━━━━━━━━━━

📄 ARQUIVO: ${file.file.name}
📅 DATA: ${new Date(result.uploadDate).toLocaleString('pt-BR')}

━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SCORES ESG

🎯 GERAL: ${result.overallScore}/100 ${result.overallScore >= 80 ? '🟢 EXCELENTE' : result.overallScore >= 60 ? '🟡 BOM' : '🔴 CRÍTICO'}

🌱 AMBIENTAL: ${envScore}/100
👥 SOCIAL: ${socScore}/100  
🏛️ GOVERNANÇA: ${govScore}/100

━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 CONFIABILIDADE: ${(result.confidence * 100).toFixed(1)}%
✅ Baseado no conteúdo REAL do PDF

💡 Para ver relatório completo com download, clique em "Relatório Detalhado"
      `;
      
      alert(message);
    } else {
      alert(`❌ ERRO: Resultados não disponíveis para ${file.file.name}`);
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
        return '📤 Fazendo upload...';
      case 'analyzing':
        return '🤖 Analisando conteúdo com IA...';
      case 'completed':
        return '✅ Análise concluída - Clique em "Ver Resultados"';
      case 'error':
        return '❌ Erro no processamento';
      default:
        return '⏳ Pendente';
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
                        <p className={`text-sm font-medium ${
                          file.status === 'analyzing' ? 'text-blue-600 dark:text-blue-400' :
                          file.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                          file.status === 'error' ? 'text-red-600 dark:text-red-400' :
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
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
                      <>
                        <button
                          onClick={() => quickViewResults(file)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Resumo
                        </button>
                        <button
                          onClick={() => viewResults(file)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          <BarChart className="w-4 h-4" />
                          Relatório Detalhado
                        </button>
                      </>
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

                {/* RENDERIZAÇÃO ROBUSTA DOS RESULTADOS */}
                {(() => {
                  console.log('🎨 RENDERIZANDO ARQUIVO:', file.file.name);
                  console.log('📊 Status:', file.status);
                  console.log('✅ Tem resultado?', !!file.result);
                  console.log('📋 Resultado completo:', file.result);
                  
                  if (file.status === 'completed' && file.result) {
                    const envScore = file.result.categories?.environmental?.score;
                    const socScore = file.result.categories?.social?.score;
                    const govScore = file.result.categories?.governance?.score;
                    const overallScore = file.result.overallScore;
                    
                    console.log('🎯 Scores extraídos - Env:', envScore, 'Soc:', socScore, 'Gov:', govScore, 'Overall:', overallScore);
                    
                    return (
                      <div className="mt-4">
                        {/* Score Overall Destacado */}
                        <div className={`mb-4 p-4 rounded-lg border-2 ${
                          overallScore >= 80 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                          overallScore >= 60 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                          'border-red-500 bg-red-50 dark:bg-red-900/20'
                        }`}>
                          <div className="text-center">
                            <p className={`text-4xl font-bold ${
                              overallScore >= 80 ? 'text-green-600 dark:text-green-400' :
                              overallScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {overallScore?.toFixed(1) || 'N/A'}
                            </p>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              SCORE ESG GERAL
                            </p>
                            <p className={`text-xs mt-1 ${
                              overallScore >= 80 ? 'text-green-700 dark:text-green-300' :
                              overallScore >= 60 ? 'text-yellow-700 dark:text-yellow-300' :
                              'text-red-700 dark:text-red-300'
                            }`}>
                              {overallScore >= 80 ? '🟢 EXCELENTE' :
                               overallScore >= 60 ? '🟡 MÉDIO' : '🔴 CRÍTICO'}
                            </p>
                            <p className="text-xs mt-2 text-blue-600 dark:text-blue-400 font-semibold">
                              📊 Baseado na análise real do PDF
                            </p>
                          </div>
                        </div>
                        
                        {/* Scores Detalhados */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className={`text-center p-3 rounded-lg border ${
                            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                          }`}>
                            <p className={`text-2xl font-bold ${
                              envScore >= 80 ? 'text-green-600 dark:text-green-400' :
                              envScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {envScore || 'N/A'}
                            </p>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">AMBIENTAL</p>
                            <p className="text-xs text-gray-500">Environmental</p>
                          </div>
                          <div className={`text-center p-3 rounded-lg border ${
                            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                          }`}>
                            <p className={`text-2xl font-bold ${
                              socScore >= 80 ? 'text-blue-600 dark:text-blue-400' :
                              socScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {socScore || 'N/A'}
                            </p>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">SOCIAL</p>
                            <p className="text-xs text-gray-500">Social</p>
                          </div>
                          <div className={`text-center p-3 rounded-lg border ${
                            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                          }`}>
                            <p className={`text-2xl font-bold ${
                              govScore >= 80 ? 'text-purple-600 dark:text-purple-400' :
                              govScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {govScore || 'N/A'}
                            </p>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">GOVERNANÇA</p>
                            <p className="text-xs text-gray-500">Governance</p>
                          </div>
                        </div>
                        
                        {/* Indicador de Sucesso */}
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
                          <p className="text-xs text-green-800 dark:text-green-200 text-center font-semibold">
                            ✅ ANÁLISE ESG CONCLUÍDA COM SUCESSO!
                          </p>
                        </div>
                      </div>
                    );
                  } else {
                    console.log('❌ Sem resultados - Status:', file.status, 'Result:', !!file.result);
                    return (
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
                          ⚠️ {file.status === 'completed' ? 'Erro: Resultados não carregados' : `Status: ${file.status}`}
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                          Arquivo: {file.file.name} | Resultado: {file.result ? 'Existe' : 'Não existe'}
                        </p>
                      </div>
                    );
                  }
                })()}
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

      {/* Detailed Report Modal */}
      {showDetailedReport && selectedFile && selectedFile.result && (
        <DetailedReport
          result={selectedFile.result}
          fileName={selectedFile.file.name}
          onClose={() => {
            setShowDetailedReport(false);
            setSelectedFile(null);
            console.log('🔒 RELATÓRIO DETALHADO FECHADO');
          }}
          theme={theme}
        />
      )}
    </div>
  );
};

export default UploadContracts;