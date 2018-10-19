import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../constants/action-types'
import { Eos } from '../lib/eos'


export function loginAsUser(user, key) {
    console.log('loginAsUser', user, key)
    return (dispatch) => {
        dispatch({
            type: LOGIN_SUCCESS,
            data: {
                user: user,
                eos: new Eos([key])
            }
        })
    }
}

export function logout() {
    return {
        type: LOGOUT_SUCCESS,
        data: {
            user: null,
            eos: null
        }
    }
}