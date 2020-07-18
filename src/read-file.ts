import * as fs from "fs";

/**
 * Asynchronously reads the specified file and returns its contents as a string.
 */
export async function readFile(path: string, encoding: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, contents) => err ? reject(err) : resolve(contents));
  });
}
