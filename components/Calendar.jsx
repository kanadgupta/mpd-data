import { ResponsiveCalendar } from '@nivo/calendar';

import calData from '../data/processed/groupedByDate/calendar.json';

const oranges = ['#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'];

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
    yearSpacing={40}
  />
);

export default Calendar;
