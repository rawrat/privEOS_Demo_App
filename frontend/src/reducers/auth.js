import { LOGIN_SUCCESS, LOGOUT_SUCCESS, GET_BALANCE, GET_BALANCE_SUCCESS } from '../constants/action-types'

const initialState = {
    loggedIn: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, loggedIn: true, ...action.data }
        case LOGOUT_SUCCESS:
            return { ...state, loggedIn: false, ...action.data }
        case GET_BALANCE:
            return { ...state, loading: true }
        case GET_BALANCE_SUCCESS:
            return { ...state, loading: false, balance: action.balance }
        default:
            return state;
    }
}