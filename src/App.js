import React, {Component} from 'react';
import LMap from './components/lmap';
import Notam from './components/notam';
import Search from './components/search';
import './App.css';
import {Container, Row, Col} from 'react-bootstrap';

import {Provider} from 'react-redux';
import store from './store';


class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Container>
                    <Row>
                        <Col xl={9}>NOTAM</Col>
                        <Col xl={3}>
                            <Search/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={3}>
                            <Notam/>
                        </Col>
                        <Col xl={9}>
                            <LMap/>
                        </Col>
                    </Row>
                </Container>
            </Provider>
        );
    }
}

export default App;
