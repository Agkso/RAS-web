import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { denunciaService } from '../services/denunciaService';
import { DenunciaCriacao } from '../types';
import { ArrowLeft, MapPin } from 'lucide-react';
import MapLocationSelector from '../components/MapLocationSelector';
import ImageUploader from '../components/ImageUploader';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'; // Substitua pela sua API Key
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY'; // Substitua pela sua API Key do ImgBB

const EnviarDenuncia: React.FC = () => {
  const [formData, setFormData] = useState<DenunciaCriacao>({
    descricao: '',
    localizacao: '',
    latitude: undefined,
    longitude: undefined,
    fotoUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData({
      ...formData,
      localizacao: location.address,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData({
      ...formData,
      fotoUrl: imageUrl,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!formData.descricao.trim()) {
      setError('A descrição é obrigatória');
      setIsLoading(false);
      return;
    }

    if (!formData.localizacao.trim()) {
      setError('A localização é obrigatória');
      setIsLoading(false);
      return;
    }

    try {
      await denunciaService.criarDenuncia(formData);
      setSuccess('Denúncia enviada com sucesso!');
      setTimeout(() => {
        navigate('/dashboard-morador');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data || 'Erro ao enviar denúncia');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/dashboard-morador')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Enviar Denúncia
              </h1>
              <p className="text-gray-600">Relate um problema ambiental</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {success}
                  </div>
                )}

                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                    Descrição da Denúncia *
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="descricao"
                      name="descricao"
                      rows={4}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Descreva detalhadamente o problema ambiental observado..."
                      value={formData.descricao}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Seja específico sobre o que você observou, quando aconteceu e qual o impacto ambiental.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Localização *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      {showMap ? 'Ocultar Mapa' : 'Selecionar no Mapa'}
                    </button>
                  </div>
                  
                  <div className="mt-1">
                    <input
                      type="text"
                      id="localizacao"
                      name="localizacao"
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Ex: Rua das Flores, 123, Centro - São Paulo/SP"
                      value={formData.localizacao}
                      onChange={handleChange}
                    />
                  </div>
                  
                  {showMap && (
                    <div className="mt-4">
                      <MapLocationSelector
                        onLocationSelect={handleLocationSelect}
                        apiKey={GOOGLE_MAPS_API_KEY}
                        initialLocation={
                          formData.latitude && formData.longitude
                            ? { lat: formData.latitude, lng: formData.longitude }
                            : undefined
                        }
                      />
                    </div>
                  )}
                  
                  {formData.latitude && formData.longitude && (
                    <p className="mt-2 text-xs text-gray-500">
                      Coordenadas: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </p>
                  )}
                  
                  <p className="mt-2 text-sm text-gray-500">
                    Forneça o endereço completo ou use o mapa para selecionar a localização precisa.
                  </p>
                </div>

                <div>
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    currentImageUrl={formData.fotoUrl}
                    apiKey={IMGBB_API_KEY}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Informações Importantes
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Sua denúncia será analisada por agentes especializados</li>
                          <li>Você receberá atualizações sobre o status da sua denúncia</li>
                          <li>Todas as informações fornecidas são confidenciais</li>
                          <li>Denúncias falsas podem resultar em penalidades</li>
                          <li>A localização precisa ajuda na resolução mais rápida do problema</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard-morador')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Denúncia'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnviarDenuncia;

