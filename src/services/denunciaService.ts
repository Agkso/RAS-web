import api from './api';
import { Denuncia, DenunciaCriacao, DenunciaStatusUpdate, PaginatedResponse } from '../types';

export const denunciaService = {
  criarDenuncia: async (denuncia: DenunciaCriacao): Promise<Denuncia> => {
    const response = await api.post('/denuncias', denuncia);
    return response.data;
  },

  listarMinhasDenuncias: async (page = 0, size = 10): Promise<PaginatedResponse<Denuncia>> => {
    const response = await api.get(`/denuncias/minhas?page=${page}&size=${size}`);
    return response.data;
  },

  listarTodasDenuncias: async (
    page = 0, 
    size = 10, 
    status?: string, 
    localizacao?: string
  ): Promise<PaginatedResponse<Denuncia>> => {
    let url = `/denuncias?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    if (localizacao) url += `&localizacao=${localizacao}`;
    
    const response = await api.get(url);
    return response.data;
  },

  obterDenuncia: async (id: number): Promise<Denuncia> => {
    const response = await api.get(`/denuncias/${id}`);
    return response.data;
  },

  atualizarStatusDenuncia: async (
    id: number, 
    statusUpdate: DenunciaStatusUpdate
  ): Promise<Denuncia> => {
    const response = await api.put(`/denuncias/${id}/status`, statusUpdate);
    return response.data;
  },

  listarDenunciasPorRegiao: async (
    localizacao: string, 
    page = 0, 
    size = 10
  ): Promise<PaginatedResponse<Denuncia>> => {
    const response = await api.get(`/denuncias/regiao?localizacao=${localizacao}&page=${page}&size=${size}`);
    return response.data;
  },
};

