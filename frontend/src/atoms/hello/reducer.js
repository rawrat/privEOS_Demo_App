export default (state = {}, action) => {
    switch (action.type) {
        case 'HELLO':
            return {
                result: action.payload
            }
        default:
            return state
    }
}