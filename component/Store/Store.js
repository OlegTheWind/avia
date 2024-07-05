import { createStore } from 'redux'

import filtersReducer from '../Reducers/Reducers'

const store = createStore(filtersReducer)

export default store
