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
                console.log('get files result', res)
            })
            .catch((err) => {
                console.log('get files error', err)
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