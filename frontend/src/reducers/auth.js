import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../constants/action-types'

const initialState = {
    loggedIn: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, loggedIn: true, ...action.data }
        case LOGOUT_SUCCESS:
            return { ...state, loggedIn: false }
        default:
            return state;
    }
}