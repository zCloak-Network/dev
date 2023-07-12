// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import path from 'path';
import { pathToFileURL } from 'url';

export function importPath(req) {
  return pathToFileURL(path.join(process.cwd(), 'node_modules', req)).toString();
}

export async function importDirect(bin, req) {
  console.log(`$ ${bin} ${process.argv.slice(2).join(' ')}`);

  try {
    const mod = await import(req);

    return mod;
  } catch (error) {
    console.error(`Error importing ${req}`);
    console.error(error);
    process.exit(1);
  }
}

export function importRelative(bin, req) {
  return importDirect(bin, importPath(req));
}
