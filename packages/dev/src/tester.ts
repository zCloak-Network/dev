// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { tester } from './index.js';

tester();

console.log('  (2)', typeof require === 'undefined' ? 'esm' : 'cjs');
