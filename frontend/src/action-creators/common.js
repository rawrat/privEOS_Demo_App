import {
    SHOW_GENERIC_ERROR,
    HIDE_GENERIC_ERROR
} from '../lib/action-types'
import config from '../config'
export function showGenericError(err) {
    return (dispatch) => {
        dispatch({
            type: SHOW_GENERIC_ERROR,
            error: {
                name: err.name || null,
                message: err.message || null
            }
        })

        window.setTimeout(() => {
            dispatch({
                type: HIDE_GENERIC_ERROR,
                error: {
                    name: err.name || null,
                    message: err.message || null
                }
            })
        }, config.errorVisibility)
    }
}