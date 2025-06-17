import React, { useState, useEffect } from 'react';
import { denunciaService } from '../services/denunciaService';

interface Denuncia {
  id: number;
  descricao: string;
  localizacao: string;
  latitude?: number;
  longitude?: number;
  fotoUrl?: string;
  dataCriacao: string;
  status: string;
  feedbackAutoridade?: string;
  usuarioId: number;
  usuarioNome: string;
}

interface FiltrosHistorico {
  status: string;
  localizacao: string;
  dataInicio: string;
  dataFim: string;
  sortBy: string;
  sortDir: string;
}

const HistoricoDenuncias: React.FC = () => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filtros, setFiltros] = useState<FiltrosHistorico>({
    status: '',
    localizacao: '',
    dataInicio: '',
    dataFim: '',
    sortBy: 'dataCriacao',
    sortDir: 'desc'
  });

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'EM_ANALISE', label: 'Em Análise' },
    { value: 'RESOLVIDA', label: 'Resolvida' },
    { value: 'REJEITADA', label: 'Rejeitada' }
  ];

  const sortOptions = [
    { value: 'dataCriacao', label: 'Data de Criação' },
    { value: 'status', label: 'Status' },
    { value: 'localizacao', label: 'Localização' }
  ];

  const carregarDenuncias = async (page = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '10',
        sortBy: filtros.sortBy,
        sortDir: filtros.sortDir
      });

      if (filtros.status) params.append('status', filtros.status);
      if (filtros.localizacao) params.append('localizacao', filtros.localizacao);
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);

      const response = await denunciaService.listarMinhasDenuncias(params.toString());
      
      setDenuncias(response.content);
      setCurrentPage(response.number);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Erro ao carregar denúncias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDenuncias();
  }, [filtros]);

  const handleFiltroChange = (campo: keyof FiltrosHistorico, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
    setCurrentPage(0);
  };

  const limparFiltros = () => {
    setFiltros({
      status: '',
      localizacao: '',
      dataInicio: '',
      dataFim: '',
      sortBy: 'dataCriacao',
      sortDir: 'desc'
    });
    setCurrentPage(0);
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800';
      case 'EM_ANALISE': return 'bg-blue-100 text-blue-800';
      case 'RESOLVIDA': return 'bg-green-100 text-green-800';
      case 'REJEITADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'Pendente';
      case 'EM_ANALISE': return 'Em Análise';
      case 'RESOLVIDA': return 'Resolvida';
      case 'REJEITADA': return 'Rejeitada';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Histórico de Denúncias</h2>
        <div className="text-sm text-gray-600">
          Total: {totalElements} denúncia{totalElements !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filtros.status}
              onChange={(e) => handleFiltroChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <input
              type="text"
              value={filtros.localizacao}
              onChange={(e) => handleFiltroChange('localizacao', e.target.value)}
              placeholder="Digite parte da localização..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <input
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim
            </label>
            <input
              type="date"
              value={filtros.dataFim}
              onChange={(e) => handleFiltroChange('dataFim', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              value={filtros.sortBy}
              onChange={(e) => handleFiltroChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Direção
            </label>
            <select
              value={filtros.sortDir}
              onChange={(e) => handleFiltroChange('sortDir', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Decrescente</option>
              <option value="asc">Crescente</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={limparFiltros}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Denúncias */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Carregando...</span>
        </div>
      ) : denuncias.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma denúncia encontrada com os filtros aplicados.
        </div>
      ) : (
        <div className="space-y-4">
          {denuncias.map((denuncia) => (
            <div key={denuncia.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-800">#{denuncia.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(denuncia.status)}`}>
                      {getStatusLabel(denuncia.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{denuncia.descricao}</p>
                  <div className="text-sm text-gray-500">
                    <p><strong>Localização:</strong> {denuncia.localizacao}</p>
                    <p><strong>Data:</strong> {formatarData(denuncia.dataCriacao)}</p>
                    {denuncia.feedbackAutoridade && (
                      <p><strong>Feedback:</strong> {denuncia.feedbackAutoridade}</p>
                    )}
                  </div>
                </div>
                {denuncia.fotoUrl && (
                  <div className="ml-4">
                    <img
                      src={denuncia.fotoUrl}
                      alt="Foto da denúncia"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => carregarDenuncias(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          
          <span className="px-3 py-1 text-sm text-gray-600">
            Página {currentPage + 1} de {totalPages}
          </span>
          
          <button
            onClick={() => carregarDenuncias(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoricoDenuncias;

