import { LOAD_FILES, LOAD_FILES_SUCCESS, LOAD_FILES_ERROR, PURCHASE, PURCHASE_SUCCESS, DOWNLOAD, DOWNLOAD_SUCCESS } from '../constants/action-types'
import ipfs from '../lib/ipfs'
import { getPriveos } from '../lib/eos'
import { decrypt } from '../lib/crypto'
import { createFile } from '../lib/file'

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
        return getState().auth.eos.purchase(getState().auth.account.name, file.price, file.uuid)
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
            console.log('access grant', priveos.config.ephemeralKeyPublic)
            state.auth.eos.accessgrant(state.auth.account.name, file.uuid, priveos.config.ephemeralKeyPublic).then((accessGrantRes) => {
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