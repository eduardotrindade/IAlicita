export type ProcurementStatus =
  | 'aberto'
  | 'em_andamento'
  | 'homologado'
  | 'deserto'
  | 'cancelado'

export interface Procurement {
  id: string
  title: string
  portal: string
  uf: string
  city?: string
  valueBrl: number
  status: ProcurementStatus
  deadline: string
  keywordsMatched: string[]
  technicalScore?: number
  favored?: boolean
}

export interface Supplier {
  id: string
  companyName: string
  cnpjMask: string
  uf: string
  isMicroOrSmall: boolean
  participations: number
  wins: number
  totalWonValueBrl: number
  avgTicketBrl: number
  winRate: number
  recentPortals: string[]
}
