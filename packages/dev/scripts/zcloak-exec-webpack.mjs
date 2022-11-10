#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { importDirect } from './import.mjs';

await importDirect('webpack', 'webpack-cli/bin/cli.js');
