//import {} from 'react-redux'
import React, {Component} from 'react';
import {Form} from "react-bootstrap";
import {connect} from 'react-redux';
import {NOTAM_LOADING, NOTAM_SUCCESS} from '../store/action-names'

const mapDispatchToProps = () => dispatch => {
    return {
        actionSearch: (value) => {
            dispatch({type: 'SEARCH', value});
        },
        actionAsyncSearch: (value) => {
            dispatch(dispatch => {
                dispatch({type: NOTAM_LOADING, value});
                setTimeout(() => {
                    dispatch({type: NOTAM_SUCCESS, text: "(8734djcbjk98eu3908r9028093r)"});
                }, 2000);
            });
        }
    }
};


class Notam extends Component {

    onClick(e) {
        const {actionAsyncSearch} = this.props;
        actionAsyncSearch("K0543-19");
    };

    render() {
        const {text, error} = this.props;
        return (
            <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com"/>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Example select</Form.Label>
                    <Form.Control as="select">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </Form.Control>
                </Form.Group>
                {/*<Form.Group controlId="exampleForm.ControlSelect2">*/}
                    {/*<Form.Label>Example multiple select</Form.Label>*/}
                    {/*<Form.Control as="select" multiple>*/}
                        {/*<option>1</option>*/}
                        {/*<option>2</option>*/}
                        {/*<option>3</option>*/}
                        {/*<option>4</option>*/}
                        {/*<option>5</option>*/}
                    {/*</Form.Control>*/}
                {/*</Form.Group>*/}
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label style={{color: error ? 'red' : ''}}>Example textarea</Form.Label>
                    <Form.Control as="textarea" rows="3" value={text}/>
                </Form.Group>
            </Form>

        )
    }
}

export default connect(state => state.notam, mapDispatchToProps)(Notam);