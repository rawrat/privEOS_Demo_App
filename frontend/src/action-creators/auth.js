import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../constants/action-types'
import { Eos, connectScatter } from '../lib/eos'


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

export function loginWithScatter() {
    return (dispatch) => {
        connectScatter().then((response) => {
            dispatch({
                type: LOGIN_SUCCESS,
                data: {
                    user: response.account.name,
                    eos: new Eos(response.scatter)
                }
            })
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