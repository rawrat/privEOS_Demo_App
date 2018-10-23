# privEOS_Demo_App

Demonstrating a frontend connected to the priveos smart contract and node services to upload, list and download files based on transactions.

## Docker

For Docker usage, see: [DOCKER.md](DOCKER.md)

## Prerequisites

Ensure you have the following global bash utilities installed:

1. jq
1. webpack

The webpack production build does not work with node version > `8.9.0`!

## Priveos Client Library

The frontend requires the priveos client library. To link it, run:

```
# in privEOS/client folder:
npm link

# in privEOS_Demo_App/frontend folder:
npm link priveos
```

## Deploy to IPFS

Start an ipfs daemon. Then run:

```
bin/deploy-to-ipfs
```

## Configure LocalStorage

If you want to overwrite some settings, you can do this by setting the `localStorage.config` property. Check the [./frontend/src/config.js](./frontend/src/config.js) for options.