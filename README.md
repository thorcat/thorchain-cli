# Edge Thorchain Cli

#### Note: this project is currently just an example and not recommended for use with real funds.

## Build project

1. setup `.env` file first with your seed phrase (see the `env.sample`)

```bash
yarn install
yarn run build
```

## List Assets and Prices (no build required)

run the following command to list all assets and prices in USD.

1.  ```bash
        ts-node src/thorchain list
    ```

## Get balance of address

1. run the following command to retrieve the balance of your connected wallet.
   ```bash
       ts-node src/thorchain balance -a THOR.RUNE
   ```

## Swap assets

1. once you know the assets you wish to swap you can run swap as shown below.
   `-f` is the input asset.
   `-t` is the destination asset
   `-a` is the amount the input asset you wish to convert.
   ```bash
       ts-node src/thorchain swap -f THOR.RUNE -t BNB.BNB -a 100
   ```
