#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { importRelative } from './import.cjs';

importRelative('gh-release', 'gh-release/bin/cli.js');
