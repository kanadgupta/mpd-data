// The Flat Data postprocessing libraries can be found at https://deno.land/x/flat/mod.ts
// Replace 'x' with latest library version
import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.15/mod.ts';

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
 * (e.g. "Race", "ForceType")
 * @param {Object} valueMappings An object with value mappings for renaming properties
 * (e.g. setting `null` Race values to `not recorded`)
 * @returns {Object} an object where the keys are the values of the `property`, and the values are the counts of the values in the array
 */
function getPropertyCounts(array, property, valueMappings = {}) {
  const output = {};
  array.forEach(event => {
    let value = event[property];
    if (valueMappings[value]) value = valueMappings[value];
    if (!output[value]) output[value] = 1;
    else output[value] = output[value] + 1;
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

const raceMappings = {
  null: 'Not Recorded',
  'not recorded': 'Not Recorded',
  'Pacific Islander': 'Other / Mixed Race',
  Asian: 'Other / Mixed Race',
};

const forceTypeMappings = {
  null: 'Unknown',
  'Less Lethal Projectile': 'Less Lethal',
};

const raceCounts = getPropertyCounts(jacobFreyProperties, 'Race', raceMappings);

// This is for the keys of the bar chart
const forceTypeCounts = getPropertyCounts(jacobFreyProperties, 'ForceType', forceTypeMappings);
const barKeys = Object.keys(forceTypeCounts).sort((a, b) => forceTypeCounts[b] - forceTypeCounts[a]);

const barObject = {};

jacobFreyProperties.forEach(property => {
  const { ForceType, Race } = property;
  // Remap race values accordingly
  let remappedRace = Race;
  if (raceMappings[Race]) remappedRace = raceMappings[Race];
  // Remap force type values accordingly
  let remappedForceType = ForceType;
  if (forceTypeMappings[ForceType]) remappedForceType = forceTypeMappings[ForceType];
  // create object for a race if it doesn't exist
  if (!Object.keys(barObject).includes(remappedRace)) {
    barObject[remappedRace] = {};
  }
  // increment force type counts for race object
  if (!barObject[remappedRace][remappedForceType]) barObject[remappedRace][remappedForceType] = 1;
  else barObject[remappedRace][remappedForceType] = barObject[remappedRace][remappedForceType] + 1;
});

// Convert object into nivo-friendly array of objects
const barData = Object.keys(barObject).map(id => {
  const objectToReturn = barObject[id];
  return { ...objectToReturn, id };
});

const pieData = Object.keys(raceCounts)
  .map(race => {
    const value = raceCounts[race];
    return { id: race, value };
  })
  .sort((a, b) => a.value - b.value);

await writeJSON(`${outDir}/calendar.json`, splitCalendarDataByYear());
await writeJSON(`${outDir}/pie.json`, pieData);
await writeJSON(`${outDir}/bar.json`, { data: barData, keys: barKeys });
