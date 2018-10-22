import { LOAD_FILES, LOAD_FILES_SUCCESS, LOAD_FILES_ERROR, PURCHASE, PURCHASE_SUCCESS } from '../constants/action-types'

const initialState = {
    loading: true,
    items: [],
    item: null,
    purchasedItems: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case LOAD_FILES:
            return { ...state, loading: true }
        case LOAD_FILES_SUCCESS:
            return { ...state, loading: false, ...action.data }
        case LOAD_FILES_ERROR:
            return { ...state, loading: false, error: "Could not load files" }
        case PURCHASE:
            return { ...state, purchaseLoading: true }
        case PURCHASE_SUCCESS:
            state.purchasedItems = state.purchasedItems.push(action.file)
            return { ...state, purchaseLoading: false }
        default:
            return state;
    }
  };