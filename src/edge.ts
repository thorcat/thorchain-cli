import * as yargs from 'yargs';
import * as boxen from 'boxen';
import { Network } from '@xchainjs/xchain-client';
import { Multichain } from './multichain';
import { AssetPool } from './types';
import chalk from 'chalk';
import 'dotenv/config';
import { useMidgard } from './midgard';
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
    'swap from asset to asset. To see a list of assets use `list` ',
    async (yargs) => {
      return yargs
        .option('from', { alias: 'f', describe: 'source asset', type: 'string', demandOption: true })
        .option('amount', { alias: 'a', describe: 'amount to swap', type: 'string', demandOption: true })
        .option('to', { alias: 't', describe: 'destination asset', type: 'string', demandOption: true })
        .help('help');
    },
    (argv) => {
      console.log(argv.amount);
      console.log(argv.from);
      console.log(argv.to);
    },
  )

  .demandCommand(1, 'You need at least one command before moving on').argv;

class Handlers {
  static swap = (amount: string, inputAsset: string, outputAsset: string) => {
    const multichain = new Multichain({ network: defaultNetwork, phrase: defaultPhrase });
    const outputAssetObj = assetFromString(outputAsset);
    const inputAssetObj = assetFromString(inputAsset);
    const affiliatePoints = 100; // 1%
    const address = multichain.getAddress(outputAssetObj.chain);
    const memo = buildSwapMemo(outputAssetObj, multichain.getAddress(outputAssetObj.chain), affiliatePoints);
    const inputAmount = getInputAmount(+amount);
    multichain.swap(inputAmount, address, memo, inputAssetObj);
  };
}
