import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import { Map, View, Feature, Overlay, Graticule } from 'ol/index';
import { fromLonLat, toLonLat, useGeographic, transform } from 'ol/proj';
import { toStringHDMS } from 'ol/coordinate';
import { defaults as defaultControls, ZoomToExtent, ScaleLine, ZoomSlider, Attribution, FullScreen, Control, MousePosition } from 'ol/control';
import { Circle as CircleStyle, Circle, Icon, Fill, Stroke, Style, Text } from 'ol/style';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { Tile as TileLayer, Vector as VectorLayer, LayerTile } from 'ol/layer';
import { ImageArcGISRest, TileArcGISRest, XYZ, OSM, Stamen, BingMaps } from 'ol/source';
import LayerSwitcher from 'ol-layerswitcher';
import LayerGroup from 'ol/layer/Group';
import LayerImage from 'ol/layer/Image';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import TileJSON from 'ol/source/TileJSON';


let attribution = new Attribution({
    collapsible: true
});

//Poopup
/**
* Elements that make up the popup.
*/

let container = document.getElementById('popup');
let content = document.getElementById('popup-content');
let closer = document.getElementById('popup-closer');




/**

* Create an overlay to anchor the popup to the map.

*/

let overlay = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }

});

/**
  Add a click handler to hide the popup.
* @return {boolean} Don't follow the href.
*/

closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

//Raster
let arcgis = new TileLayer({
    title: 'ArcGIS',
    type: 'base',
    visible: true,
    source: new XYZ({
        attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    })
});

let graticule = new Graticule({
    title: 'Graticule',
    //type: 'base',
    combine: true,
    visible: true,
    opaque: false,
    strokeStyle: new Stroke({
        color: 'black',
        width: 1,
        lineDash: [0.5, 4]
    }),
    showLabels: true,
    wrapX: false
});


//VECTORI

let vector4wfs = new VectorLayer({
    title: 'World',
    visible: false,
    source: new VectorSource({
        format: new GeoJSON(),
        url: function (extent) {
            return 'https://ahocevar.com/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=opengeo:countries&' +
                'outputFormat=application/json&srsname=EPSG:4326&' +
                'bbox=' + extent.join(',') + ',EPSG:3857';
        },
        strategy: bboxStrategy,
        crossOrigin: 'anonymous'
    }),

    style: new Style({
        fill: new Fill({
            color: [105, 107, 41, 0.1]
        }),

        stroke: new Stroke({
            color: 'rgba(107, 99, 89, 1.0)',
            width: 0.5
        })

    })

});



//Style Countries (label si vectors)

let styletext = new Style({

    text: new Text({
        font: '10px "Open Sans", "Arial Unicode MS", "sans-serif"',
        placement: 'point',
        overflow: true,
        fill: new Fill({
            color: 'black'
        }),

        stroke: new Stroke({
            color: '#fff',
            width: 3
        })
    })

});



let countryStyle = new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)'
    }),

    stroke: new Stroke({
        color: '#319FD3',
        width: 1
    })
});

let stylecountrylabel = [styletext, countryStyle];

//localgeojson
//style

var image1 = new CircleStyle({

    radius: 6,

    fill: new Fill({
        color: 'rgb(70,130,180, 0.5)',

        // color: 'rgba(145, 50, 255, 0.5)',
        // color: [10, 15, 145, 0.5]
    }),




    stroke: new Stroke({

        color: 'blue',

        width: 0.5

    })

});

let styles = {

    'Point': new Style({
        image: image1,
    }),

    fill: new Fill({
        color: 'rgba(145, 50, 255, 0.5)'
    })

};

let styleFunction = function (feature) {
    return styles[feature.getGeometry().getType()];
};





//geojson

