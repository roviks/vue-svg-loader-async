import pc from 'picocolors'

export interface Logger {
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
  dim: (message: string) => void
}

export function createLogger(): Logger {
  return {
    success: (message: string) => console.log(pc.green(`✓ ${message}`)),
    error: (message: string) => console.error(pc.red(`✖ ${message}`)),
    warning: (message: string) => console.log(pc.yellow(`⚠ ${message}`)),
    info: (message: string) => console.log(pc.cyan(message)),
    dim: (message: string) => console.log(pc.dim(message))
  }
}

export const logger = createLogger()
