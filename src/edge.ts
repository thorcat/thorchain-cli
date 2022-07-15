import * as yargs from 'yargs';
import * as boxen from 'boxen';
import { Network } from '@xchainjs/xchain-client';
import { Multichain } from './multichain';
import { AssetPool } from './types';
import chalk from 'chalk';
import 'dotenv/config';
import { useMidgard } from './api';
import { assetFromString, BaseAmount, baseAmount } from '@xchainjs/xchain-util';
import { getRecipient, buildSwapMemo, getInputAmount } from './utils';

const greeting = chalk.rgb(0, 36, 100).bold(`EDGE Thorchain CLI`);

const title = boxen(greeting, { padding: 1, margin: 1, borderColor: 'green' });

const defaultNetwork = Network.Testnet;
const defaultPhrase = process.env.SECRET_PHRASE;

yargs
  .command('list', 'fetch the contents of the URL', {}, async (argv) => {
    console.info(title);
    const result = await useMidgard();
    result.forEach((asset: AssetPool) => {
      console.log(asset.asset.split('-')[0] + '   $' + asset.assetPriceUSD.toFixed(2));
    });
  })
  .usage('Usage: list')
  .option('ticker', { alias: 't', describe: 'wallet phrase', type: 'string', demandOption: false })
  .command('swap', 'swap from asset to asset', {}, async (argv) => {
    console.log(argv.from);
    console.log('phrase', defaultPhrase);
    const inputAsset = '';
    const multichain = new Multichain({ network: defaultNetwork, phrase: defaultPhrase });
    // buildSwapMemo()
    // multichain.swap(getInputAmount(123), getRecipient(), buildMemo(), assetFromString(inputAsset));
  })
  .option('from', { alias: 'f', describe: 'wallet phrase', type: 'string', demandOption: false })
  .option('to', { alias: 't', describe: 'wallet phrase', type: 'string', demandOption: false }).argv;
