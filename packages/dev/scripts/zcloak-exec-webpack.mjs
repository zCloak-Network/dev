#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import execSync from './execSync.mjs';

const args = process.argv.slice(2).join(' ');

execSync(`yarn webpack ${args}`);
