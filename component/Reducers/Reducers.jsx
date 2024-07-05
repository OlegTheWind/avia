const initialState = {
    filters: [],
}

const filtersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FILTER':
            return {
                ...state,
                filters: action.payload,
            }
        default:
            return state
    }
}

export default filtersReducer
