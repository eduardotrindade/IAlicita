/**
 * Classe de erro customizada para falhas de API que podem ser retentadas.
 * Inclui o status HTTP para que a lógica de retry possa decidir o que fazer.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface RetryOptions {
  /** Número máximo de tentativas (alias: retries) */
  maxRetries?: number
  /** @deprecated Use maxRetries */
  retries?: number
  /** Delay base em ms (alias: initialDelay) */
  baseDelay?: number
  /** @deprecated Use baseDelay */
  initialDelay?: number
  /** AbortSignal para cancelar a execução */
  signal?: AbortSignal
  /**
   * Uma função para decidir se uma nova tentativa deve ser feita com base no erro.
   * Por padrão, tenta novamente em erros de rede ou erros de servidor (5xx).
   */
  shouldRetry?: (error: unknown) => boolean
}

const defaultShouldRetry = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    // Não tente novamente em erros do cliente (4xx), exceto 429 (Too Many Requests)
    if (error.status === 429) return true
    if (error.status >= 400 && error.status < 500) return false
  }
  // Tente novamente para erros de servidor (5xx) e erros de rede
  return true
}

export async function withRetry<T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries,
    retries,
    baseDelay,
    initialDelay,
    signal,
    shouldRetry = defaultShouldRetry,
  } = options

  const remaining = maxRetries ?? retries ?? 3
  const delayMs = baseDelay ?? initialDelay ?? 500

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError')
  }

  try {
    return await fn(signal)
  } catch (error) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError')
    }
    if (remaining > 0 && shouldRetry(error)) {
      await delay(delayMs)
      return withRetry(fn, {
        ...options,
        maxRetries: remaining - 1,
        retries: remaining - 1,
        baseDelay: delayMs * 2,
        initialDelay: delayMs * 2,
      })
    }
    throw error
  }
}
