import {
    SHOW_ALERT,
    HIDE_ALERT,
    LOAD_FILES,
    LOAD_FILES_SUCCESS,
    LOAD_PURCHASES_SUCCESS,
    LOAD_FILES_ERROR,
    PURCHASE_START,
    PURCHASE_FINISH,
    DOWNLOAD_START,
    DOWNLOAD_FINISH,
    UPLOAD_IPFS_START,
    UPLOAD_EOS_START,
    UPLOAD_SUCCESS,
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
        case LOAD_PURCHASES_SUCCESS:
            return { ...state, loading: false, ...action.data }
        case LOAD_FILES_ERROR:
            return { ...state, loading: false, error: "Could not load files" }

        // PURCHASE
        case PURCHASE_START:
            state.purchasing.push(action.id)
            return { ...state, ...action.data }
        case PURCHASE_FINISH:
            state.purchasing = state.purchasing.filter((x) => x != action.id)
            return { ...state, ...action.data }
        
        // DOWNLOAD
        case DOWNLOAD_START:
            state.downloading.push(action.id)
            return { ...state, status: action.type, ...action.data }
        case DOWNLOAD_FINISH:
            state.downloading = state.downloading.filter((x) => x != action.id)
            return { ...state, ...action.data }

        // UPLOAD
        case UPLOAD_IPFS_START:
            return { ...state, ...action.data }
        case UPLOAD_EOS_START:
            return { ...state, ...action.data }
        case UPLOAD_SUCCESS:
            return { ...state, ...action.data }


        // DECRYPTION
        case DECRYPTION_ERROR: 
            return { ...state, status: action.type, ...action.data }
        
        // DEFAULT
        default:
            return state;
    }
  };