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

// this returns an object with dates as keys
// the values are an array of objects where each object is the raw property
const groupedByDate = currentYearProperties.reduce((groups, event) => {
  const date = event.ResponseDate.split('T')[0];
  if (!groups[date]) {
    groups[date] = [];
  }
  groups[date].push(event);
  return groups;
}, {});


// Logic for preparing data for chart by date
const groupedByDateCountLabels = [];
const groupedByDateCountValues = [];

const groupedByDateCount = Object.keys(groupedByDate)
  .sort()
  .map(date => {
    const value = groupedByDate[date].length;
    groupedByDateCountLabels.push(date);
    groupedByDateCountValues.push(value);
    return { date, count: groupedByDate[date].length };
  });

const groupedByDateCountOutput = { labels: groupedByDateCountLabels, values: groupedByDateCountValues };

await writeJSON(`${outDir}/groupedByDate/raw.json`, groupedByDate);
await writeJSON(`${outDir}/groupedByDate/count.json`, groupedByDateCount);
await writeJSON(`${outDir}/groupedByDate/chart.json`, groupedByDateCountOutput);
