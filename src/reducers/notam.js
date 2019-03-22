//import {point} from '../utils/libs';
import {NOTAM_ERROR, NOTAM_LOADING, NOTAM_SUCCESS, NOTAM_ADD, NOTAM_REMOVE, NOTAM_VALUE} from '../consts/action-names'

export default (state = {fields: {}, error: false}, action) => {
    switch (action.type) {
        case NOTAM_SUCCESS:
            return {
                ...action.fields,
                error: false
            };
        case NOTAM_ERROR:
            return {
                error: action.error,
            };
        case NOTAM_LOADING:
            return {
                error: false
            };
        // case NOTAM_ADD:
        //     return {
        //         ...state,
        //         elements: [...state.elements, {id: nanoid(10), text: ''}]
        //     };
        // case NOTAM_REMOVE:
        //     return {
        //         ...state,
        //         elements: state.elements.filter(el => el.id !== action.id)
        //     };
        case NOTAM_VALUE:
            return {
                ...state,
                E: action.value.toUpperCase()
            };
        default:
            return state
    }
};