
import {NOTAM_ERROR, NOTAM_LOADING, NOTAM_SUCCESS} from '../action-names'

export default  (state = {}, action) => {
    //debugger;
    switch (action.type) {
        case NOTAM_SUCCESS:
            return {
                ...state,
                text: action.text,
                error: false
            };
        case NOTAM_ERROR:
            return {
                ...state,
                text: action.text,
                error: true
            };
        case NOTAM_LOADING:
            return {
                ...state,
                error: false
            };
        default:
            return state
    }
};