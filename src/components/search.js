//import {} from 'react-redux'
import React, {Component} from 'react';
import {Button, FormControl, InputGroup} from "react-bootstrap";
import {connect} from 'react-redux';
import {NOTAM_ERROR, NOTAM_LOADING, NOTAM_SUCCESS, SEARCH_VALUE} from '../store/action-names'


const fetchNotam = (value) => dispatch => {
    dispatch({type: NOTAM_LOADING});
    new Promise((res, rej) => {
        setTimeout(() => {
            res(`${value}\ntext = ${Date.now()}`);
            //rej('Error net ...');
        }, 2000)

    })
        .then(text => dispatch({type: NOTAM_SUCCESS, text}))
        .catch(text => dispatch({type: NOTAM_ERROR, text}))
};


const mapDispatchToProps = () => dispatch => {
    return {
        actionValueSearch: (value) => {
            dispatch({type: SEARCH_VALUE, value: value.toUpperCase()});
        },
        actionAsyncSearch: (value) => dispatch(fetchNotam(value))
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
                                onClick={e => this.onClick()}>Button</Button>
                    </InputGroup.Append>
                </InputGroup>

            </div>
        )
    }
}

export default connect(state => state.search, mapDispatchToProps)(Search);