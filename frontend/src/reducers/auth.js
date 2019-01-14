import { 
    LOGIN_SUCCESS, 
    LOGOUT_SUCCESS, 
    GET_BALANCE, 
    GET_BALANCE_SUCCESS, 
    CONNECT_SCATTER, 
    CONNECT_SCATTER_SUCCESS, 
    CONNECT_SCATTER_ERROR,
    GET_SCATTER_IDENTITY, 
    GET_SCATTER_IDENTITY_SUCCESS
} from '../lib/action-types'

const initialState = {
    loggedIn: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, loggedIn: true, loading: false, ...action.data }
        case LOGOUT_SUCCESS:
            return { ...state, loggedIn: false, ...action.data }
        case GET_BALANCE:
            return { ...state, loading: true }
        case GET_BALANCE_SUCCESS:
            return { ...state, loading: false, balance: action.balance }
        case CONNECT_SCATTER:
            return { ...state, status: CONNECT_SCATTER, loading: true }
        case CONNECT_SCATTER_SUCCESS:
            return { ...state, status: CONNECT_SCATTER_SUCCESS, ...action.data }
        case CONNECT_SCATTER_ERROR:
            return { ...state, status: CONNECT_SCATTER_ERROR }
        case GET_SCATTER_IDENTITY:
            return { ...state, status: "Getting scatter identity..."}
        case GET_SCATTER_IDENTITY_SUCCESS:
            return { ...state, status: "Getting scatter success..."}
        default:
            return state;
    }
}