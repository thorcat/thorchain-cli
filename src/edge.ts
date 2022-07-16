import * as yargs from 'yargs';
import * as boxen from 'boxen';
import { Network } from '@xchainjs/xchain-client';
import { Multichain } from './multichain';
import { AssetPool } from './types';
import chalk from 'chalk';
import 'dotenv/config';
import { useMidgard } from './api';
import { assetFromString, BaseAmount, baseAmount } from '@xchainjs/xchain-util';
import { getRecipient, buildSwapMemo, getInputAmount, compareAsset } from './utils';
import { table, TableUserConfig } from 'table';

const greeting = chalk.rgb(0, 36, 100).bold(`EDGE Thorchain CLI`);

const title = boxen(greeting, { padding: 1, margin: 1, borderColor: 'green' });

const defaultNetwork = Network.Testnet;
const defaultPhrase = process.env.SECRET_PHRASE;

yargs
  .command('list', 'list all assets', {}, async (argv) => {
    console.info(title);
    const result = await useMidgard();
    const price = [['Asset', 'Price']];
    result.map((asset: AssetPool) => {
      if (asset.asset === 'BNB.BUSD-BD1') {
        // get thor price from BUSD (no pool for TC)
        price.push(['THOR.RUNE', '$' + (1.0 / Number(asset.assetPrice)).toFixed(2)]);
      }
      price.push([asset.asset.split('-')[0], '$' + asset.assetPriceUSD.toFixed(2)]);
    });
    const config: TableUserConfig = {
      columnDefault: {
        width: 10,
      },
      header: {
        alignment: 'center',
        content: 'Thorchain Pools',
      },
    };

    console.log(table(price, config));
  })
  .usage('Usage: list')
  .command(
    'swap',
    'swap from asset to asset',
    async (yargs) => {
      yargs
        .option('from', { alias: 'f', describe: 'wallet phrase', type: 'string', demandOption: false })
        .option('to', { alias: 't', describe: 'wallet phrase', type: 'string', demandOption: false });
      console.log('phrase', defaultPhrase);

      // buildSwapMemo()
      // multichain.swap(getInputAmount(123), getRecipient(), buildMemo(), assetFromString(inputAsset));
    },
    (argv) => {
      console.log('do stuff');
      const inputAsset = '';
      const multichain = new Multichain({ network: defaultNetwork, phrase: defaultPhrase });
    },
  )

  .command('publish', 'shiver me timbers, should you be sharing all that', (yargs) =>
    yargs
      .option('f', {
        alias: 'force',
        description: 'yar, it usually be a bad idea',
        demandOption: true,
      })
      .help('help'),
  )
  .demandCommand(1, 'You need at least one command before moving on').argv;
