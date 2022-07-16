# defispot Cli

## Build project

```bash
yarn install
yarn run build
```

## Generate Affiliate Addresses

1. run the following command to append new addresses to a file
   ```bash
       node dist/edge.js -p "seed phrase in here" -s 10002 -e 20000 >> affiliates.csv
   ```

## Load Affiliate Addresses

1. once you havea file of addreses to load, use the following function to load them to the DB
   ```bash
       node dist/loadAddresses.js -f "./affiliates.csv" -c "mongodb+srv://xxx:xxxx@host.mongodb.net/dnamet?retryWrites=true&w=majority"
   ```

## Payout script

1.  ```bash
        node dist/payout.js -p "seed phrase in here" -c "mongodb+srv://xxx:xxxx@host.mongodb.net/dnamet?retryWrites=true&w=majority"
    ```
