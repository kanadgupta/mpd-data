import Head from 'next/head';
import styles from '@styles/Home.module.css';

import LineGraph from '@components/LineGraph';

const Line = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>MPD Data</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <LineGraph />
      </main>
    </div>
  );
};

export default Line;
