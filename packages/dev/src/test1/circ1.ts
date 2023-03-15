// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { circ2 } from './circ2.js';

// we leave this as a warning... just a test
export function circ1(): number {
  circ2();

  return 123;
}