let geojsonObject = {

    'type': 'FeatureCollection',

    'crs': { 'type': 'name', 'properties': { 'name': 'EPSG:4326' } },

    'features': [
        {
            'type': 'Feature', 'properties': {
                'name': 'Universitatea din Oradea,<br>Facultatea de Geografie, Turism și Sport<br><br> Adresa: Str. Universității Nr. 1 <br> Nume Masterat:Gestiunea și planificarea teritoriului asistate de GIS <br> Număr de Studenți:12 <br> Anul:2008<br> Scor: 8,6<br><br><I>Notele oferite de către studenții în cauză reflectă percepția fiecăruia, așadar au un grad de subiectivism ridicat, și trebuie tratate ca atare! </I><br>', 'linkx': "<a href= 'https://gts.uoradea.ro/ro/'>Facultatea de Geografie, Turism și Sport</a></a>", 'flag': "<center><img src=https://gts.uoradea.ro/images/GTS-125px.png><center>"
            }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([21.919435, 47.045299]) }
        },


        { 'type': 'Feature', 'properties': { 'name': 'Universitatea Babeș-Bolyai din Cluj Napoca,<br> Facultatea de Geografie <br><br> Adresa:Str.Clinicilor Nr. 5-7, RO- 400006, Cluj-Napoca <br> Nume Masterat:Geomatică <br> Număr de Studenți:39  <br> Anul:2003 <br> Scor:8,1<br><br><I>Notele oferite de către studenții în cauză reflectă percepția fiecăruia, așadar au un grad de subiectivism ridicat, și trebuie tratate ca atare!</I><br>', 'linkx': "<a href='https://www.ubbcluj.ro/ro/facultati/geografie'>Facultatea de Geografie</a>", 'flag': "<center><img src=https://geografie.ubbcluj.ro/images/geo-round-logo.png with= '125' height= '125'><center>" }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([23.5794566, 46.7645126]) } },

        { 'type': 'Feature', 'properties': { 'name': 'Universitatea de Vest din Timișoara, <br>Facultatea de Chimie, Biologie și Geografie <br><br> Adresa:Bulevardul Vasile Pârvan, nr.4,Timișoara, Romania  <br> Nume Masterat:Sisteme Informatice Geografice <br> Număr de Studenți: 11 <br> Anul:2009 <br> Scor:-<br><br><I>Notele oferite de către studenții în cauză reflectă percepția fiecăruia, așadar au un grad de subiectivism ridicat, și trebuie tratate ca atare!</I><br> ', 'linkx': "<a href='https://geografie.uvt.ro/'>Departamentul de Geografie</a>", 'flag': "<center><img src=https://geografie.uvt.ro/wp-content/uploads/2014/07/dep_geogra_tm.png width= '125' height= '125'><center>" }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([21.244848, 45.754146]) } },

        {
            'type': 'Feature', 'properties': {
                'name': 'Universitatea Ștefan cel Mare din Suceava, <br>Facultatea de Istorie și Geografie <br><br> Adresa:Str. Universitatii 13, 720229 Suceava <br> Nume Masterat:GIS și planificare teritorială <br> Număr de Studenți:11 <br> Anul:2008 <br> Scor:-<br><br><I>Notele oferite de către studenții în cauză reflectă percepția fiecăruia, așadar au un grad de subiectivism ridicat, și trebuie tratate ca atare!</I> <br>', 'linkx': "<a href='https://fig.usv.ro/'>Facultatea de Istorie și Geografie</a>", 'flag': "<center><img src=http://atlas.usv.ro/www/geografie/usv/images/Sigla%20Geografie.jpg width= '125' height= '125'><center>"
            }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([26.2457719, 47.6418641]) }
        },

        { 'type': 'Feature', 'properties': { 'name': 'Universitatea Alexandru Ioan Cuza din Iași, <br> Facultatea de Geografie și Geologie<br><br> Adresa:B-dul Carol I, Nr. 20 A, RO-700505 – Iaşi <br> Nume Masterat: Geomatică<br> Număr de Studenți:15 <br> Anul:2012 <br> Scor:6,8<br><br><I>Notele oferite de către studenții în cauză reflectă percepția fiecăruia, așadar au un grad de subiectivism ridicat, și trebuie tratate ca atare!</I><br>', 'linkx': "<a href='https://www.geo.uaic.ro/ro/'>Facultatea de Geografie</a>", 'flag': "<center><img src=https://www.uaic.ro/wp-content/uploads/2020/06/sigla-geografie-520x520-400x400.jpg width= '125' height= '125'><center>" }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([27.5717646, 47.175102]) } },

        { 'type': 'Feature', 'properties': { 'name': 'Universitatea din București, <br> Facultatea de Geografie <br><br> Adresa:Bd. Nicolae Bălcescu  Nr. 1, 010041, Sector 1, Bucureşti <br> Nume Masterat:Sisteme Informaționale Geografice <br> Număr de Studenți:39 <br> Anul:2011 <br> Scor:6,9<br><br><I>Notele oferite de către studenții în cauză reflectă percepția fiecăruia, așadar au un grad de subiectivism ridicat, și trebuie tratate ca atare!</I><br>', 'linkx': "<a href='https://geo.unibuc.ro/'>Facultatea de Geografie</a>", 'flag': "<center><img src=https://geo.unibuc.ro/images/siga-geo-fundal-inchis.png width= '125' height= '125'><center>" }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([26.099621, 44.436013]) } },

        { 'type': 'Feature', 'properties': { 'name': 'Universitatea Tehnică de Construcții din București, <br> Facultatea de Geodezie <br><br> Adresa:Bulevardul Lacul Tei 124, București 020396 <br> Nume Masterat: Panificare Spațială și GIS pentru Dezvoltare Durabilă<br> Număr de Studenți: 10 <br>Anul:2014 <br> Scor:6.7<br><br><I>Notele oferite de către studenții în cauză reflectă percepția fiecăruia, așadar au un grad de subiectivism ridicat, și trebuie tratate ca atare!</I><br>', 'linkx': "<a href='https://geodezie.utcb.ro/'>Facultatea de Geodezie</a>", 'flag': "<center><img src=https://geodezie.utcb.ro/wp-content/themes/utcb-v1/images/logo-utcb-ro.svg width= '150' height= '150'><center>" }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([26.1226049, 44.463182]) } },


    ]

};


