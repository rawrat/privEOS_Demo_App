# privEOS_Demo_App

Demonstrating a frontend connected to the priveos smart contract and node services to upload, list and download files based on transactions.

## Docker

For Docker usage, see: [DOCKER.md](DOCKER.md)

## Priveos Client Library

The frontend requires the priveos client library. To get the latest version, I added this to my `~/.bash_profile`:

```
function updatePriveosClientDemoApp() {
  cd <PATH_TO>/privEOS/client
  npm run build
  cp -r ./dist/* <PATH_TO>/privEOS_Demo_App/frontend/src/lib/priveos/
  cd -
}
```