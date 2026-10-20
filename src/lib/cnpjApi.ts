import type { CnpjData } from '@/types'

function mapToCnpjData(data: Record<string, any>, cnpj: string): CnpjData {
  const atvPrincipal = Array.isArray(data.atividade_principal)
    ? data.atividade_principal[0]
    : data.atividade_principal || { code: '', text: '' }

  const atvSecundarias = Array.isArray(data.atividades_secundarias)
    ? data.atividades_secundarias
    : []

  const qsa = Array.isArray(data.qsa)
    ? data.qsa.map((s: any) => ({
        nome: s.nome || s.nome_socio || '',
        qual: s.qual || s.qualificacao_socio || 'Sócio',
      }))
    : []

  return {
    cnpj: (data.cnpj as string) || cnpj,
    nome: (data.nome as string) || (data.razao_social as string) || '',
    fantasia: (data.fantasia as string) || (data.nome_fantasia as string) || '',
    situacao: (data.situacao as string) || (data.descricao_situacao_cadastral as string) || 'ATIVA',
    abertura: (data.abertura as string) || (data.data_inicio_atividade as string) || '',
    tipo: (data.tipo as string) || 'MATRIZ',
    porte: (data.porte as string) || 'DEMAIS',
    natureza_juridica: (data.natureza_juridica as string) || '',
    capital_social: Number(data.capital_social || 0),
    atividade_principal: {
      code: atvPrincipal.code || atvPrincipal.codigo || '',
      text: atvPrincipal.text || atvPrincipal.descricao || '',
    },
    atividades_secundarias: atvSecundarias.map((a: any) => ({
      code: a.code || a.codigo || '',
      text: a.text || a.text || a.descricao || '',
    })),
    qsa,
    endereco: {
      logradouro: (data.logradouro as string) || (data.endereco?.logradouro as string) || '',
      numero: (data.numero as string) || (data.endereco?.numero as string) || '',
      complemento: (data.complemento as string) || (data.endereco?.complemento as string) || '',
      bairro: (data.bairro as string) || (data.endereco?.bairro as string) || '',
      municipio: (data.municipio as string) || (data.endereco?.municipio as string) || '',
      uf: (data.uf as string) || (data.endereco?.uf as string) || '',
      cep: (data.cep as string) || (data.endereco?.cep as string) || '',
    },
    contato: {
      email: (data.email as string) || (data.contato?.email as string) || '',
      telefone: (data.telefone as string) || (data.contato?.telefone as string) || '',
    },
  }
}

export async function lookupCnpj(cnpj: string): Promise<CnpjData | null> {
  try {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length !== 14) throw new Error('CNPJ deve ter 14 dígitos')

    const res = await fetch(`/api/cnpj?cnpj=${digits}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Erro ${res.status}`)
    const data = await res.json()

    if (data.error || data.status === 'ERROR') {
      throw new Error(data.error || data.message || 'Erro na consulta do CNPJ')
    }

    return mapToCnpjData(data, cnpj)
  } catch (err) {
    console.warn('Erro ao consultar CNPJ:', (err as Error)?.message)
    return null
  }
}
