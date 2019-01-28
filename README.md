# privEOS_Demo_App

Demonstrating a frontend connected to the priveos smart contract and node services to upload, list and download files based on transactions.

## Environments

You can switch between localhost and jungle2 (default). To connect to localhost, append url param: `?network=localhost` or set localStorage item:

```
localStorage.setItem('environment', 'localhost')
```

## Prerequisites

Ensure you have the following global bash utilities installed:

1. jq (for deployment to ipfs only, see `bin` folder)
1. webpack
1. yarn or npm

The webpack production build does not work with node version > `8.9.0`!

## Priveos Client Library

The frontend requires the [priveos client library](https://github.com/rawrat/priveos-client). To link it, run:

```
# in priveos-client folder:
npm link

# in privEOS_Demo_App/frontend folder:
npm link priveos
```

## Production Build

To create an optimized production build, run:

```
cd frontend
yarn build
```

## Local Development

To start the local development frontend, run:

```
cd frontend
yarn start
```

It will then start a local development server with live reload. The [default configuration](./frontend/src/config.js) does connect to `jungle2` testnet, so no full node required but you apparently you need to have ipfs running to up- and download files:

```
ipfs daemon
```

If you do not have ipfs installed, see this section:

### Install IPFS

```
brew install ipfs
ipfs init
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
brew services start ipfs
```

## Deploy to IPFS

Start an ipfs daemon. Then run:

```
bin/deploy-to-ipfs
```