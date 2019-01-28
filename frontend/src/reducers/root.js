import { 
  CONNECT_EOS
} from '../lib/action-types'

const initialState = {
  initializing: true
}

export default function(state = initialState, action) {
    switch (action.type) {
      case CONNECT_EOS:
          return { ...state, initializing: false, ...action.data }
      default:
        return state;
    }
  };