import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export interface Company {
  id: string;
  tipoPessoa: string;
  razaoSocial?: string;
  cnpj?: string;
  cpf?: string;
  identificadorEstrangeiro?: string;
  nomeFantasia: string;
  perfil: string;
  faturamentoDireto: boolean;
  status: string;
  documentoComprobatorio?: string;
  documentoOpcional?: string;
  motivoReprovacao?: string;
  usuarioResponsavel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyDto {
  tipoPessoa: string;
  razaoSocial?: string;
  cnpj?: string;
  nome?: string;
  cpf?: string;
  identificadorEstrangeiro?: string;
  nomeFantasia: string;
  perfil: string;
  faturamentoDireto?: boolean;
  documentoComprobatorio: string;
  documentoOpcional?: string;
  usuarioResponsavel?: string;
}

export const companyApi = {
  create: async (data: CreateCompanyDto): Promise<{ message: string; data: Company }> => {
    const response = await api.post('/companies', data);
    return response.data;
  },

  getAll: async (): Promise<Company[]> => {
    const response = await api.get('/companies');
    return response.data;
  },

  getById: async (id: string): Promise<Company> => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  approve: async (id: string): Promise<{ message: string; data: Company }> => {
    const response = await api.patch(`/companies/${id}/approve`);
    return response.data;
  },

  reject: async (id: string, motivo: string): Promise<{ message: string; data: Company }> => {
    const response = await api.patch(`/companies/${id}/reject`, { motivo });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCompanyDto>): Promise<{ message: string; data: Company }> => {
    const response = await api.patch(`/companies/${id}`, data);
    return response.data;
  },
};

export default api;