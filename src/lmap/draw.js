import L from 'leaflet';
import parse from '../utils/geometry/q-field-parse';
import store from "../store";
import observe from 'redux-observe';
import {mapperToPaths} from "../utils/geometry/selector";

export default (_map) => {
    const onStore = (notam) => {
        const {E, Q} = notam;
        if (!E)
            return;
        const {center, radius} = parse(Q);

        L.marker(center.reverse()).addTo(_map);
        L.circle(center, {
            radius: radius * 1000,
            color: 'blue',
            weight: 1,
            fill: false,
            dashArray: "10,10"
        }).addTo(_map);

        mapperToPaths(E)
            .forEach(paths => {
                const pol = L.polygon(paths, {color: 'red'}).addTo(_map);
                _map.fitBounds(pol.getBounds());
            });


    };

    observe(store, state => state.notam, el => onStore(el()));
}

