import L from 'leaflet';
import store from "../store";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let statePolygons = null;


const onStore = (state, layers) => {
    const {notam: {polygons}} = state;
    if (statePolygons === polygons)
        return;

    statePolygons = polygons;

    if (polygons)
        layers.addLayer(createPolygon(polygons[0]));
    else
        layers.clearLayers();
    console.log(polygons);

};

const createPolygon = p => {
    const paths = p.paths.map(path => path.map(point => [point[1], point[0]]));
    return L.polygon([paths], {color: 'red', fillOpacity: 0.4});
};

const initIcon = () => {
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });

    L.Marker.prototype.options.icon = DefaultIcon;
};

const initMap = (divId) => {
    const _map = L.map(divId, {
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
        .addTo(_map);
    return _map;
}

export default () => {
    initIcon();
    const _map = initMap('lmap');
    const layers = L.layerGroup().addTo(_map);
    store.subscribe(() => onStore(store.getState(), layers));
};