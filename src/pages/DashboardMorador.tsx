import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, FileText, MapPin } from 'lucide-react';
import { denunciaService } from '../services/denunciaService';
import { Denuncia } from '../types';

const DashboardMorador: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [minhasDenuncias, setMinhasDenuncias] = useState<Denuncia[]>([]);
  const [loadingDenuncias, setLoadingDenuncias] = useState(true);
  const [errorDenuncias, setErrorDenuncias] = useState<string | null>(null);

  useEffect(() => {
    const fetchMinhasDenuncias = async () => {
      if (!user) {
        setLoadingDenuncias(false);
        return;
      }
      try {
        setLoadingDenuncias(true);
        const response = await denunciaService.listarMinhasDenuncias();
        setMinhasDenuncias(response.content);
      } catch (err) {
        console.error('Erro ao buscar minhas denúncias:', err);
        setErrorDenuncias('Erro ao carregar suas denúncias.');
      } finally {
        setLoadingDenuncias(false);
      }
    };

    fetchMinhasDenuncias();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard do Morador
              </h1>
              <p className="text-gray-600">Bem-vindo, {user?.nome}</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              onClick={() => navigate('/enviar-denuncia')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Nova Denúncia
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Enviar denúncia
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Minhas Denúncias
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Ver histórico
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MapPin className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Denúncias da Região
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Ver mapa
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Minhas Denúncias Recentes
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Últimas denúncias enviadas por você
              </p>
            </div>
            <div className="border-t border-gray-200">
              {loadingDenuncias ? (
                <p className="p-6 text-center text-gray-500">Carregando denúncias...</p>
              ) : errorDenuncias ? (
                <p className="p-6 text-center text-red-500">{errorDenuncias}</p>
              ) : minhasDenuncias.length === 0 ? (
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-gray-500 text-center">
                    Nenhuma denúncia encontrada. 
                    <button
                      onClick={() => navigate('/enviar-denuncia')}
                      className="text-blue-600 hover:text-blue-500 ml-1"
                    >
                      Envie sua primeira denúncia
                    </button>
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {minhasDenuncias.map((denuncia) => (
                    <li key={denuncia.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          {denuncia.descricao}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {denuncia.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {denuncia.localizacao}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <time dateTime={denuncia.dataCriacao}>
                            {new Date(denuncia.dataCriacao).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMorador;

