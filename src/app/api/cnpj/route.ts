import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cnpj = searchParams.get('cnpj')?.replace(/\D/g, '') || ''
    if (cnpj.length !== 14) {
      return NextResponse.json({ error: 'CNPJ deve ter 14 dígitos' }, { status: 400 })
    }

    // 1. Tentar BrasilAPI primeiro (rápida, sem rate limit restritivo de 3 req/min)
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 7000)
      const resBrasil = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
        headers: {
          Accept: 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 IAlicita/1.0',
        },
        signal: ctrl.signal,
      })
      clearTimeout(timer)

      if (resBrasil.ok) {
        const b = await resBrasil.json()
        return NextResponse.json({
          _source: 'brasilapi',
          cnpj: b.cnpj || cnpj,
          nome: b.razao_social || '',
          fantasia: b.nome_fantasia || '',
          situacao: b.descricao_situacao_cadastral || 'ATIVA',
          abertura: b.data_inicio_atividade || '',
          tipo: b.descricao_identificador_matriz_filial || 'MATRIZ',
          porte: b.porte || 'DEMAIS',
          natureza_juridica: b.natureza_juridica || '',
          capital_social: b.capital_social || 0,
          atividade_principal: [
            {
              code: String(b.cnae_fiscal || ''),
              text: b.cnae_fiscal_descricao || '',
            },
          ],
          atividades_secundarias: (b.cnaes_secundarios || []).map((s: any) => ({
            code: String(s.codigo || ''),
            text: s.descricao || '',
          })),
          qsa: (b.qsa || []).map((q: any) => ({
            nome: q.nome_socio || '',
            qual: q.qualificacao_socio || 'Sócio / Administrador',
            faixa_etaria: q.faixa_etaria,
          })),
          logradouro: b.logradouro || '',
          numero: b.numero || '',
          complemento: b.complemento || '',
          bairro: b.bairro || '',
          municipio: b.municipio || '',
          uf: b.uf || '',
          cep: b.cep || '',
          email: b.email || '',
          telefone: b.ddd_telefone_1 || '',
        })
      }
    } catch {
      // Falha na BrasilAPI, tenta ReceitaWS
    }

    // 2. Fallback: ReceitaWS
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(`https://receitaws.com.br/v1/cnpj/${cnpj}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      console.warn(`ReceitaWS error: ${res.status}`)
      return NextResponse.json({ error: 'Falha ao consultar CNPJ' }, { status: 502 })
    }
    const data = await res.json()
    return NextResponse.json({ _source: 'receitaws', ...data })
  } catch (err) {
    console.warn('CNPJ fetch failed:', (err as Error)?.message)
    return NextResponse.json({ error: 'Falha ao consultar CNPJ' }, { status: 502 })
  }
}
