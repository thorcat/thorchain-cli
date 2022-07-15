import axios from 'axios';
import * as yargs from 'yargs';
import * as boxen from 'boxen';
import BigNumber from 'bignumber.js';
import { Network } from '@xchainjs/xchain-client';
import { BaseAmount, baseAmount, Asset, AssetBNB } from '@xchainjs/xchain-util';
import { Multichain } from './multichain';
import { AssetPool } from './types';
import chalk from 'chalk';
import 'dotenv/config';
import { useMidgard } from 'api';

const greeting = chalk.rgb(0, 36, 100).bold(`EDGE Thorchain CLI`);

const title = boxen(greeting, { padding: 1, margin: 1, borderColor: 'green' });

const defaultNetwork = Network.Mainnet;
const defaultPhrase = process.env.SECRET_PHRASE;
const options = yargs
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
    const multichain = new Multichain({ network: defaultNetwork, phrase: defaultPhrase });
    console.log('success');
  })
  .option('from', { alias: 'f', describe: 'wallet phrase', type: 'string', demandOption: false })
  .option('to', { alias: 't', describe: 'wallet phrase', type: 'string', demandOption: false }).argv;
