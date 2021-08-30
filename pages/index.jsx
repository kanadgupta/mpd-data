import Head from 'next/head';
import styles from '@styles/Home.module.css';

import AnimatedNumber from '@components/AnimatedNumber';
import Calendar from '@components/Calendar';
import Pie from '@components/Pie';

// Not sure why this is failing, I have it in jsconfig.json?
// eslint-disable-next-line import/no-unresolved
import useWindowSize from '@hooks/useWindowSize';

import calData from '../data/processed/calendar.json';
import pieData from '../data/processed/pie.json';

const Main = () => {
  const { width } = useWindowSize();
  const isMobile = width < 600;

  // TODO: return these in summary JSON file!
  const sum = calData.flat().reduce((prev, current) => {
    return prev + current.originalValue;
  }, 0);
  const blackSum = pieData.find(x => x.id === 'Black').value;

  return (
    <div className={styles.container}>
      <Head>
        <title>MPD Use of Force</title>
        <link href="https://fav.farm/🐽" rel="icon" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet"></link>
      </Head>

      <h2 className="title-heading">
        Since Jacob Frey became the Mayor of Minneapolis in 2018,
        <br />
        the Minneapolis Police Department have self-reported <AnimatedNumber>{sum}</AnimatedNumber> cases.
      </h2>

      <div className={styles.main}>
        <Calendar isMobile={isMobile} />
        <div className="pie-section">
          <p>
            Despite making up XX% of the city population, {((blackSum / sum) * 100).toFixed(0)}% of all victims are
            Black.
          </p>
          <div className="pie-block">
            <Pie />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
