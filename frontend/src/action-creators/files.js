import { LOAD_FILES, LOAD_FILES_SUCCESS, LOAD_FILES_ERROR } from '../constants/action-types'
import { getFiles } from '../lib/eos'
// FILES
export function loadFiles() {
    return (dispatch, getState) => {
        dispatch({
            type: LOAD_FILES
        })
        return getState().auth.eos.getFiles()
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
export function loadFile() {
    return (dispatch, getState) => {
        dispatch({
            type: LOAD_FILES
        })
        return getState().auth.eos.getFile()
            .then((res) => {
                dispatch({
                    type: LOAD_FILES_SUCCESS,
                    data: {
                        item: res
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