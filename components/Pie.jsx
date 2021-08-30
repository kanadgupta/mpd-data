import { ResponsivePie } from '@nivo/pie';

import pieData from '../data/processed/groupedByDate/pie.json';

const Pie = () => (
  <ResponsivePie
    activeOuterRadiusOffset={8}
    arcLinkLabelsThickness={2}
    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
    borderWidth={1}
    colors={{ scheme: 'oranges' }}
    cornerRadius={3}
    data={pieData}
    enableArcLinkLabels={false}
    innerRadius={0.5}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    padAngle={0.7}
  />
);

export default Pie;
