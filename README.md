# privEOS_Demo_App

Demonstrating a frontend connected to the priveos smart contract and node services to upload, list and download files based on transactions.

## Docker

For Docker usage, see: [DOCKER.md](DOCKER.md)

## Priveos Client Library

The frontend requires the priveos client library. To link it, run:

```
# in privEOS/client folder:
npm link

# in privEOS_Demo_App/frontend folder:
npm link priveos
```