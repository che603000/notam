//import {} from 'react-redux'
import React, {Component} from 'react';
import {Button, FormControl, InputGroup} from "react-bootstrap";
import {connect} from 'react-redux';
import {notamFetch} from '../utils/loaders'
import {NOTAM_ERROR, NOTAM_LOADING, NOTAM_SUCCESS, SEARCH_VALUE} from '../consts/action-names'


const notamLoad = (value) => dispatch => {
    dispatch({type: NOTAM_LOADING});
    notamFetch(value)
        .then(fields => dispatch({type: NOTAM_SUCCESS, fields}))
        .catch(err => dispatch({type: NOTAM_ERROR, error: err.message}));
};

const mapDispatchToProps = () => dispatch => {
    return {
        actionValueSearch: (value) => {
            dispatch({type: SEARCH_VALUE, value: value.toUpperCase()});
        },
        actionAsyncSearch: (value) => dispatch(notamLoad(value))
    };
};

class Search extends Component {

    onInput(value) {
        const {actionValueSearch} = this.props;
        actionValueSearch(value);
    }

    onClick() {
        const {actionAsyncSearch, value} = this.props;
        actionAsyncSearch(value);
    };

    render() {
        const {loading, value = ""} = this.props;
        return (
            <div>
                <InputGroup className="mb-3">
                    <FormControl disabled={loading}
                                 onChange={e => this.onInput(e.target.value)}
                                 value={value}
                                 placeholder="Recipient's username"
                                 aria-label="Recipient's username"
                                 aria-describedby="basic-addon2"
                    />
                    <InputGroup.Append>
                        <Button variant="outline-secondary" disabled={loading}
                                onClick={() => this.onClick()}>Button</Button>
                    </InputGroup.Append>
                </InputGroup>

            </div>
        )
    }
}

export default connect(state => state.search, mapDispatchToProps)(Search);