import React, {Component} from 'react';
import initMap from '../maps';


class LMap extends Component {
    render() {
        return (
            <div id={"lmap"} style={{width: '100%', height: '100%', minHeight: '600px'}}>

            </div>
        )
    }

    componentDidMount() {
        initMap();
    }

    shouldComponentUpdate() {
        return false;
    }

}

export default LMap;