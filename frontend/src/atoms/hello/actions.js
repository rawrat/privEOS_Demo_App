export const hello = () => dispatch => {
    dispatch({
        type: 'HELLO',
        payload: 'WORLD'
    })
}