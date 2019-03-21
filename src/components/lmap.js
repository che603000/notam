import React, {Component} from 'react';
import L from 'leaflet';
import store from "../store";
import observe from 'redux-observe';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {points} from '../utils/libs';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


class LMap extends Component {
    render() {
        return (
            <div id={"lmap"} style={{width: '100%', height: '100%', minHeight: '600px'}}>

            </div>
        )
    }

    componentDidMount() {
        //this.store = this.props.store;
        this._map = L.map("lmap", {
            center: [56, 43],
            zoom: 6
        });
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
        })
            .addTo(this._map);

        //store.subscribe(() => this.onStore(store.getState(), this._map));
        observe(store, state => state.notam.elements, el => this.onStore(el(), this._map));
    }

    shouldComponentUpdate() {
        return false;
    }

    onStore(state, map) {
        state.forEach(el => {
            const {text} = el;
            const path = points(text);
            if(!path)
                return;
            if (this.line) {
                this.line.setLatLngs(path);
            } else
                this.line = L.polyline(path, {color: 'red'}).addTo(map);

            map.fitBounds(this.line.getBounds());

        });
        //debugger;
    }
}

export default LMap;