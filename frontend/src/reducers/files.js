import { LOAD_FILES, LOAD_FILES_SUCCESS, LOAD_FILES_ERROR } from '../constants/action-types'

const initialState = {
    loading: true,
    items: []
}

export default function(state = initialState, action) {
    console.log('triggered action', action)
    switch (action.type) {
        case LOAD_FILES:
            console.log('triggered LOAD_FILES')
            return { ...state, loading: true }
        case LOAD_FILES_SUCCESS:
            return { ...state, loading: false, ...action.data }
        case LOAD_FILES_ERROR:
            return { ...state, loading: false, error: "Could not load files" }
        default:
            return state;
    }
  };