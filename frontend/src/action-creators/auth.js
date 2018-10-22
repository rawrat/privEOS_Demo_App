import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../constants/action-types'
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
                        ephemeralKeyPublic: ephemeral.public,
                        publicKey
                    })
                }
            })
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
                            ephemeralKeyPublic: ephemeral.public,
                            publicKey: response.identity.publicKey
                        }),
                        scatter: true
                    }
                })
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