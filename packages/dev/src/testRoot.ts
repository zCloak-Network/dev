// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as pkg from '../package.json';

/**
 * This is the description with another line
 *
 * ```
 * const test = require('./test');
 *
 * test(); // => nothing
 * ```
 */
export function test(): void {
  console.log(pkg.version);
}
