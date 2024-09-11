// import { promises as fs } from 'fs';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import crypto from 'crypto';


import sharp from 'sharp';

async function compressPngImages() {
  // get command line arguments
  const inputDir = './assets/outreach/x';
  const outputDir = './../public/images/en';

  // Define format configurations
  const formatConfigs = [
    { format: 'avif', quality: 60 },
    { format: 'webp', quality: 60 },
    // { format: 'jpeg', quality: 60 },
  ];
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

async function createMD5(filePath) {
  const hash = crypto.createHash('md5');
  const fileStream = fs.createReadStream(filePath);

  for await (const chunk of fileStream) {
    hash.update(chunk);
  }

  return hash.digest('hex');
}

async function processFiles() {
  // Input JSON structure
  const hash = crypto.createHash('md5');
  const langImagesArray = [{
    "lang": "en",
    "filenames": [
      "./../public/images/en/0_1_kindness_first.webp",
      "./../public/images/en/0_2_fairness_always.webp",
      "./../public/images/en/0_3_duki_in_action.webp",
      "./../public/images/en/0_ordinary_kindkang_invitation.webp",
      "./../public/images/en/1_thoughts_on_media_responsibility.webp",
      "./../public/images/en/2_thoughts_on_war_and_peace.webp",
      "./../public/images/en/3_evolutionary_perspective_why_kindness_fairness_and_duki_worldwide.webp",
      "./../public/images/en/4_what_is_duki.webp",
      "./../public/images/en/5_why_duki_instead_of_ubi.webp",
      "./../public/images/en/6_thoughts_on_us_selection.webp",
      "./../public/images/en/7_thoughts_on_entrepreneurs_and_duki.webp",
      "./../public/images/en/8_thoughts_on_mooc_and_duki.webp",
      "./../public/images/en/9_thoughts_on_duki_governments_and_immigration_policy.webp",
      "./../public/images/en/10_thoughts_on_duki_and_open_source.webp",
      "./../public/images/en/11_thoughts_on_duki_blockchain_and_authority.webp",
      "./../public/images/en/12_O_Come_O_Come_Emmanuel.webp"
    ]
  }];

  const metadataOutputPath = "./../src/assets/metadata.json";


  const meta_data = {};

  for (const obj of langImagesArray) {
    const langOutputBlobPath = `./../public/${obj.lang}.blob`;
    const writeStream = fs.createWriteStream(langOutputBlobPath);
    let startOffset = 0;

    const lang = obj.lang;
    const filenames = obj.filenames;

    console.log(`Processing group: ${lang}`);
    console.log(`Files: ${filenames.join(", ")}`);

    meta_data[lang] = {
      "files": {} // key, base_name, range:[int]
      //   {"file_group": "love", "files": [   { "base_name": "0_1_kindness_first.webp","range": [ 0, 108407] } ] }
    };

    for (const filename of filenames) {
      const data = await fsPromises.readFile(filename);
      const size = data.length; // Get size directly from the buffer

      // Write file data to the output blob
      writeStream.write(data);
      // Extract base file name without extension
      const baseName = path.basename(filename);
      const fileExt = path.extname(baseName);
      const baseNameWithoutExt = baseName.slice(0, -fileExt.length);

      // Add metadata for the file with range
      meta_data[lang]["files"][baseNameWithoutExt] = {
        base_name: baseName,
        range: [startOffset, startOffset + size]
      };

      startOffset += size;
    }
    // End the write stream
    writeStream.end();

    // Wait for the stream to finish
    await new Promise((resolve) => writeStream.on('finish', resolve));
    // Calculate MD5 hash of the final output file
    const md5Hash = await createMD5(langOutputBlobPath);
    // rename the output file to md5 hash.blob
    const newBlobPath = langOutputBlobPath.replace(`${obj.lang}.blob`, `${obj.lang}_${md5Hash}.blob`);

    await fsPromises.rename(langOutputBlobPath, newBlobPath);

    meta_data[lang]["hash"] = md5Hash;
    meta_data[lang]["blob_uri"] = newBlobPath

  }

  // Write metadata to a JSON file
  await fsPromises.writeFile(metadataOutputPath, JSON.stringify(meta_data, null, 2));

  console.log("Merging complete. Metadata and blob files generated.");
}

// Run the function
// extractFilesFromBlob().catch(console.error);


// Run the function
await processFiles().catch(console.error);

// await extractFilesFromBlob();

// compressPngImages();