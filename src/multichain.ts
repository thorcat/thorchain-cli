import { Client as ThorClient } from '@xchainjs/xchain-thorchain';
import { Client as EthClient, ETHAddress, getTokenAddress } from '@xchainjs/xchain-ethereum';
import { Client as BnbClient } from '@xchainjs/xchain-binance';
import { Client as BtcClient } from '@xchainjs/xchain-bitcoin';
import { Client as DogeClient } from '@xchainjs/xchain-doge';
import { Client as LtcClient } from '@xchainjs/xchain-litecoin';
import { Client as BchClient } from '@xchainjs/xchain-bitcoincash';
import { DepositParams, FeeOption, Network, TxHash, TxParams } from '@xchainjs/xchain-client';
import { Asset, AssetETH, Chain, ETHChain, THORChain } from '@xchainjs/xchain-util';
import { AssetAtom, getDefaultChainIds } from '@xchainjs/xchain-cosmos';
import { TCRopstenAbi } from 'thorchain-ropsten.abi';
import { getGasPrice } from 'gas';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

export class Multichain {
  thor: ThorClient;

  eth: EthClient;

  bnb: BnbClient;

  btc: BtcClient;

  doge: DogeClient;

  ltc: LtcClient;

  bch: BchClient;

  constructor({ network, phrase }: { network: Network; phrase: string }) {
    // create all clients
    const chainIds = getDefaultChainIds();
    this.thor = new ThorClient({ network, phrase, chainIds });
    this.eth = new EthClient({ network, phrase });
    this.bnb = new BnbClient({ network, phrase });
    this.btc = new BtcClient({ network, phrase });
    this.doge = new DogeClient({ network, phrase });
    this.ltc = new LtcClient({ network, phrase });
    this.bch = new BchClient({ network, phrase });
  }

  async swap(inputAmount, recipientAddress, memo, asset) {
    const chain = inputAmount.chain;
    if (chain === THORChain) {
      return this.thor.deposit({ walletIndex: 0, asset, amount: inputAmount, memo });
    }
    // call deposit contract for eth chain
    if (chain === ETHChain) {
      const params: DepositParams = {
        walletIndex: 0,
        asset: AssetETH,
        amount: inputAmount,
        memo,
      };
      return this.eth.deposit(params);
    }
    const params: TxParams = {
      walletIndex: 0,
      asset,
      amount: inputAmount,
      recipient: recipientAddress,
      memo,
    };
    return this.getChainClient(chain).transfer(params);
  }

  getChainClient = (chain: Chain) => {
    if (chain === Chain.THORChain) return this.thor;
    if (chain === Chain.Binance) return this.bnb;
    if (chain === Chain.Bitcoin) return this.btc;
    if (chain === Chain.Ethereum) return this.eth;
    if (chain === Chain.Litecoin) return this.ltc;
    if (chain === Chain.BitcoinCash) return this.bch;
    if (chain === Chain.Doge) return this.doge;
    return null;
  };

  depositEth = async (params): Promise<TxHash> => {
    const { assetAmount, recipient, memo, feeRate, feeOption = FeeOption.Fast, router } = params;

    const { asset } = assetAmount;

    // deposit base amount
    const amount = assetAmount.amount.baseAmount.integerValue(BigNumber.ROUND_DOWN).toFixed();

    const checkSummedAddress = this.getCheckSumAddress(asset);

    // get gas amount based on the fee option
    const gasPrice = await getGasPrice({
      client: this.eth,
      feeRate,
      feeOption,
      decimal: 0,
    });

    const contractParams = [
      recipient, // vault address
      checkSummedAddress, // asset checksum address
      amount, // deposit amount
      memo,
      asset.isETH()
        ? {
            from: this.eth.getAddress(),
            value: amount,
            gasPrice,
          }
        : { gasPrice },
    ];

    if (!router) {
      throw Error('invalid router');
    }

    try {
      const ethParams = {
        walletIndex: 0,
        contractAddress: router,
        abi: TCRopstenAbi,
        funcName: 'deposit',
        funcParams: contractParams,
      };
      const res: any = await this.eth.call(ethParams);

      return res?.hash ?? '';
    } catch (error: any) {
      if (error?.method === 'estimateGas') throw Error('Estimating gas failed. You may have not enough ETH.');
      else throw Error('You may have not enough ETH to submit the transaction');
    }
  };
  getCheckSumAddress = (asset: Asset): string => {
    if (asset.ticker === 'ETH') return ETHAddress;

    const assetAddress = getTokenAddress(asset);

    if (assetAddress) {
      return ethers.utils.getAddress(assetAddress.toLowerCase());
    }

    throw new Error('invalid eth asset address');
  };
}
