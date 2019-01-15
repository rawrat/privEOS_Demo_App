import {
    LOAD_FILES, 
    LOAD_FILES_SUCCESS, 
    LOAD_FILES_ERROR, 
    PURCHASE, 
    PURCHASE_SUCCESS, 
    DOWNLOAD_START, 
    DECRYPTION_START,
    DECRYPTION_SUCESS,
    DECRYPTION_ERROR
} from '../lib/action-types'
import ipfs from '../lib/ipfs'
import { getPriveos } from '../lib/eos'
import { encrypt, decrypt } from '../lib/crypto'
import { createFile, read } from '../lib/file'
import { history } from '../store';
import Promise from 'bluebird'
import Priveos from 'priveos'
import { showAlert } from './common'


export function loadFiles() {
    return (dispatch, getState) => {
        const state = getState()
        dispatch({
            type: LOAD_FILES
        })
        return state.auth.eos.getFiles(state.auth.account.name)
        .then((res) => {
            dispatch({
                type: LOAD_FILES_SUCCESS,
                data: {
                    items: res
                }
            })
        })
        .catch((err) => {
            dispatch(showAlert({
                name: 'Loading files failed',
                message: `It seems that the eos node is not available (${err.message})`
            }))
        })
    }
}


export function loadFilesSuccess() {
    return {
        type: LOAD_FILES_SUCCESS
    }
}

export function loadFilesError() {
    return {
        type: LOAD_FILES_ERROR
    }
}

export function purchase(file) {
    return (dispatch, getState) => {
        dispatch({
            type: PURCHASE,
            id: file.id
        })
        return getState().auth.eos.purchase(getState().auth.account.name, file)
        .then((res) => {
            dispatch(loadFiles())
            dispatch({
                type: PURCHASE_SUCCESS,
                id: file.id
            })
        })
    }
}


export function download(file) {
    return async (dispatch, getState) => {
        let state = getState()
        dispatch({
            type: DOWNLOAD_START,
            data: {
                alert: {
                    name: "Downloading file...",
                    message: "Please confirm the scatter transaction",
                    type: "primary"
                }
            }
        })

        const hash = ipfs.extractHashFromUrl(file.url)
        if (!hash) {
            return dispatch(showAlert({
                name: 'IPFS Error',
                message: 'The url is not a valid ipfs url: ' + file.url
            }))
        }
        const priveos = getPriveos()

        const [files, accessGrantRes] = await Promise.all([
          ipfs.download(hash),
          state.auth.eos.accessgrant(state.auth.account.name, file)
        ]).catch(err => {
            dispatch(showAlert({
                name: 'Download error',
                message: err.message
            }))
            return []
        })

        if (!file || !accessGrantRes) return

        dispatch({
            type: DECRYPTION_START,
            data: {
                alert: {
                    name: "Decryption in progress...",
                    message: "Collecting the key shares and decrypting the file...",
                    type: "primary"
                }
            }
        })

        state = getState()
        console.log("Transaction completed: ", accessGrantRes, files)
        console.log("Giving the transaction some time to propagate…")
        
        // the following line can be removed once all nodes have upgraded
        await Promise.delay(5000)
        
        console.log("…done waiting.")
        try {
            const [nonce, key] = await priveos.read(state.auth.account.name, file.uuid)
            console.log(`Received key "${Priveos.uint8array_to_hex(key)} and nonce "${Priveos.uint8array_to_hex(nonce)}"`)
            files.map((x) => {
                const cleartext = decrypt(x.content, nonce, key)
                // console.log('decrypted cleartext', cleartext)
                createFile(cleartext, file.name)
            }) 

            dispatch({
                type: DECRYPTION_SUCESS,
                data: {
                    alert: {
                        name: "Downloading file...",
                        message: "Your download will begin soon...",
                        type: "primary"
                    }
                }
            })
        } catch(err) {
            dispatch({
                type: DECRYPTION_ERROR,
                data: {
                    alert: {
                        name: "Decryption Error",
                        message: "We were not able to decrypt the file, the error is: " + err.message,
                    }
                }
            })
        }
    }
}

export function upload(uuid, name, description, price, file, secret_bytes, nonce_bytes) {
    console.log('upload action', {
        uuid,
        name,
        description,
        price,
        file,
        secret_bytes,
        nonce_bytes
    })
    return (dispatch, getState) => {
        const state = getState()
        console.log('file', file)
        return read(file).then((content) => {
            const cipher = encrypt(content, nonce_bytes, secret_bytes)
            console.log('cipher', cipher)
            ipfs.upload(cipher).then((ipfsFile) => {
                console.log('resolved', ipfsFile)
                state.auth.eos.upload(state.auth.account.name, uuid, name, description, ipfs.getUrl(ipfsFile.hash), price, secret_bytes, nonce_bytes).then(() => {
                    console.log('Successfully create upload transaction')
                    history.push('/files/' + uuid);
                })
            }).catch(err => {
                dispatch(showAlert({
                    name: 'Upload error',
                    message: err.message
                }))
            })
        })
        .catch((err) => {
        console.error(err)
        })
    }
}
