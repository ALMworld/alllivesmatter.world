import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input and output file paths
const inputFile = path.join(__dirname, 'countries.json');
const outputFile = path.join(__dirname, '../src/assets/countries.json');

const propertiesToKeep = [
  'LABEL_X', 'LABEL_Y','NAME'
];

async function convertCountries() {
  try {
    // Read the original JSON file
    const data = await fs.readFile(inputFile, 'utf8');
    const countriesData = JSON.parse(data);
    
    // Simplify the features
    countriesData.features = countriesData.features.map(feature => ({
      type: feature.type,
      properties: Object.fromEntries(
        Object.entries(feature.properties)
          .filter(([key]) => propertiesToKeep.includes(key))
          .map(([key, value]) => [
            key, 
            value
          ])
      ),
      bbox: feature.bbox,
      geometry: feature.geometry
    }));

    // Write the simplified data to a new JSON file
    await fs.writeFile(outputFile, JSON.stringify(countriesData), 'utf8');
    console.log('Simplified countries data has been saved to', outputFile);

  } catch (error) {
    console.error('Error:', error);
  }
}

convertCountries();