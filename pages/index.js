import Head from 'next/head';
import styles from '@styles/Home.module.css';

import Mapbox from '@components/Mapbox';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>MPD Data</title>
        <link href="/favicon.ico" rel="icon" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
        <Mapbox />
      </main>
    </div>
  );
}
