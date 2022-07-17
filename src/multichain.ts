import { Client as ThorClient, getChainIds, getDefaultClientUrl } from '@xchainjs/xchain-thorchain';
import { Client as EthClient, ETHAddress, getTokenAddress } from '@xchainjs/xchain-ethereum';
import { Client as BnbClient } from '@xchainjs/xchain-binance';
import { Client as BtcClient } from '@xchainjs/xchain-bitcoin';
import { Client as DogeClient } from '@xchainjs/xchain-doge';
import { Client as LtcClient } from '@xchainjs/xchain-litecoin';
import { Client as BchClient } from '@xchainjs/xchain-bitcoincash';
import { BaseXChainClient, DepositParams, Network, TxParams } from '@xchainjs/xchain-client';
import { Asset, AssetETH, BaseAmount, Chain, ETHChain, THORChain } from '@xchainjs/xchain-util';

export class Multichain {
  network: Network;

  thor: ThorClient;

  eth: EthClient;

  bnb: BnbClient;

  btc: BtcClient;

  doge: DogeClient;

  ltc: LtcClient;

  bch: BchClient;

  // TODO: clients: BaseXChainClient[]
  constructor({ network, phrase }: { network: Network; phrase: string }) {
    this.network = network;
  }

  async setupClients({ phrase }: { phrase: string }) {
    const chainIds = await getChainIds(getDefaultClientUrl());
    this.thor = new ThorClient({ network: this.network, phrase, chainIds });
    this.eth = new EthClient({ network: this.network, phrase });
    this.bnb = new BnbClient({ network: this.network, phrase });
    this.btc = new BtcClient({ network: this.network, phrase });
    this.doge = new DogeClient({ network: this.network, phrase });
    this.ltc = new LtcClient({ network: this.network, phrase });
    this.bch = new BchClient({ network: this.network, phrase });
  }

  async swap(inputAmount: BaseAmount, recipientAddress: string, memo: string, asset: Asset, index?: number) {
    if (asset.chain === THORChain) {
      return this.thor.deposit({ walletIndex: index, asset, amount: inputAmount, memo });
    }
    // call deposit contract for eth chain
    if (asset.chain === ETHChain) {
      const params: DepositParams = {
        walletIndex: index,
        asset: AssetETH,
        amount: inputAmount,
        memo,
      };
      return this.eth.deposit(params);
    }
    const params: TxParams = {
      walletIndex: index,
      asset,
      amount: inputAmount,
      recipient: recipientAddress,
      memo,
    };
    return await this.getChainClient(asset.chain).transfer(params);
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

  getAddress = (chain: Chain, index?: number) => {
    if (index) {
      return this.getChainClient(chain).getAddress(index);
    }
    return this.getChainClient(chain).getAddress();
  };

  getBalance = (asset: Asset, index?: number) => {
    if (index) {
      return this.getChainClient(asset.chain).getBalance(this.getAddress(asset.chain, index));
    }
    return this.getChainClient(asset.chain).getBalance(this.getAddress(asset.chain));
  };
}
