import { ResponsiveCalendar } from '@nivo/calendar';
import PropTypes from 'prop-types';

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

const defaultProps = {
  colors: oranges,
  dayBorderColor: '#ffffff',
  dayBorderWidth: 2,
  emptyColor: '#eeeeee',
  monthBorderColor: '#ffffff',
  // eslint-disable-next-line react/display-name
  tooltip: data => <Tooltip data={data} />,
};

const CalendarItem = ({ data, ...props }) => {
  let from = data[0].day;
  const [fromYear, fromMonth, fromDay] = from.split('-');
  if (fromMonth === '01' && fromDay === '01') from = `${fromYear}-01-02`;
  const to = data[data.length - 1].day;
  return <ResponsiveCalendar data={data} from={from} to={to} {...defaultProps} {...props} />;
};

const Calendar = ({ isMobile = false }) =>
  isMobile ? (
    <>
      {calData.map((yearData, i) => (
        <div key={i} className="cal-block">
          <CalendarItem data={yearData} direction="vertical" margin={{ top: 40, right: 40, bottom: 40, left: 40 }} />
        </div>
      ))}
    </>
  ) : (
    <div className="cal-block">
      <CalendarItem data={calData.flat()} margin={{ top: 0, right: 20, bottom: 0, left: 20 }} yearSpacing={50} />
    </div>
  );

Calendar.propTypes = {
  isMobile: PropTypes.bool,
};

CalendarItem.propTypes = {
  data: PropTypes.array,
};

Tooltip.propTypes = {
  data: PropTypes.shape({
    color: PropTypes.string,
    data: PropTypes.object,
    date: PropTypes.Date,
    day: PropTypes.string,
    size: PropTypes.number,
    value: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

export default Calendar;
