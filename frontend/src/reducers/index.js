import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import root from './root'

export default combineReducers({
    routing: routerReducer,
    auth,
    root
});