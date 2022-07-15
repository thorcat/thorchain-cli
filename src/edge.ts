import axios from 'axios';
import * as yargs from 'yargs';
import * as boxen from 'boxen';
import BigNumber from 'bignumber.js';
import { Network } from '@xchainjs/xchain-client';
import { BaseAmount, baseAmount, Asset, AssetBNB } from '@xchainjs/xchain-util';
import { Multichain } from 'multichain';
import { AssetPool } from './types';
import chalk from 'chalk';
// JS code that queries for a swap quote from the Thor network
// JS code that creates the data/OP_RETURN payload for the sending transaction
// A sample app that uses #1 and 2 to create quotes and and send transactions (this can use xchain.js)
// const options = yargs.usage('Usage: -i <tradeId>');
//.option('i', { alias: 'tradeId', describe: 'tradeId', type: 'numberd', demandOption: true }).argv;

// .option('s', { alias: 'file', describe: 'csv file containing addresses to load', type: 'string', demandOption: true })
// .option('l', {
//   alias: 'mongoConnectionString',
//   describe: 'example mongodb+srv://<username>:<password>@defispot.gb8nu.mongodb.net/mike-test?retryWrites=true&w=majority',
//   type: 'string',
//   demandOption: true,
// }).argv;
const greeting = chalk.rgb(0, 36, 100).bold(`EDGE Thorchain CLI`);

const title = boxen(greeting, { padding: 1, margin: 1, borderColor: 'green' });

const useMidgard = async (): Promise<AssetPool[]> => {
  try {
    const pools = await axios.get('https://thorfi.app/v2/pools');
    return (
      pools.data
        // get available pools
        .filter((assetPool) => assetPool.status === 'available')
        .map((assetPool) => ({
          asset: assetPool.asset,
          assetDepth: Number(assetPool.assetDepth),
          assetPrice: Number(assetPool.assetPrice),
          assetPriceUSD: Number(assetPool.assetPriceUSD),
        }))
    );
  } catch (e) {
    console.log(e);
    return [];
  }
};

const options = yargs
  .command('list', 'fetch the contents of the URL', {}, async (argv) => {
    console.info(title);
    const result = await useMidgard();
    result.forEach((asset) => {
      console.log(asset.asset.split('-')[0] + '   $' + asset.assetPriceUSD.toFixed(2));
    });
  })
  .usage('Usage: list')
  .option('ticker', { alias: 't', describe: 'wallet phrase', type: 'string', demandOption: false })
  .command('swap', 'swap from asset to asset', {}, async (argv) => {
    console.log(argv);
    const multichain = new Multichain({ network, phrase });
    console.log('success');
  })
  .option('from', { alias: 'f', describe: 'wallet phrase', type: 'string', demandOption: false })
  .option('to', { alias: 't', describe: 'wallet phrase', type: 'string', demandOption: false }).argv;
