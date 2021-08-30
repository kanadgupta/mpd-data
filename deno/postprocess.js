// The Flat Data postprocessing libraries can be found at https://deno.land/x/flat/mod.ts
// Replace 'x' with latest library version
import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.10/mod.ts';

const filename = Deno.args[0]; // equivalent to writing `const filename = 'btc-price.json'`
const data = await readJSON(filename);

const outDir = 'data/processed';

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

/**
 * Returns the counts of each value of the given property (used in pie charts)
 * @param {Array} array An array of objects, where the objects contain the `property`
 * @param {string} property The key of the object to return the unique values of
 * @returns {Object} an object where the keys are the values of the `property`, and the values are the counts of the values in the array
 */
function getPropertyCounts(array, property) {
  const output = {};
  array.forEach(event => {
    if (!output[event[property]]) output[event[property]] = 1;
    else output[event[property]] = output[event[property]] + 1;
  });
  return output;
}

const calendarData = groupedByDateSortedKeys.map(day => {
  const events = groupedByDate[day];
  let value = events.length;
  // There are reporting errors on these days which skew the visualization,
  // so we're normalizing the data a bit here.
  if (naughtyDates.includes(day)) {
    value = 10;
  }
  return { day, value, originalValue: events.length };
});

/**
 * Takes in an array of calendar-formatted data and splits the array by year
 * @returns an array of arrays, where each array is the formatted calendar data for a single year
 */
function splitCalendarDataByYear() {
  const calendarDataSplitByYear = [];

  let firstArrayIndex = 0;
  let currYear = 2018;

  // We're assuming that calendarData is sorted by day
  calendarData.forEach((item, index) => {
    const year = item.day.split('-')[0];

    // This means we're in a new year :tada:
    if (year !== currYear.toString()) {
      calendarDataSplitByYear.push(calendarData.slice(firstArrayIndex, index - 1));
      firstArrayIndex = index;
      currYear = currYear + 1;
    }
  });

  // If there are any dates left over in current year, add those as well
  if (firstArrayIndex <= calendarData.length) {
    calendarDataSplitByYear.push(calendarData.slice(firstArrayIndex));
  }

  return calendarDataSplitByYear;
}

const raceCounts = getPropertyCounts(jacobFreyProperties, 'Race');

const pieData = Object.keys(raceCounts)
  .map(race => {
    const value = raceCounts[race];
    return { id: race, value };
  })
  .sort((a, b) => a.value - b.value);

await writeJSON(`${outDir}/groupedByDate/calendar.json`, splitCalendarDataByYear());
await writeJSON(`${outDir}/groupedByDate/pie.json`, pieData);
