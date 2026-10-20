import { type NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `Você é um assistente especializado em licitações públicas brasileiras.
Responda em português brasileiro de forma clara e objetiva.
Base suas respostas na Lei 14.133/2021 (Nova Lei de Licitações), Lei 14.137/2021, regulamentos do TCU e boas práticas de contratações públicas.
Quando não souber a resposta, diga honestamente que não tem informação suficiente.
Cite artigos e fontes quando possível.`

async function callOpenAiCompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
) {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`AI API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return {
    content: data.choices?.[0]?.message?.content || 'Sem resposta do modelo.',
    provider: 'siliconflow',
    model,
  }
}

async function callHuggingFace(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
) {
  const prompt = messages
    .map((m) =>
      m.role === 'system'
        ? `<s>[INST] ${m.content}\n\n`
        : m.role === 'user'
          ? `[INST] ${m.content} [/INST]\n`
          : `${m.content}\n`,
    )
    .join('')

  const res = await fetch(`${baseUrl}${model}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        return_full_text: false,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HuggingFace API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const content = Array.isArray(data)
    ? data[0]?.generated_text
    : data.generated_text || 'Sem resposta do modelo.'
  return { content, provider: 'huggingface', model }
}
function generateMockResponse(messages: ChatMessage[]): string {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || ''
  const lower = lastUserMsg.toLowerCase()

  if (lower.includes('dod') || lower.includes('documento de oficialização')) {
    return `# DOCUMENTO DE OFICIALIZAÇÃO DA DEMANDA (DOD)\n\n**1. IDENTIFICAÇÃO DO ÓRGÃO:** Órgão Solicitante\n**2. DESCRIÇÃO DA NECESSIDADE:** ${lastUserMsg.slice(0, 120)}...\n**3. ALINHAMENTO ESTRATÉGICO:** Vinculado ao Plano de Contratações Anual (PCA) em conformidade com o art. 12, VII da Lei 14.133/2021.\n**4. ESTIMATIVA PRELIMINAR:** A ser detalhada no Estudo Técnico Preliminar (ETP).\n**5. EQUIPE DE PLANEJAMENTO:** Integrante Demandante, Técnico e Administrativo designados.\n\n*Documento gerado automaticamente pelo IAlicita com base na Lei 14.133/2021.*`
  }

  if (lower.includes('etp') || lower.includes('estudo técnico preliminar')) {
    return `# ESTUDO TÉCNICO PRELIMINAR (ETP)\n\n**1. DESCRIÇÃO DA NECESSIDADE:** Atendimento à demanda pública com eficiência e economicidade (Art. 18 da Lei 14.133/2021).\n**2. DEMONSTRAÇÃO DA PREVISÃO NO PCA:** Item alinhado às diretrizes anuais.\n**3. REQUISITOS DA CONTRATAÇÃO:** Especificações técnicas compatíveis com os padrões de mercado.\n**4. ESTIMATIVA DE QUANTIDADES E VALORES:** Levantamento com base em pesquisa ampla de preços (Painel de Preços e contratações similares).\n**5. JUSTIFICATIVA PARA O PARCELAMENTO:** Avaliação técnica da viabilidade de divisão do objeto.\n**6. RESULTADOS PRETENDIDOS:** Otimização dos recursos públicos e atendimento contínuo do interesse coletivo.\n**7. ANÁLISE DE RISCOS:** Matriz de riscos elaborada para mitigação durante a execução contratual.\n\n*ETP estruturado segundo os 14 incisos do art. 18 da Lei 14.133/2021.*`
  }

  if (lower.includes('tr') || lower.includes('termo de referência')) {
    return `# TERMO DE REFERÊNCIA (TR)\n\n**1. DEFINIÇÃO DO OBJETO:** Aquisição/Prestação de serviços descritos com clareza e precisão.\n**2. FUNDAMENTAÇÃO LEGAL:** Art. 6º, XXIII da Lei nº 14.133/2021.\n**3. ESPECIFICAÇÃO TÉCNICA E QUANTITATIVOS:** Requisitos de qualidade, rendimento e sustentabilidade.\n**4. OBRIGAÇÕES DA CONTRATADA E CONTRATANTE:** Prazos de entrega, níveis de serviço e fiscalização contratual.\n**5. CRITÉRIOS DE MEDIÇÃO E PAGAMENTO:** Liquidação mediante ateste formal em até 30 dias.\n**6. ESTIMATIVA DE VALOR:** Preço de referência balizado conforme art. 23 da Lei 14.133/2021.\n**7. ADEQUAÇÃO ORÇAMENTÁRIA:** Dotação orçamentária compatível com a LDO e LOA.\n\n*TR elaborado em conformidade com as diretrizes da Nova Lei de Licitações.*`
  }

  if (lower.includes('classifique') || lower.includes('complexidade')) {
    return `Tecnologia da Informação | Média | 18% | Edital com requisitos técnicos padronizados e ampla concorrência no mercado.`
  }

  if (lower.includes('atestado') || lower.includes('capacidade técnica')) {
    return `### ANÁLISE DE CAPACIDADE TÉCNICO-OPERACIONAL\n\n- **Aderência ao Edital:** 95% de compatibilidade.\n- **Parcelas de Maior Relevância:** Quantitativos comprovados atendem aos limites do art. 67 da Lei 14.133/2021 (máximo 50% de exigência prévia).\n- **Recomendação:** Atestado plenamente apto para habilitação técnica.`
  }

  if (
    lower.includes('especificação') ||
    lower.includes('restritiva') ||
    lower.includes('direcionamento')
  ) {
    return `### RELATÓRIO DE ANÁLISE DE ESPECIFICAÇÕES\n\n- **Indícios de Restrição:** Não foram detectadas marcas exclusivas sem justificativa técnica prévia (Art. 41 da Lei 14.133/21).\n- **Padrão de Mercado:** Exigências compatíveis com o mercado fornecedor.\n- **Risco de Impugnação:** BAIXO.`
  }

  return `Com base na **Lei nº 14.133/2021 (Nova Lei de Licitações e Contratos)** e na jurisprudência consolidada do TCU:\n\n1. As contratações públicas devem observar os princípios da impessoalidade, moralidade, publicidade, eficiência, do interesse público, da probidade administrativa e do desenvolvimento nacional sustentável (Art. 5º).\n2. Para a demanda apresentada, recomenda-se verificar o alinhamento com o Plano de Contratações Anual (PCA) e a elaboração prévia do ETP.\n3. Em caso de dúvidas específicas sobre prazos recursais ou impugnações, o prazo padrão é de 3 (três) dias úteis antes da data de abertura da sessão pública (Art. 164).\n\nPosso detalhar algum artigo específico ou auxiliar na elaboração de minutas e recursos?`
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as {
      messages: ChatMessage[]
    }
    const provider = process.env.AI_PROVIDER || 'siliconflow'

    const withSystem: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]

    let result: { content: string; provider: string; model: string }

    switch (provider) {
      case 'siliconflow': {
        const url = process.env.AI_SILICONFLOW_URL || 'https://api.siliconflow.cn/v1'
        const key = process.env.AI_SILICONFLOW_KEY || ''
        const model = process.env.AI_SILICONFLOW_MODEL || 'Qwen/Qwen2.5-72B-Instruct'
        if (!key) {
          result = {
            content: generateMockResponse(messages),
            provider: 'siliconflow',
            model: `${model} (fallback local)`,
          }
        } else {
          try {
            result = await callOpenAiCompatible(url, key, model, withSystem)
          } catch {
            result = {
              content: generateMockResponse(messages),
              provider: 'siliconflow',
              model: `${model} (fallback)`,
            }
          }
        }
        break
      }
      case 'aimlap': {
        const url = process.env.AI_AIML_URL || 'https://api.aimlapi.com/v1'
        const key = process.env.AI_AIML_KEY || ''
        const model = process.env.AI_AIML_MODEL || 'openai/gpt-4o-mini'
        if (!key) {
          result = {
            content: generateMockResponse(messages),
            provider: 'aimlap',
            model: `${model} (fallback local)`,
          }
        } else {
          try {
            result = await callOpenAiCompatible(url, key, model, withSystem)
          } catch {
            result = {
              content: generateMockResponse(messages),
              provider: 'aimlap',
              model: `${model} (fallback)`,
            }
          }
        }
        break
      }
      case 'huggingface': {
        const url = process.env.AI_HF_URL || 'https://api-inference.huggingface.co/models/'
        const key = process.env.AI_HF_KEY || ''
        const model = process.env.AI_HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3'
        if (!key) {
          result = {
            content: generateMockResponse(messages),
            provider: 'huggingface',
            model: `${model} (fallback local)`,
          }
        } else {
          try {
            result = await callHuggingFace(url, key, model, withSystem)
          } catch {
            result = {
              content: generateMockResponse(messages),
              provider: 'huggingface',
              model: `${model} (fallback)`,
            }
          }
        }
        break
      }
      default:
        result = {
          content: generateMockResponse(messages),
          provider: 'siliconflow',
          model: 'fallback',
        }
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 },
    )
  }
}
