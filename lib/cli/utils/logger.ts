import pc from 'picocolors'

export const logger = {
  success: (message: string) => console.log(pc.green(`✓ ${message}`)),
  error: (message: string) => console.error(pc.red(`✖ ${message}`)),
  warning: (message: string) => console.log(pc.yellow(`⚠ ${message}`)),
  info: (message: string) => console.log(pc.cyan(message)),
  dim: (message: string) => console.log(pc.dim(message))
}
