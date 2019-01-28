import {
    CONNECT_EOS
} from '../lib/action-types'
import { Eos, loginWithScatter as _loginWithScatter_ } from '../lib/eos'
import { getEphemeralKeys } from '../lib/crypto'

export function initialize() {
    return (dispatch) => {
        dispatch(connectEos())
    }
}
export function connectEos() {
    return (dispatch, getState) => {
        return getEphemeralKeys().then((ephemeral) => {
            dispatch({
                type: CONNECT_EOS,
                data: {
                    eos: new Eos({
                        scatter: getState().auth.scatter,
                        ephemeralKeyPrivate: ephemeral.private,
                        ephemeralKeyPublic: ephemeral.public
                    })
                }
            })
        })
    }
}
