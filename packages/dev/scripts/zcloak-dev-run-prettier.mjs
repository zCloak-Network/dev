#!/usr/bin/env node
// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { __dirname } from './dirname.mjs';
import { execSync } from './execute.mjs';

console.log('$ zcloak-dev-run-prettier', process.argv.slice(2).join(' '));

execSync(`yarn zcloak-exec-prettier --write ${__dirname}`);
