#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { importDirect } from './import.mjs';

process.env.NODE_OPTIONS = `--experimental-vm-modules${
  process.env.NODE_OPTIONS ? ` ${process.env.NODE_OPTIONS}` : ''
}`;

await importDirect('zcloak-dev-run-test', 'jest-cli/bin/jest');