//layer

let vectorSource = new VectorSource({
    features: (new GeoJSON()).readFeatures(geojsonObject)
});

let localgeojson = new VectorLayer({
    title: 'Local Geojson',
    source: vectorSource,
    visible: true,
    style: styleFunction,
    declutter: true
});

//Afisare
const map = new Map({
    target: 'map',
    overlays: [overlay],
    layers: [
        new LayerGroup({
            'title': 'Base maps',
            layers: [arcgis, graticule]
        }),
        new LayerGroup({
            title: 'Overlay WFS',
            layers: [vector4wfs, localgeojson],
        }),
    ],

    view: new View({
        projection: 'EPSG:3857',
        center: transform([25.003395, 45.563943], 'EPSG:4326', 'EPSG:3857'),

        zoom: 6.6
    }),
    controls: defaultControls({ attribution: false }).extend([
        new ZoomSlider(),

        new ZoomToExtent({
            extent: transform([11847730.116737, 1749516.199121,
                13119643.648371, 854286.622203], 'EPSG:3857', 'EPSG:4326')
        }),

        new ScaleLine({ units: 'metric' }),

        new FullScreen(),
        attribution
    ])
});
let layerSwitcher = new LayerSwitcher();
map.addControl(layerSwitcher);



/**
 * Add a click handler to the map to render the popup.
 */

map.on('singleclick', function (evt) {
    if (map.hasFeatureAtPixel(evt.pixel) === true) {
        let coordinate = evt.coordinate;
        let hdms = toStringHDMS(toLonLat(coordinate));
        let feature = map.getFeaturesAtPixel(evt.pixel)[0];
        let continut = feature.get('name');
        let continut1 = feature.get('linkx');
        let continut2 = feature.get('flag');
        let continut3 = feature.get('linkx');
        content.innerHTML = '<center><img src' + continut2 + '<br>Locația este: ' + continut + '<code><br>(' + hdms + ')</code>' + '<br />Detalii: ' + continut3;
        overlay.setPosition(coordinate);
    } else {
        overlay.setPosition(undefined);
        closer.blur();

    }
});

// {/* <b></b><br><br> */}
map.on('pointermove', function (evt) {
    if (map.hasFeatureAtPixel(evt.pixel)) {
        map.getViewport().style.cursor = 'pointer';
    } else {
        map.getViewport().style.cursor = 'inherit';

    }

});