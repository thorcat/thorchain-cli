import { Asset, BaseAmount, baseAmount } from '@xchainjs/xchain-util';
import { AssetPool } from 'types';

export const getInputAmount = (amount: number): BaseAmount => {
  return baseAmount(amount);
};

// Build a memo
export const buildSwapMemo = (asset: Asset, address: string, affiliateAddress, points: number): string => {
  // affiliate address could be a thorname
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
  let a = 1;
  if (inputAsset === 'THOR.RUNE') {
    a = 1;
  } else {
    const inputPool = pools.find((asset) => asset.asset === inputAsset);
    a = inputPool.assetPrice;
  }
  let b = 1;
  if (outputAsset === 'THOR.RUNE') {
    b = 1;
  } else {
    const outputPool = pools.find((asset) => asset.asset === outputAsset);
    a = outputPool.assetPrice;
  }
  return a / b;
};
