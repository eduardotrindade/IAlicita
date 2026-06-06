import type { CnpjData } from '../types'

const RECEITAWS_URL = 'https://receitaws.com.br/v1/cnpj'

export const lookupCnpj = async (cnpj: string): Promise<CnpjData | null> => {
  try {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) throw new Error('CNPJ deve ter 14 dígitos')

    const res = await fetch(`${RECEITAWS_URL}/${digits}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    })
    if (!res.ok) throw new Error(`ReceitaWS erro ${res.status}`)
    const data = await res.json()

    if (data.status === 'ERROR') throw new Error(data.message || 'Erro ReceitaWS')

    return {
      cnpj: data.cnpj || cnpj,
      nome: data.nome || '',
      fantasia: data.fantasia || '',
      situacao: data.situacao || '',
      abertura: data.abertura || '',
      tipo: data.tipo || '',
      porte: data.porte || '',
      natureza_juridica: data.natureza_juridica || '',
      atividade_principal: data.atividade_principal?.[0] || { code: '', text: '' },
      atividades_secundarias: data.atividades_secundarias || [],
      qsa: data.qsa || [],
      endereco: {
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        municipio: data.municipio || '',
        uf: data.uf || '',
        cep: data.cep || '',
      },
      contato: {
        email: data.email || '',
        telefone: data.telefone || '',
      },
    }
  } catch (err) {
    console.error('Erro ao consultar CNPJ', err)
    return null
  }
}
