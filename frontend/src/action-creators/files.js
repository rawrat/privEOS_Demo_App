import {
    LOAD_FILES, 
    LOAD_FILES_SUCCESS, 
    LOAD_FILES_ERROR,
    LOAD_PURCHASES_SUCCESS,
    PURCHASE_START, 
    PURCHASE_FINISH, 
    DOWNLOAD_START,
    UPLOAD_IPFS_START,
    UPLOAD_EOS_START,
    UPLOAD_SUCCESS,
    DECRYPTION_ERROR,
    DOWNLOAD_FINISH
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
        return state.root.eos.getFiles()
        .then((res) => {
            dispatch({
                type: LOAD_FILES_SUCCESS,
                data: {
                    items: res
                }
            })
            dispatch(loadPurchases())
        })
        .catch((err) => {
            dispatch(showAlert({
                name: 'Loading files failed',
                message: `It seems that the eos node is not available (${err.message})`
            }))
        })
    }
}

export function loadPurchases() {
    return (dispatch, getState) => {
        const state = getState()
        return state.root.eos.getPurchases(state.auth.account && state.auth.account.name || null)
        .then((res) => {
            dispatch({
                type: LOAD_PURCHASES_SUCCESS,
                data: {
                    purchases: res
                }
            })
            dispatch(mergeFilesAndPurchases())
        })
        .catch((err) => {
            dispatch(showAlert({
                name: 'Loading purchased files failed',
                message: `It seems that the eos node is not available (${err.message})`
            }))
        })
    }
}

// extend loaded files with the information provided by purchased files
export function mergeFilesAndPurchases() {
    return (dispatch, getState) => {
        const state = getState()
        console.log('purchases', state.files.purchases)
        if (state.files.items && state.files.purchases && state.auth.account && state.auth.account.name) {
            const merge = state.files.items.map(x => {
                return {
                    ...x,
                    purchased: state.files.purchases.some((p) => x.id == p.id),
                    owning: x.owner == state.auth.account.name,
                }
            })
            dispatch({
                type: LOAD_FILES_SUCCESS,
                data: {
                    items: merge
                }
            })
            console.log('merge', merge.rows)
        }
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
                    type: "primary"
                }
            }
        })
        return getState().root.eos.purchase(getState().auth.account.name, file)
            .then((res) => {
                dispatch(loadFiles())
                dispatch({
                    type: PURCHASE_FINISH,
                    id: file.id,
                    data: {
                        alert: null
                    }
                })
                dispatch(loadPurchases())
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
            dispatch({
                type: PURCHASE_FINISH,
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
            id: file.id,
            data: {
                alert: {
                    name: "Please confirm your download",
                    message: "Please confirm the scatter transaction to start the download...",
                    type: "primary"
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
            state.root.eos.accessgrant(state.auth.account.name, file)
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
            dispatch({
                type: DOWNLOAD_FINISH,
                id: file.id
            })
            return []
        })

        if (!files) return console.error('File not available...')

        dispatch({
            type: DOWNLOAD_START,
            data: {
                alert: {
                    name: "Download in progress...",
                    message: "Downloading file from IPFS, getting the key shares and decrypting it...",
                    type: "primary"
                }
            }
        })

        state = getState()
        console.log("Transaction completed: ", accessGrantRes, files)

        try {
            const {nonce, key} = await priveos.read(state.auth.account.name, file.uuid)
            console.log(`Received key "${Priveos.uint8array_to_hex(key)} and nonce "${Priveos.uint8array_to_hex(nonce)}"`)
            files.map((x) => {
                const cleartext = decrypt(x.content, nonce, key)
                createFile(cleartext, file.name)
                dispatch({
                    type: DOWNLOAD_FINISH,
                    id: file.id,
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
            dispatch({
                type: DOWNLOAD_FINISH,
                id: file.id
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
                state.root.eos.upload(state.auth.account.name, uuid, name, description, ipfs.getUrl(ipfsFile.hash), price, secret_bytes, nonce_bytes).then(() => {
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
