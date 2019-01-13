import { LOGIN_SUCCESS, LOGOUT_SUCCESS, GET_BALANCE, GET_BALANCE_SUCCESS, CONNECT_SCATTER, CONNECT_SCATTER_SUCCESS, CONNECT_SCATTER_ERROR, GET_SCATTER_IDENTITY_SUCCESS } from '../constants/action-types'
import { Eos, loginWithScatter as _loginWithScatter_, getScatterAccount, addScatter, logoutScatter } from '../lib/eos'
import { getEphemeralKeys } from '../lib/crypto'
import { history } from '../store'

export function loginSuccess(account) {
    return (dispatch, getState) => {
        return getEphemeralKeys().then((ephemeral) => {
            dispatch({
                type: LOGIN_SUCCESS,
                data: {
                    account: account,
                    eos: new Eos({
                        scatter: getState().auth.scatter,
                        ephemeralKeyPrivate: ephemeral.private,
                        ephemeralKeyPublic: ephemeral.public
                    })
                }
            })
            dispatch(getBalance())   
        })
    }
}




export function connectScatter() {
    return (dispatch) => {
        dispatch({
            type: CONNECT_SCATTER
        })
        addScatter().then((scatter) => {
            if (!scatter) {
                console.error('No scatter available...')
                return dispatch({
                    type: CONNECT_SCATTER_ERROR
                })
            }
            console.log('Connected to scatter...')
            dispatch({
                type: CONNECT_SCATTER_SUCCESS,
                data: {
                    scatter
                }
            })
            if (scatter.identity) {
                const account = getScatterAccount(scatter.identity)
                dispatch(loginSuccess(account))
            }
        })
    }
}


export function loginWithScatter() {
    return (dispatch, getState) => {
        const state = getState()
        return _loginWithScatter_(state.auth.scatter).then((response) => {
            dispatch({
                type: GET_SCATTER_IDENTITY_SUCCESS,
            })
            if (response.account) {
                dispatch(loginSuccess(response.account))
                window.setTimeout(() => history.push('/'), 3000)
            }
        })
    }
}

export function getBalance() {
    return (dispatch, getState) => {
        const state = getState()
        dispatch({
            type: GET_BALANCE
        })
        state.auth.eos.getBalance(state.auth.account.name).then((balance) => {
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