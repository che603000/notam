//import {} from 'react-redux'
import React, {Component} from 'react';
import {Form, ButtonToolbar, ButtonGroup, Button} from "react-bootstrap";
import {FaMinus, FaCircle, FaDrawPolygon, FaRoute, FaTrash} from 'react-icons/fa';
import {connect} from 'react-redux';
import {NOTAM_LOADING, NOTAM_SUCCESS, NOTAM_ADD, NOTAM_REMOVE, NOTAM_VALUE} from '../consts/action-names'

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

class Field extends Component {

    onChange(value) {
        this.props.dispatch({type: NOTAM_VALUE, value});
    }

    onRemove() {
        this.props.dispatch({type: NOTAM_REMOVE});
    }

    render() {
        const {value} = this.props;
        return (
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Example textarea</Form.Label>
                <ButtonToolbar aria-label="Toolbar with button groups">
                    <ButtonGroup size={'sm'} className="" aria-label="First group">
                        <Button variant="light" onClick={() => this.onRemove()}><FaTrash/></Button>
                        <Button variant="light"><FaCircle/></Button>
                        <Button variant="light"><FaDrawPolygon/></Button>
                        <Button variant="light"><FaRoute/></Button>
                    </ButtonGroup>
                </ButtonToolbar>
                <Form.Control as="textarea"
                              rows="10"
                              value={value}
                              readOnly={true}
                              onChange={e => this.onChange(e.target.value)}
                              style={{fontSize: 'small'}}
                    // isInvalid={!!error}
                />
                {/*<Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>*/}
            </Form.Group>

        )
    }
}

class Notam extends Component {

    // onClick(e) {
    //     const {actionAsyncSearch} = this.props;
    //     actionAsyncSearch("K0543-19");
    // };

    onAdd() {
        this.props.dispatch({type: NOTAM_ADD})
    }

    render() {
        const {E, Q, error, dispatch} = this.props;
        return (
            <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Q</Form.Label>
                    <Form.Control
                        type="text"
                        value={Q}
                        placeholder="поле Q"
                        readOnly={true}
                        style={{fontSize: 'small'}}
                        isInvalid={!!error}
                    />
                    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                </Form.Group>
                {/*<Form.Group controlId="exampleForm.ControlSelect1">*/}
                {/*<Form.Label>Example select</Form.Label>*/}
                {/*<Form.Control as="select">*/}
                {/*<option>1</option>*/}
                {/*<option>2</option>*/}
                {/*<option>3</option>*/}
                {/*<option>4</option>*/}
                {/*<option>5</option>*/}
                {/*</Form.Control>*/}
                {/*</Form.Group>*/}
                <Field value={E} dispatch={dispatch}/>
                {/*<Button onClick={() => this.onAdd()}>+</Button>*/}

            </Form>

        )
    }
}

export default connect(state => state.notam)(Notam);