#!/usr/bin/env node
import { Command } from 'commander'
import { initCommand } from '../commands/init.js'
import { generateCommand } from '../commands/generate.js'

const program = new Command()

program
  .name('vue-svg-icons')
  .description('Type-safe SVG icon system for Vue 3')
  .version('1.0.0')

program
  .command('init')
  .description('Initialize icon system in your project')
  .action(initCommand)

program
  .command('generate')
  .description('Generate TypeScript types from SVG icons')
  .option('-i, --icons-dir <path>', 'Icons directory', './src/assets/icons')
  .option('-o, --output-dir <path>', 'Output directory for types', './src/components/icon/generated')
  .action(generateCommand)

program.parse()
