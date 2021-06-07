// The Flat Data postprocessing libraries can be found at https://deno.land/x/flat/mod.ts
// Replace 'x' with latest library version
import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.10/mod.ts';

const filename = Deno.args[0]; // equivalent to writing `const filename = 'btc-price.json'`
const data = await readJSON(filename);

const outDir = 'data/processed';

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
