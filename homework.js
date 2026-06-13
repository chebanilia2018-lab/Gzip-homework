console.log('#58. JavaScript homework example file');

import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { createGzip, createGunzip } from 'zlib';


async function makeFreeName(fileName) {
  let currentName = fileName;
  let index = 1;

  while (true) {
    try {
      await fsPromises.access(currentName);

      const parsed = path.parse(fileName);

      currentName = path.join(
        parsed.dir,
        `${parsed.name}_${index}${parsed.ext}`
      );

      index++;
    } catch {
      return currentName;
    }
  }
}


async function compressFile(filePath) {
  try {
    await fsPromises.access(filePath);

    const outFile = await makeFreeName(filePath + '.gz');

    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(outFile);
    const gzip = createGzip();

    input.pipe(gzip).pipe(output);

   
    output.on('finish', () => {
      console.log('File compressed:', outFile);
    });

    return outFile;

  } catch (error) {
    throw new Error('Cannot compress file: ' + error.message);
  }
}


async function decompressFile(compressedFilePath, destinationFilePath) {
  try {
    await fsPromises.access(compressedFilePath);

    const outFile = await makeFreeName(destinationFilePath);

    const input = fs.createReadStream(compressedFilePath);
    const output = fs.createWriteStream(outFile);
    const gunzip = createGunzip();

    input.pipe(gunzip).pipe(output);

    output.on('finish', () => {
      console.log('File decompressed:', outFile);
    });

    return outFile;

  } catch (error) {
    throw new Error('Cannot decompress file: ' + error.message);
  }
}


export { compressFile, decompressFile };