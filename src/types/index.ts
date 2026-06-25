export interface Procurement {
  id: string
  title: string
  portal: string
  uf: string
  city?: string
  valueBrl: number
  status: 'aberto' | 'em_andamento' | 'homologado' | 'deserto' | 'cancelado'
  deadline: string
  keywordsMatched: string[]
  technicalScore?: number
  orgao?: string
  unidade?: string
  modalidade?: string
  situacao?: string
  dataPublicacao?: string
}

export interface CnpjData {
  cnpj: string
  nome: string
  fantasia: string
  situacao: string
  abertura: string
  tipo: string
  porte: string
  natureza_juridica: string
  atividade_principal: { code: string; text: string }
  atividades_secundarias: { code: string; text: string }[]
  qsa: { nome: string; qual: string }[]
  endereco: {
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    municipio: string
    uf: string
    cep: string
  }
  contato: { email: string; telefone: string }
}
