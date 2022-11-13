// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { readFile } from 'fs';

export async function readFileAsync(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(file, (err1: Error | null, data: Buffer) => {
      try {
        if (err1) {
          reject(err1);
        } else {
          resolve(data.toString());
        }
      } catch (err2) {
        reject(err2);
      }
    });
  });
}
