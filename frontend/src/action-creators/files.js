import { LOAD_FILES, LOAD_FILES_SUCCESS, LOAD_FILES_ERROR, PURCHASE, PURCHASE_SUCCESS, DOWNLOAD, DOWNLOAD_SUCCESS } from '../constants/action-types'
import ipfs from '../lib/ipfs'
import { getPriveos } from '../lib/eos'
import { encrypt, decrypt } from '../lib/crypto'
import { createFile, read } from '../lib/file'
import { history } from '../store';


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
            console.error('get files error', err)
            dispatch({
                type: LOAD_FILES_ERROR,
                data: err
            })
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
    return (dispatch, getState) => {
        let state = getState()
        dispatch({
            type: DOWNLOAD,
            id: file.id
        })
        const hash = ipfs.extractHashFromUrl(file.url)
        if (!hash) {
            return alert('The url is not a valid ipfs url: ' + file.url)
        }
        ipfs.download(hash).then((files) => {
            const priveos = getPriveos()
            state.auth.eos.accessgrant(state.auth.account.name, file.uuid).then((accessGrantRes) => {
                state = getState()
                console.log('accessGrantRes', accessGrantRes)
                priveos.read(state.auth.account.name, file.uuid).then((res) => {
                    console.log('received read response from broker', res)
                    files.map((x) => {
                        const cleartext = decrypt(x.content, res[1], res[0])
                        console.log('decrypted cleartext', cleartext)
                        createFile(cleartext, file.name)
                    })
                    dispatch({
                        type: DOWNLOAD_SUCCESS,
                        id: file.id
                    })
                })
            })
        })
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
            })
        })
        .catch((err) => {
        console.error(err)
        })
    }
}