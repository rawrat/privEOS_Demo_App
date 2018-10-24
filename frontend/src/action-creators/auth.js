import { LOGIN_SUCCESS, LOGOUT_SUCCESS, GET_BALANCE, GET_BALANCE_SUCCESS } from '../constants/action-types'
import { Eos, connectScatter, logoutScatter } from '../lib/eos'
import { getEphemeralKeys } from '../lib/crypto'



export function loginAsUser(user, privateKey, publicKey) {
    console.log('loginAsUser', user, privateKey, publicKey)
    return (dispatch) => {
        return getEphemeralKeys().then((ephemeral) => {
            dispatch({
                type: LOGIN_SUCCESS,
                data: {
                    account: {
                        name: user
                    },
                    eos: new Eos({
                        keys: [privateKey],
                        ephemeralKeyPrivate: ephemeral.private,
                        ephemeralKeyPublic: ephemeral.public
                    })
                }
            })
            dispatch(getBalance())
        })
    }
}

export function loginWithScatter() {
    return (dispatch) => {
        connectScatter().then((response) => {
            return getEphemeralKeys().then((ephemeral) => {
                dispatch({
                    type: LOGIN_SUCCESS,
                    data: {
                        account: response.account,
                        eos: new Eos({
                            scatter: response.scatter,
                            ephemeralKeyPrivate: ephemeral.private,
                            ephemeralKeyPublic: ephemeral.public
                        }),
                        scatter: true
                    }
                })
                dispatch(getBalance())
            })
        })
    }
}


export function getBalance() {
    return (dispatch, getState) => {
        const state = getState()
        dispatch({
            type: GET_BALANCE
        })
        console.log('getBalance', state.auth)
        state.auth.eos.getBalance(state.auth.account.name).then((balance) => {
            console.log('balance', balance)
            dispatch({
                type: GET_BALANCE_SUCCESS,
                balance
            })
        })
    }
}

export function logout() {
    return (dispatch, getState) => {
        if (getState().auth.scatter) {
            logoutScatter()
        }
        dispatch({
            type: LOGOUT_SUCCESS,
            data: {
                account: null,
                eos: null
            }
        })
    }
}