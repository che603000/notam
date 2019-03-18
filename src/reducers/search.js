import {NOTAM_ERROR, NOTAM_LOADING, NOTAM_SUCCESS, SEARCH_VALUE} from '../consts/action-names'

export default (state = {loading: false, value: 'Q0752_19'}, action) => {
    switch (action.type) {
        case SEARCH_VALUE:
            return {
                ...state,
                value: action.value
            };
        case NOTAM_ERROR:
        case NOTAM_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case NOTAM_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state
    }
};