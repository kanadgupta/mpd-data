import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useEffect, useState } from 'react';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

import { addDataLayer } from '../map/addDataLayer';
import { initializeMap } from '../map/initializeMap';

import geojson from '../postprocessed_data.json';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export default function Home() {
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [Mapbox, setMapbox] = useState();

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
    if (pageIsMounted && geojson && Mapbox) {
      Mapbox.on('load', function () {
        addDataLayer(Mapbox, geojson);
      });
    }
  }, [Mapbox, pageIsMounted]);

  return (
    <div className={styles.container}>
      <Head>
        <title>MPD Data</title>
        <link href="/favicon.ico" rel="icon" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
        <div className={styles.mapbox} id="mapbox" />
      </main>
    </div>
  );
}
