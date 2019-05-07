
import {NOTAM_ERROR, NOTAM_LOADING, NOTAM_SUCCESS, NOTAM_DECODE} from '../consts/action-names'

export default  (state = {}, action) => {
    //debugger;
    switch (action.type) {
        case NOTAM_DECODE:
            return {
                ...state,
                polygons: action.polygons
            };
        case NOTAM_SUCCESS:
            return {
                ...state,
                polygons: null,
                fields: action.fields,
                error: false
            };
        case NOTAM_ERROR:
            return {
                ...state,
                polygons: null,
                error: action.error,
                fields: null,
            };
        case NOTAM_LOADING:
            return {
                ...state,
                polygons: null,
                error: false
            };
        default:
            return state
    }
};