import { Network } from '@xchainjs/xchain-client';
import { Multichain } from './multichain';
import { AssetPool } from './types';
import 'dotenv/config';
import { useMidgard } from './midgard';
import { assetFromString } from '@xchainjs/xchain-util';
import { buildSwapMemo, findRate, getInputAmount } from './utils';
import { table, TableUserConfig } from 'table';
const defaultNetwork = process.env.NETWORK as Network;
const defaultPhrase = process.env.SECRET_PHRASE;
const BUSD_SYMBOL = defaultNetwork === Network.Testnet ? 'BNB.BUSD-74E' : 'BNB.BUSD-BD1';
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
export class Handlers {
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
  static list = async () => {
    const result = await useMidgard(midgardUrl() + '/v2/pools');
    const price = [['Asset', 'Price']];
    result.map((asset: AssetPool) => {
      if (asset.asset === BUSD_SYMBOL) {
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
  };

  static quote = async (amount: string, inputAsset: string, outputAsset: string) => {
    const pools = await useMidgard(midgardUrl() + '/v2/pools');
    const price = [['Send', 'Receive']];
    const rate = findRate(pools, inputAsset, outputAsset);
    const receiveAmount = rate * Number(amount);
    price.push([amount + inputAsset, receiveAmount + outputAsset]);
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
  };
}
