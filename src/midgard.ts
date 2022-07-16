import axios from 'axios';
import { AssetPool } from './types';

export const useMidgard = async (): Promise<AssetPool[]> => {
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
