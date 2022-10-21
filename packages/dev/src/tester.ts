// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { tester } from '.';

tester();

console.log('  (2)', typeof require === 'undefined' ? 'esm' : 'cjs');
