import nanoid from 'nanoid';
import {NOTAM_ERROR, NOTAM_LOADING, NOTAM_SUCCESS, NOTAM_ADD, NOTAM_REMOVE, NOTAM_VALUE} from '../consts/action-names'

export default (state = {elements: []}, action) => {
    switch (action.type) {
        case NOTAM_SUCCESS:
            return {
                ...state,
                fields: action.fields,
                elements: [{id: nanoid(10), text: action.fields.E}],
                error: false
            };
        case NOTAM_ERROR:
            return {
                ...state,
                error: action.error,
                fields: null,
                elements: []
            };
        case NOTAM_LOADING:
            return {
                ...state,
                error: false
            };
        case NOTAM_ADD:
            return {
                ...state,
                elements: [...state.elements, {id: nanoid(10), text: ''}]
            };
        case NOTAM_REMOVE:
            return {
                ...state,
                elements: state.elements.filter(el => el.id !== action.id)
            };
        case NOTAM_VALUE:
            return {
                ...state,
                elements: state.elements.map(el => {
                    if (el.id === action.id)
                        return {...el, text: action.value.toUpperCase()};
                    else
                        return el;

                })
            };
        default:
            return state
    }
};