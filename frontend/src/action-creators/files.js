import {
    LOAD_FILES, 
    LOAD_FILES_SUCCESS, 
    LOAD_FILES_ERROR, 
    PURCHASE_START, 
    PURCHASE_SUCCESS, 
    DOWNLOAD_START,
    UPLOAD_IPFS_START,
    UPLOAD_EOS_START,
    UPLOAD_SUCCESS,
    DECRYPTION_ERROR,
    DOWNLOAD_SUCCESS
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
            type: PURCHASE_START,
            id: file.id,
            data: {
                alert: {
                    name: "Started purchase process",
                    message: "Please confirm the scatter transaction...",
                    type: "primary",
                    loading: true
                }
            }
        })
        return getState().auth.eos.purchase(getState().auth.account.name, file)
            .then((res) => {
                dispatch(loadFiles())
                dispatch({
                    type: PURCHASE_SUCCESS,
                    id: file.id,
                    data: {
                        alert: null
                    }
                })
            })
            .catch(err => {
            if (typeof(err) == "string") {
                try {
                    err = JSON.parse(err)
                } catch(e) {}
            }
            dispatch(showAlert({
                name: err.error && err.error.name || 'Purchase error',
                message: err.message
            }))
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
                    name: "Please confirm your download",
                    message: "Please confirm the scatter transaction to start the download...",
                    type: "primary",
                    loading: true
                }
            }
        })

        // throw new Error('test')

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
            console.log('error', err)
            if (typeof(err) == "string") {
                try {
                    err = JSON.parse(err)
                } catch(e) {}
            }
            dispatch(showAlert({
                name: err.error && err.error.name || 'Download error',
                message: err.message
            }))
            return []
        })

        if (!files) return console.error('File not available...')

        dispatch({
            type: DOWNLOAD_START,
            data: {
                alert: {
                    name: "Download in progress...",
                    message: "Downloading file from IPFS, getting the key shares and decrypting it...",
                    type: "primary",
                    loading: true
                }
            }
        })

        state = getState()
        console.log("Transaction completed: ", accessGrantRes, files)

        try {
            const [nonce, key] = await priveos.read(state.auth.account.name, file.uuid)
            console.log(`Received key "${Priveos.uint8array_to_hex(key)} and nonce "${Priveos.uint8array_to_hex(nonce)}"`)
            files.map((x) => {
                const cleartext = decrypt(x.content, nonce, key)
                createFile(cleartext, file.name)
                dispatch({
                    type: DOWNLOAD_SUCCESS,
                    data: {
                        alert: null
                    }
                })
            }) 
        } catch(err) {
            dispatch({
                type: DECRYPTION_ERROR,
                data: {
                    alert: {
                        name: "Decryption Error",
                        message: "We were not able to decrypt the file, the error is: " + err.message,
                        type: 'danger'
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
        dispatch({
            type: UPLOAD_IPFS_START,
            data: {
                alert: {
                    name: "Uploading file to IPFS...",
                    type: "primary",
                    loading: true
                }
            }
        })
        const state = getState()
        console.log('file', file)
        return read(file).then((content) => {
            const cipher = encrypt(content, nonce_bytes, secret_bytes)
            console.log('cipher', cipher)
            ipfs.upload(cipher).then((ipfsFile) => {
                console.log('resolved', ipfsFile)
                dispatch({
                    type: UPLOAD_EOS_START,
                    data: {
                        alert: {
                            name: "Please confirm scatter transaction to finish upload",
                            type: "primary",
                            loading: true
                        }
                    }
                })
                state.auth.eos.upload(state.auth.account.name, uuid, name, description, ipfs.getUrl(ipfsFile.hash), price, secret_bytes, nonce_bytes).then(() => {
                    console.log('Successfully create upload transaction')
                    dispatch({
                        type: UPLOAD_SUCCESS,
                        data: {
                            alert: null
                        }
                    })
                    history.push('/files/' + uuid);
                }).catch(err => {
                    dispatch(showAlert({
                        name: 'EOS Upload Transaction failed',
                        message: err.message
                    }))
                    throw err
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
