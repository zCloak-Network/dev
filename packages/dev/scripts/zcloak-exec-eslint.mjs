#!/usr/bin/env node
// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { importRelative } from './import.mjs';

await importRelative('eslint', 'eslint/bin/eslint.js');
