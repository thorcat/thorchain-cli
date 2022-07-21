import { Asset, BaseAmount, baseAmount } from '@xchainjs/xchain-util';
import { AssetPool } from 'types';

export const getInputAmount = (amount: number): BaseAmount => {
  return baseAmount(amount);
};

// Build a memo
// JS code that creates the data/OP_RETURN payload for the sending transaction
export const buildSwapMemo = (asset: Asset, address: string, affiliateAddress, points: number): string => {
  // affiliate address could be a thorname, and the minimum received is not set in this example.
  return `=:${asset.chain}.${getShortenedSymbol(asset)}:${address}::${affiliateAddress}:${points}`;
};

export const getShortenedSymbol = (asset: Asset): string => {
  const { symbol, chain } = asset;
  let shortenedSymbol = symbol;
  // use shortened asset name for ERC20 tokens
  if (chain === 'ETH' && asset.ticker != 'ETH') {
    shortenedSymbol = `${asset.ticker}-${asset.symbol.slice(-3)}`;
  }
  return shortenedSymbol;
};

// return the correct inbound address
export const getRecipient = (): string => {
  return '';
};

export const compareAsset = (a: Asset, b: Asset): boolean => {
  return a.chain === b.chain && a.symbol === b.symbol;
};

export const findRate = (pools: AssetPool[], inputAsset: string, outputAsset: string) => {
  let a,
    b = 1;
  if (inputAsset !== 'THOR.RUNE') {
    const inputPool = pools.find((asset) => asset.asset === inputAsset);
    a = inputPool.assetPrice;
  }
  if (outputAsset !== 'THOR.RUNE') {
    const outputPool = pools.find((asset) => asset.asset === outputAsset);
    b = outputPool.assetPrice;
  }
  return a / b;
};
