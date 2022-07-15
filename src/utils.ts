import { Asset, BaseAmount, baseAmount } from '@xchainjs/xchain-util';

export const getInputAmount = (amount: number): BaseAmount => {
  return baseAmount(amount);
};

// Build a memo
export const buildSwapMemo = (asset: Asset, address: string, points: number): string => {
  return `=:${asset.chain}.${getShortenedSymbol(asset)}:${address}::keithslife:${points}`;
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
