import { LOAD_FILES, LOAD_FILES_SUCCESS, LOAD_FILES_ERROR, PURCHASE, PURCHASE_SUCCESS } from '../constants/action-types'

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

export function purchase(price, uuid) {
    return (dispatch, getState) => {
        dispatch({
            type: PURCHASE
        })
        return getState().auth.eos.purchase(getState().auth.account.name, price, uuid)
        .then((res) => {
            dispatch(loadFiles())
            dispatch({
                type: PURCHASE_SUCCESS,
                data: {
                    items: res
                }
            })
        })
    }
}