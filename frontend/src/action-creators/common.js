import {
    SHOW_ALERT,
    HIDE_ALERT
} from '../lib/action-types'
import config from '../config'
export function showAlert(alert) {
    const obj = {
        name: alert.name || null,
        message: alert.message || null,
        type: alert.type || "danger"
    }
    return (dispatch) => {
        dispatch({
            type: SHOW_ALERT,
            alert: obj
        })

        window.setTimeout(() => {
            dispatch({
                type: HIDE_ALERT,
                alert: obj
            })
        }, config.errorVisibility)
    }
}