import { Client as ThorClient, getChainIds, getDefaultClientUrl } from '@xchainjs/xchain-thorchain';
import { Client as EthClient, ETHAddress, getTokenAddress } from '@xchainjs/xchain-ethereum';
import { Client as BnbClient } from '@xchainjs/xchain-binance';
import { Client as BtcClient } from '@xchainjs/xchain-bitcoin';
import { Client as DogeClient } from '@xchainjs/xchain-doge';
import { Client as LtcClient } from '@xchainjs/xchain-litecoin';
import { Client as BchClient } from '@xchainjs/xchain-bitcoincash';
import { DepositParams, Network, TxParams } from '@xchainjs/xchain-client';
import { Asset, AssetETH, BaseAmount, Chain, ETHChain, THORChain } from '@xchainjs/xchain-util';

export class Multichain {
  thor: ThorClient;

  eth: EthClient;

  bnb: BnbClient;

  btc: BtcClient;

  doge: DogeClient;

  ltc: LtcClient;

  bch: BchClient;

  constructor({ network, phrase }: { network: Network; phrase: string }) {
    getChainIds(getDefaultClientUrl()).then((chainIds) => {
      console.log('chain ids', chainIds);
      this.thor = new ThorClient({ network, phrase, chainIds });
      this.eth = new EthClient({ network, phrase });
      this.bnb = new BnbClient({ network, phrase });
      this.btc = new BtcClient({ network, phrase });
      this.doge = new DogeClient({ network, phrase });
      this.ltc = new LtcClient({ network, phrase });
      this.bch = new BchClient({ network, phrase });
    });
  }

  async swap(inputAmount: BaseAmount, recipientAddress: string, memo: string, asset: Asset) {
    if (asset.chain === THORChain) {
      return this.thor.deposit({ walletIndex: 0, asset, amount: inputAmount, memo });
    }
    // call deposit contract for eth chain
    if (asset.chain === ETHChain) {
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
    return this.getChainClient(asset.chain).transfer(params);
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
}
