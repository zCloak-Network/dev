#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { execNode } from './execute.mjs';

execNode('release-please', 'release-please/build/src/bin/release-please.js');
