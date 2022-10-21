#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { __dirname } from './dirname.mjs';
import execSync from './execSync.mjs';

console.log('$ zcloak-dev-run-prettier', process.argv.slice(2).join(' '));

execSync(`yarn zcloak-exec-prettier --write ${__dirname}`);
