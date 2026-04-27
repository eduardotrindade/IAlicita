// src/services/pncpApi.ts
const BASE_URL = import.meta.env.VITE_PNCP_BASE_URL || '/api-pncp'

export interface PncpItem {
  id: string;
  orgaoEntidade: { nome: string; cnpj: string };
  objetoCompra: string;
  dataPublicacaoPncp: string;
  modalidadeNome: string;
  valorTotalEstimado?: number;
}

export const searchPncp = async (query: string): Promise<PncpItem[]> => {
  try {
    const term = query ? encodeURIComponent(query) : 'software'
    const res = await fetch(`${BASE_URL}/api/search/?q=${term}&tipos_documento=edital&tam_pagina=10`, {
       method: 'GET',
       headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Erro PNCP');
    const data = await res.json();
    return data.items || data || [];
  } catch (err) {
    console.error("Erro na API", err);
    return [];
  }
}
