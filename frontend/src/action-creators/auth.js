import { LOGIN_SUCCESS } from '../constants/action-types'
import { Eos } from '../lib/eos'


export function loginAsUser(user, key) {
    return (dispatch) => {
        dispatch({
            type: LOGIN_SUCCESS,
            data: {
                user: user,
                eos: new Eos(key)
            }
        })
    }
}