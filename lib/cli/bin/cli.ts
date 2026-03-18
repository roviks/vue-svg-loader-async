#!/usr/bin/env node
import { createRequire } from 'node:module'
import { Command } from 'commander'
import { createInitCommand } from '../commands/init.js'
import { createGenerateCommand } from '../commands/generate.js'

const require = createRequire(import.meta.url)
const { version } = require('../../../package.json') as { version: string }

export function createCli(): Command {
  const program = new Command()

  program
    .name('vue-svg-icons')
    .description('Type-safe SVG icon system for Vue 3')
    .version(version)

  program
    .command('init')
    .description('Initialize icon system in your project')
    .action(createInitCommand())

  program
    .command('generate')
    .description('Generate TypeScript types from SVG icons')
    .option('-i, --icons-dir <path>', 'Icons directory', './src/assets/icons')
    .option('-o, --output-dir <path>', 'Output directory for types', './src/components/icon/generated')
    .action(createGenerateCommand())

  return program
}

createCli().parse()
