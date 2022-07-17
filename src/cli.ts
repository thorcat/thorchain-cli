import * as yargs from 'yargs';
import * as boxen from 'boxen';
import { Network } from '@xchainjs/xchain-client';
import { Multichain } from './multichain';
import { AssetPool } from './types';
import chalk from 'chalk';
import 'dotenv/config';
import { useMidgard } from './midgard';
import { assetFromString } from '@xchainjs/xchain-util';
import { buildSwapMemo, getInputAmount } from './utils';
import { table, TableUserConfig } from 'table';

const greeting = chalk.rgb(0, 36, 100).bold(`EDGE Thorchain CLI`);
const title = boxen(greeting, { padding: 1, margin: 1, borderColor: 'green' });
const defaultNetwork = process.env.NETWORK as Network;
const defaultPhrase = process.env.SECRET_PHRASE;
const midgardUrl = () => {
  switch (defaultNetwork) {
    case Network.Mainnet:
      return process.env.MIDGARD_MAINNET;
    case Network.Stagenet:
      return process.env.MIDGARD_STAGENET;
    default:
      return process.env.MIDGARD_TESTNET;
  }
};
yargs
  .command('list', 'list all assets', {}, async (argv) => {
    console.info(title);
    const result = await useMidgard(midgardUrl());
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
      Handlers.swap(argv.amount, argv.from, argv.to);
    },
  )

  .demandCommand(1, 'You need at least one command before moving on').argv;

class Handlers {
  static swap = async (amount: string, inputAsset: string, outputAsset: string) => {
    const multichain = new Multichain({ network: defaultNetwork, phrase: defaultPhrase });
    await multichain.setupClients({ phrase: defaultPhrase });
    const outputAssetObj = assetFromString(outputAsset);
    const inputAssetObj = assetFromString(inputAsset);
    const affiliatePoints = 100; // 1%
    const affiliateLink = process.env.AFFILIATE;
    const address = multichain.getAddress(outputAssetObj.chain);
    const memo = buildSwapMemo(outputAssetObj, multichain.getAddress(outputAssetObj.chain), affiliateLink, affiliatePoints);
    const inputAmount = getInputAmount(+amount);
    const tx = await multichain.swap(inputAmount, address, memo, inputAssetObj);
    console.log(tx);
  };

  static balance = async (asset: string) => {
    const multichain = new Multichain({ network: defaultNetwork, phrase: defaultPhrase });
    await multichain.setupClients({ phrase: defaultPhrase });
    const balance = await multichain.getBalance(assetFromString(asset));
    const arr = [['asset', 'balance']];
    balance.forEach((bal) =>
      arr.push([
        bal.asset.symbol,
        bal.amount
          .amount()
          .dividedBy(10 ** bal.amount.decimal)
          .toString(),
      ]),
    );
    console.log(table(arr));
  };
}
