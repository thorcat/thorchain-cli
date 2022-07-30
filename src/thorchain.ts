import * as yargs from 'yargs';
import * as boxen from 'boxen';
import chalk from 'chalk';
import 'dotenv/config';
import { Handlers } from './handlers';

const greeting = chalk.rgb(0, 36, 100).bold(`EDGE Thorchain CLI`);
const title = boxen(greeting, { padding: 1, margin: 1, borderColor: 'green' });

yargs
  .command('list', 'list all assets', {}, async (argv) => {
    console.info(title);
    Handlers.list();
  })

  .usage('Usage: list')
  .command(
    'swap',
    'swap from asset to asset. To see a list of assets use `list` ',
    async (yargs) => {
      return yargs
        .option('from', { alias: 'f', describe: 'source asset', type: 'string', demandOption: true })
        .option('amount', { alias: 'a', describe: 'amount to swap', type: 'string', demandOption: true })
        .option('to', { alias: 't', describe: 'destination asset', type: 'string', demandOption: true })
        .help('help');
    },
    (argv) => {
      console.info(title);
      Handlers.swap(argv.amount, argv.from, argv.to);
    },
  )
  .command(
    'balance',
    'retrieves balances for your connected wallet `list` ',
    async (yargs) => {
      return yargs.option('asset', { alias: 'a', describe: 'source asset', type: 'string', demandOption: true }).help('help');
    },
    (argv) => {
      console.info(title);
      Handlers.balance(argv.asset);
    },
  )
  .command(
    'quote',
    'quote for a swap from asset to asset. To see a list of assets use `list` ',
    async (yargs) => {
      return yargs
        .option('from', { alias: 'f', describe: 'source asset', type: 'string', demandOption: true })
        .option('amount', { alias: 'a', describe: 'amount to swap', type: 'string', demandOption: true })
        .option('to', { alias: 't', describe: 'destination asset', type: 'string', demandOption: true })
        .help('help');
    },
    (argv) => {
      console.info(title);
      Handlers.quote(argv.amount, argv.from, argv.to);
    },
  )

  .demandCommand(1, 'You need at least one command before moving on').argv;
