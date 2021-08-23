import { ResponsiveLine } from '@nivo/line';

import data from '../data/processed/groupedByMonth/line.json';

const LineGraph = () => (
  <ResponsiveLine
    axisBottom={{
      format: '%b %Y',
      tickValues: 'every 3 months',
      legendOffset: -12,
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: '%',
      legendOffset: -40,
      legendPosition: 'middle',
    }}
    curve="monotoneX"
    data={data}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    useMesh={true}
    xFormat="time:%b %Y"
    xScale={{
      type: 'time',
      format: '%Y-%m',
      precision: 'day',
    }}
  />
);

export default LineGraph;
