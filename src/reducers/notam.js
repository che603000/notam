
import {NOTAM_ERROR, NOTAM_LOADING, NOTAM_SUCCESS} from '../consts/action-names'

export default  (state = {}, action) => {
    //debugger;
    switch (action.type) {
        case NOTAM_SUCCESS:
            return {
                ...state,
                fields: action.fields,
                error: false
            };
        case NOTAM_ERROR:
            return {
                ...state,
                error: action.error,
                fields: null,
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