/* eslint-disable react/prop-types */
import { ResponsiveCalendar } from '@nivo/calendar';

import calData from '../data/processed/groupedByDate/calendar.json';

const oranges = ['#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'];

const significantDates = {
  '2020-05-26': (
    <>
      <div>George Floyd was killed the day before.</div>
      <br />
      <div>
        <b>No use-of-force events were recorded on the day he was killed.</b>
      </div>
    </>
  ),
  '2020-05-28': 'The 3rd precinct burned down.',
  '2021-04-12': 'Daunte Wright was killed the day before (April 11th).',
  '2021-06-04': 'Winston Smith was killed the day before (June 3rd).',
};

const Tooltip = ({ data }) => (
  <div className="calendar-tooltip">
    {data.data.originalValue !== parseInt(data.value, 10) ? (
      <div>
        <b>Disclaimer:</b> Due to this date being at the beginning of the year,&nbsp;
        <b>{data.data.originalValue}</b> incidents were <i>(most likely incorrectly)</i> reported on this day.
      </div>
    ) : (
      <div>
        <b>{data.date.toDateString()}</b>: The police used force against <b>{data.value}</b> people.
      </div>
    )}
    {Object.keys(significantDates).includes(data.day) && (
      <>
        <br />
        <div>
          {typeof significantDates[data.day] === 'string' ? (
            <b>{significantDates[data.day]}</b>
          ) : (
            significantDates[data.day]
          )}
        </div>
      </>
    )}
  </div>
);

const Calendar = () => (
  <ResponsiveCalendar
    colors={oranges}
    data={calData}
    dayBorderColor="#ffffff"
    dayBorderWidth={2}
    emptyColor="#eeeeee"
    from="2018-01-02"
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'row',
        translateY: 36,
        itemCount: 4,
        itemWidth: 42,
        itemHeight: 36,
        itemsSpacing: 14,
        itemDirection: 'right-to-left',
      },
    ]}
    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
    monthBorderColor="#ffffff"
    to="2021-08-18"
    tooltip={data => <Tooltip data={data} />}
    yearSpacing={40}
  />
);

export default Calendar;
