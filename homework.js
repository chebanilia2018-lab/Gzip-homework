import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { createGzip, createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';

async function makeFreeName(fileName) {
  let currentName = fileName;
  let index = 1;

  while (true) {
    try {
      await fsPromises.access(currentName);

      const parsedFile = path.parse(fileName);

      currentName = path.join(
        parsedFile.dir,
        `${parsedFile.name}_${index}${parsedFile.ext}`
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

    const archivePath = await makeFreeName(`${filePath}.gz`);

    await pipeline(
      fs.createReadStream(filePath),
      createGzip(),
      fs.createWriteStream(archivePath)
    );

    return archivePath;
  } catch (error) {
    throw new Error(`Cannot compress file: ${error.message}`);
  }
}

async function decompressFile(compressedFilePath, destinationFilePath) {
  try {
    await fsPromises.access(compressedFilePath);

    const resultPath = await makeFreeName(destinationFilePath);

    await pipeline(
      fs.createReadStream(compressedFilePath),
      createGunzip(),
      fs.createWriteStream(resultPath)
    );

    return resultPath;
  } catch (error) {
    throw new Error(`Cannot decompress file: ${error.message}`);
  }
}

export { compressFile, decompressFile };