import { Asset, BaseAmount, baseAmount } from '@xchainjs/xchain-util';

export const getInputAmount = (amount: number): BaseAmount => {
  return baseAmount(amount);
};

// Build a memo
export const buildSwapMemo = (asset: Asset, address: string, points: number): string => {
  // affiliate address could be a thorname
  return `=:${asset.chain}.${getShortenedSymbol(asset)}:${address}::tthor19dyxgn653ed6y737zkhv2425ezfsw7f4yl9u4k:${points}`;
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
