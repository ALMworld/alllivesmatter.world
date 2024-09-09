import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

async function compressPngImages(inputDir, outputDir, formatConfigs) {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    const files = await fs.readdir(inputDir);
    const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');

    if (pngFiles.length === 0) {
      console.log('No PNG files found in the input directory.');
      return;
    }

    for (const file of pngFiles) {
      const inputPath = path.join(inputDir, file);
      const fileName = path.parse(file).name;

      for (const config of formatConfigs) {
        const { format, quality } = config;
        const outputPath = path.join(outputDir, `${fileName}.${format}`);

        // Check if the target file already exists
        try {
          await fs.access(outputPath);
          console.log(`Skipping ${file} to ${format}, file already exists.`);
          continue; // Skip to the next format if file exists
        } catch (error) {
          // File doesn't exist, proceed with conversion
        }

        try {
          let sharpInstance = sharp(inputPath);

          switch (format) {
            case 'avif':
              sharpInstance = sharpInstance.avif({ quality, effort: 9 });
              break;
            case 'webp':
              sharpInstance = sharpInstance.webp({ quality, lossless: false });
              break;
            case 'jpeg':
            case 'jpg':
              sharpInstance = sharpInstance.jpeg({ quality });
              break;
            // Add more cases here for other formats if needed
            default:
              console.warn(`Unsupported format: ${format}. Skipping.`);
              continue;
          }

          await sharpInstance.toFile(outputPath);
          console.log(`Converted ${file} to ${format}`);
        } catch (error) {
          console.error(`Error converting ${file} to ${format}:`, error);
        }
      }
    }

    console.log('Conversion completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Get command line arguments
const inputDir = process.argv[2] || './assets/outreach/x';
const outputDir = process.argv[3] || './../public/images/en';

// Define format configurations
const formatConfigs = [
  { format: 'avif', quality: 60 },
  { format: 'webp', quality: 60 },
  // { format: 'jpeg', quality: 60 },
];

compressPngImages(inputDir, outputDir, formatConfigs);