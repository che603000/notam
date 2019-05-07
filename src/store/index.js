import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import search from '../reducers/search';
import notam from '../reducers/notam';


const redusers = combineReducers({
    search,
    notam
});

const initState = {
    search: {
        loading: false,
        value: 'K8486_19'
    }
};

const store = createStore(redusers, initState, applyMiddleware(thunk));
//const unsubscribe = store.subscribe(() => console.log(store.getState()))

export default store;