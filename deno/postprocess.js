// The Flat Data postprocessing libraries can be found at https://deno.land/x/flat/mod.ts
// Replace 'x' with latest library version
import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.10/mod.ts';

const filename = Deno.args[0]; // equivalent to writing `const filename = 'btc-price.json'`
const data = await readJSON(filename);

const outDir = 'data/processed';

// TODO: determine which data points should be filtered out
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

await writeJSON(`${outDir}/groupedByDate/calendar.json`, calendarData);
