import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import search from './reducers/search';
import notam from './reducers/notam';


const redusers = combineReducers({
    search,
    notam
});
const store = createStore(redusers, applyMiddleware(thunk));
//const unsubscribe = store.subscribe(() => console.log(store.getState()))

export default store;