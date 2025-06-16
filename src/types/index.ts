export interface User {
  id: number;
  nome: string;
  email: string;
  role: string; // Mudança: agora é string simples
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  role?: 'MORADOR' | 'AGENTE' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  id: number;
  nome: string;
  email: string;
  role: string; // Mudança: agora é string simples ao invés de array
}

export interface Denuncia {
  id: number;
  descricao: string;
  localizacao: string;
  fotoUrl?: string;
  dataCriacao: string;
  status: DenunciaStatus;
  feedbackAutoridade?: string;
  usuarioId: number;
  usuarioNome: string;
}

export interface DenunciaCriacao {
  descricao: string;
  localizacao: string;
  latitude?: number;
  longitude?: number;
  fotoUrl?: string;
}

export interface DenunciaStatusUpdate {
  status: DenunciaStatus;
  feedbackAutoridade?: string;
}

export type DenunciaStatus = 
  | 'PENDENTE'
  | 'EM_ANALISE'
  | 'APROVADA'
  | 'A_CAMINHO_VISTORIA'
  | 'EM_EXECUCAO'
  | 'RESOLVIDA'
  | 'REJEITADA';

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

