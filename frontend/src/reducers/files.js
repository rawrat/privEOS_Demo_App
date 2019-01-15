import {
    SHOW_ALERT,
    HIDE_ALERT,
    LOAD_FILES,
    LOAD_FILES_SUCCESS,
    LOAD_FILES_ERROR,
    PURCHASE,
    PURCHASE_SUCCESS,
    DOWNLOAD_START,
    DOWNLOAD_SUCCESS,
    DECRYPTION_START,
    DECRYPTION_SUCESS,
    DECRYPTION_ERROR
} from '../lib/action-types'

const initialState = {
    error: null,
    loading: true,
    items: [],
    item: null,
    downloading: [],
    purchasing: []
}

export default function(state = initialState, action) {

    switch (action.type) {
        // GENERIC ERROR
        case SHOW_ALERT:
            return { ...state, alert: action.alert}

        case HIDE_ALERT:
            // we wanna hide the error only if its the same as the one shown
            if (state.alert && JSON.stringify(state.alert) == JSON.stringify(action.aler)) {
                return { ...state, alert: null }
            }
            return { ...state }

        // LOAD FILES
        case LOAD_FILES:
            return { ...state, loading: true }
        case LOAD_FILES_SUCCESS:
            return { ...state, loading: false, ...action.data }
        case LOAD_FILES_ERROR:
            return { ...state, loading: false, error: "Could not load files" }

        // PURCHASE
        case PURCHASE:
            state.purchasing.push(action.id)
            return { ...state }
        case PURCHASE_SUCCESS:
            state.purchasing = state.purchasing.filter((x) => x != action.id)
            return { ...state }
        
        // DOWNLOAD
        case DOWNLOAD_START:
            state.downloading.push(action.id)
            return { ...state, status: action.type, ...action.data }
        case DOWNLOAD_SUCCESS:
            state.downloading = state.downloading.filter((x) => x != action.id)
            return { ...state }

        // DECRYPTION
        case DECRYPTION_START:
            return { ...state, status: action.type, ...action.data }
        case DECRYPTION_SUCESS: 
            return { ...state, status: action.type, ...action.data }
        case DECRYPTION_ERROR: 
            return { ...state, status: action.type, ...action.data }
        
        // DEFAULT
        default:
            return state;
    }
  };