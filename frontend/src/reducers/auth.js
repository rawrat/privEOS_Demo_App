import { 
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
        case CONNECT_SCATTER_START:
            return { ...state, status: action.type, loading: true }
        case CONNECT_SCATTER_SUCCESS:
            return { ...state, status: action.type, ...action.data }
        case CONNECT_SCATTER_ERROR:
            return { ...state, status: action.type }
        case GET_SCATTER_IDENTITY_START:
            return { ...state, status: action.type}
        case GET_SCATTER_IDENTITY_SUCCESS:
            return { ...state, status: action.type}
        default:
            return state;
    }
}