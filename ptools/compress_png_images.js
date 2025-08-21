// import { promises as fs } from 'fs';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import crypto from 'crypto';

import sharp from 'sharp';

async function compressPngImages(inputDir = "./assets/outreach/x",
                                 outputDir="'./../../public/images",
                                 formatConfigs) {
  try {
    // get command line arguments
    // const outputDir = './../public/images/en/';

    // Define format configurations
    const formatConfigs = [
      // { format: 'avif', quality: 60 },
      { format: 'webp', quality: 60 },
      // { format: 'jpeg', quality: 98 },
    ];

    await fsPromises.mkdir(outputDir, { recursive: true });
    const entries = await fsPromises.readdir(inputDir, { withFileTypes: true });

    const inputImageExtensions = ['.png', '.jpeg', '.jpg', '.svg'];

    for (const entry of entries) {
      const inputPath = path.join(inputDir, entry.name);
      const relativePath = path.relative(inputDir, inputPath);
      const outputPath = path.join(outputDir, relativePath);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        await compressPngImages(inputPath, outputPath, formatConfigs);
      } else if (entry.isFile() && inputImageExtensions.includes(path.extname(entry.name).toLowerCase())) {
        const fileName = path.parse(entry.name).name;

        for (const config of formatConfigs) {
          const { format, quality } = config;
          const outputFilePath = path.join(outputPath, `..`, `${fileName}.${format}`);

          // Check if the target file already exists
          try {
            await fsPromises.access(outputFilePath);
            console.log(`Skipping ${entry.name} to ${format}, file already exists.`);
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
              default:
                console.warn(`Unsupported format: ${format}. Skipping.`);
                continue;
            }

            await fsPromises.mkdir(path.dirname(outputFilePath), { recursive: true });
            await sharpInstance.toFile(outputFilePath);
            console.log(`Converted ${entry.name} to ${format}`);
          } catch (error) {
            console.error(`Error converting ${entry.name} to ${format}:`, error);
          }
        }
      }
    }
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
      // "./../public/images/en/0_kindkang_invitation_to_good_will_world.webp",
      // "./../public/images/en/1_thoughts_on_media_responsibility.webp",
      // "./../public/images/en/2_thoughts_on_war_and_peace.webp",
      // "./../public/images/en/3_evolutionary_perspective_why_kindness_fairness_and_duki_worldwide.webp",
      // "./../public/images/en/4_what_is_duki.webp",
      // "./../public/images/en/5_why_duki_instead_of_ubi.webp",
      // "./../public/images/en/6_thoughts_on_us_selection.webp",
      // "./../public/images/en/7_thoughts_on_entrepreneurs_and_duki.webp",
      // "./../public/images/en/8_thoughts_on_mooc_and_duki.webp",
      // "./../public/images/en/9_thoughts_on_duki_governments_and_immigration_policy.webp",
      // "./../public/images/en/10_thoughts_on_duki_and_open_source.webp",
      // "./../public/images/en/11_thoughts_on_duki_blockchain_and_authority.webp",
      // "./../public/images/en/12_O_Come_O_Come_Emmanuel.webp",
      "./../public/images/en/symbols/Duality_love_is_the_dao.webp",
      "./../public/images/en/symbols/Duality_happy_dussehra.webp",
      "./../public/images/en/symbols/Duality_DivineCouple_NuwaFuxi.webp",
      "./../public/images/en/symbols/Masonic_SquareCompassesG.webp",
      "./../public/images/en/symbols/PlantsVsZombies.webp",
      "./../public/images/en/symbols/HumanAsLove.webp",
      "./../public/images/en/symbols/Ultraman.webp",
      "./../public/images/en/symbols/UltramanZero.webp",
      // "./../public/images/en/open_thanks_letters/1_Thanks_Letter_for_Tommee_Profitt.webp",
      // "./../public/images/en/open_thanks_letters/2_Thanks_Letter_for_BLM_Movement.webp",
      // "./../public/images/en/open_thanks_letters/3_Thanks_Letter_for_Donald_Trump.webp",
      // "./../public/images/en/open_thanks_letters/4_Thanks_Letter_for_Richard_Dawkins.webp",
      // "./../public/images/en/open_thanks_letters/5_Thanks_Letter_for_Robert_Axelrod.webp",
      // "./../public/images/en/open_thanks_letters/6_Thanks_Letter_for_Elon_Musk.webp",
      // "./../public/images/en/open_thanks_letters/7_Thanks_Letter_for_Karl_Widerquist.webp",
      // "./../public/images/en/open_thanks_letters/8_Thanks_Letter_for_WorldID.webp",
      // "./../public/images/en/open_thanks_letters/9_Thanks_Letter_for_Avi_Wigderson.webp",
      "./../public/images/en/open_thanks_letters/10_Thanks_Letter_for_The_Unknownable.webp"
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

    meta_data[lang]["hash"] =`${obj.lang}_${md5Hash}`;
    meta_data[lang]["env_prod"] = true

  }

  // Write metadata to a JSON file
  await fsPromises.writeFile(metadataOutputPath, JSON.stringify(meta_data, null, 2));

  console.log("Merging complete. Metadata and blob files generated.");
}

// Run the function
// extractFilesFromBlob().catch(console.error);


compressPngImages();

// Run the function
await processFiles().catch(console.error);
