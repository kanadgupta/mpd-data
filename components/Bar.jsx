import { ResponsiveBar } from '@nivo/bar';

import barData from '../data/processed/bar.json';

const Bar = () => (
  <ResponsiveBar
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0, // TODO: tweak this to make it mobile friendly
      legend: '# of force events',
      legendPosition: 'middle',
      legendOffset: 40, // TODO: tweak this to make it mobile friendly
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'race',
      legendPosition: 'middle',
      legendOffset: -60,
    }}
    data={barData.data}
    indexScale={{ type: 'band', round: true }}
    keys={barData.keys}
    labelSkipHeight={12}
    labelSkipWidth={12}
    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    // TODO: remove legend if mobile?
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: 'left-to-right',
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: 'hover',
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    margin={{ top: 50, right: 200, bottom: 50, left: 75 }} // TODO: tweak bottom value to make it mobile friendly
    valueScale={{ type: 'linear' }}
  />
);

export default Bar;
