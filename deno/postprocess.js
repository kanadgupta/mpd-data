// The Flat Data postprocessing libraries can be found at https://deno.land/x/flat/mod.ts
// Replace 'x' with latest library version
import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.10/mod.ts';

const filename = Deno.args[0]; // equivalent to writing `const filename = 'btc-price.json'`
const data = await readJSON(filename);

const outDir = 'data/processed';

// TODO: determine which data points should be filtered out
// Clean out any dirty data (e.g. does not contain actual geographic points)

// Filter geojson for data in current year
const currentYear = new Date().getFullYear();
const currentYearFeatures = data.features.filter(feat => {
  if (feat.properties.ResponseDate) {
    const year = new Date(feat.properties.ResponseDate).getFullYear();
    return year === currentYear;
  }
  return false;
});

const currentYearGeoJson = {
  features: currentYearFeatures,
  name: 'Police_Use_of_Force',
  type: 'FeatureCollection',
};

await writeJSON(`${outDir}/year.json`, currentYearGeoJson);

// Of the current year data set, only return metadata
const currentYearProperties = currentYearFeatures.map(feat => feat.properties);
await writeJSON(`${outDir}/properties.json`, currentYearProperties);

// Filter geojson for data in Jacob's term
const firstDayOfJacobsTerm = new Date('2018-01-02');
const jacobFreyFeatures = data.features.filter(feat => {
  if (feat.properties.ResponseDate) {
    const respDate = new Date(feat.properties.ResponseDate);
    return firstDayOfJacobsTerm < respDate;
  }
  return false;
});

// Of the current year data set, only return metadata
const jacobFreyProperties = jacobFreyFeatures.map(feat => feat.properties);

// this returns an object with dates as keys
// the values are an array of objects where each object is the raw property
const groupedByDate = jacobFreyProperties.reduce((groups, event) => {
  const date = event.ResponseDate.split('T')[0];
  if (!groups[date]) {
    groups[date] = [];
  }
  groups[date].push(event);
  return groups;
}, {});

const groupedByDateSortedKeys = Object.keys(groupedByDate).sort();

const naughtyDates = ['2019-01-01', '2020-01-01', '2021-01-01'];

const calendarData = groupedByDateSortedKeys.map(day => {
  let value = groupedByDate[day].length;
  // There are reporting errors on these days which skew the visualization,
  // so we're normalizing the data a bit here.
  if (naughtyDates.includes(day)) {
    value = 10;
  }
  return { day, value, events: groupedByDate[day] };
});

// this returns an object with months as keys
// the values are an array of objects where each object is the raw property
const groupedByMonth = jacobFreyProperties.reduce((groups, event) => {
  const month = event.ResponseDate.split(/-\d\dT/)[0];
  if (!groups[month]) {
    groups[month] = [];
  }
  groups[month].push(event);
  return groups;
}, {});

const groupedByMonthSortedKeys = Object.keys(groupedByMonth).sort();

function getLineGraphRacePercentageData(raceArray) {
  return groupedByMonthSortedKeys
    .map(month => {
      // Get event objects and filter out the bad ones
      const events = groupedByMonth[month].filter(event => {
        const date = event.ResponseDate.split('T')[0];
        return !naughtyDates.includes(date);
      });
      // Various ways that we are defining "unknown" here
      const unknownRaceEvents = events.filter(event => raceArray.includes(event.Race));
      if (events.length < 10) return false;

      return { x: month, y: unknownRaceEvents.length / events.length };
    })
    .filter(x => x);
}

const lineData = [
  {
    id: 'Unknown / Not Recorded',
    data: getLineGraphRacePercentageData(['not recorded', 'Unknown', null]),
  },
  {
    id: 'Black',
    data: getLineGraphRacePercentageData(['Black']),
  },
  {
    id: 'White',
    data: getLineGraphRacePercentageData(['White']),
  },
  {
    id: 'Native American',
    data: getLineGraphRacePercentageData(['Native American']),
  },
];

await writeJSON(`${outDir}/groupedByDate/calendar.json`, calendarData);
await writeJSON(`${outDir}/groupedByMonth/line.json`, lineData);
