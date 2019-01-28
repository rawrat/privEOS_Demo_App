import {
    CONNECT_EOS,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    GET_BALANCE,
    GET_BALANCE_SUCCESS,
    CONNECT_SCATTER_START,
    CONNECT_SCATTER_SUCCESS,
    CONNECT_SCATTER_ERROR,
    GET_SCATTER_IDENTITY_START,
    GET_SCATTER_IDENTITY_SUCCESS
} from '../lib/action-types'
import { Eos, loginWithScatter as _loginWithScatter_, getScatterAccount, addScatter, logoutScatter } from '../lib/eos'
import { getEphemeralKeys } from '../lib/crypto'
import { history } from '../store'
import { showAlert } from './common'


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
            type: CONNECT_SCATTER_START
        })
        addScatter().then((scatter) => {
            if (!scatter) {
                return dispatch({
                    type: CONNECT_SCATTER_ERROR
                })
            }
            dispatch({
                type: CONNECT_SCATTER_SUCCESS,
                data: {
                    scatter
                }
            })
            if (scatter.identity) {
                dispatch({
                    type: GET_SCATTER_IDENTITY_START
                })
                const account = getScatterAccount(scatter.identity)
                dispatch(loginSuccess(account))
            }
        })
    }
}


export function loginWithScatter() {
    return (dispatch, getState) => {
        const state = getState()
        dispatch({
            type: GET_SCATTER_IDENTITY_START
        })
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
        }).catch(err => {
            dispatch(showAlert({
                name: "Could not get balance",
                message: `It seems that the eos node is not available (${err.message})`
            }))
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
                status: null,
                account: null,
                eos: null
            }
        })
    }
}