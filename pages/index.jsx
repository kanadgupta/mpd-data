import Head from 'next/head';
import styles from '@styles/Home.module.css';

import Calendar from '@components/Calendar';

const Main = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>MPD Data</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <Calendar />
      </main>
    </div>
  );
};

export default Main;
