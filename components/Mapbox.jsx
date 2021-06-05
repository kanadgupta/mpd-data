import { useEffect, useState } from 'react';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

import styles from '../styles/Mapbox.module.css';

import { addDataLayer } from '../map/addDataLayer';
import { initializeMap } from '../map/initializeMap';

import geojson from '../postprocessed_data.json';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export default function Mapbox() {
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [mapbox, setMapbox] = useState();

  useEffect(() => {
    setPageIsMounted(true);
    const map = new mapboxgl.Map({
      container: 'mapbox',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-93.263197, 44.968732],
      zoom: 10,
      // maxBounds: [
      //   [-93.328085, 44.889979], // Southwest coordinates
      //   [-93.203115, 45.050046], // Northeast coordinates
      // ],
    });

    initializeMap(mapboxgl, map);
    setMapbox(map);
  }, []);

  useEffect(() => {
    if (pageIsMounted && geojson && mapbox) {
      mapbox.on('load', function () {
        addDataLayer(mapbox, geojson);
      });
    }
  }, [mapbox, pageIsMounted]);

  return <div className={styles.mapbox} id="mapbox" />;
}
