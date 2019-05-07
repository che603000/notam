//import {} from 'react-redux'
import React, {Component} from 'react';
import {Form, Button} from "react-bootstrap";
import {connect} from 'react-redux';
import altDecode from '../notam/decodes/alts-decode';
import {NOTAM_DECODE} from "../consts/action-names";

const createPolygons = require('../notam/polygons').default;
//import createPolygons from ' ../notam/polygons';
//import {NOTAM_LOADING, NOTAM_SUCCESS} from '../consts/action-names'

const mapDispatchToProps = () => dispatch => ({
    actionDecode: (polygons) => {
        dispatch({type: NOTAM_DECODE, polygons});
    }
});


class Notam extends Component {

    onDecode(fields) {
        const {actionDecode} = this.props;
        const alts = altDecode(fields, {min: 0, max: 999});
        const p = createPolygons(fields.E, alts);
        actionDecode(p);
        //debugger;
    };

    render() {
        const {fields, error} = this.props;
        const E = fields ? fields.E : "";
        const Q = fields ? fields.Q : "";
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
                    <Form.Label>Example textarea</Form.Label>
                    <Form.Control as="textarea"
                                  rows="10"
                                  value={E}
                                  readOnly={true}
                                  style={{fontSize: 'small'}}
                                  isInvalid={!!error}
                    />
                    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                </Form.Group>
                <Button onClick={e => this.onDecode(fields)}>Decode</Button>
            </Form>

        )
    }
}

export default connect(state => state.notam, mapDispatchToProps)(Notam);