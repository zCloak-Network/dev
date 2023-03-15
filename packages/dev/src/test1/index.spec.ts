// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import index, { blah } from './index.js';

describe('index', () => {
  it('runs the test', () => {
    expect(blah).toBeDefined();
  });

  it('runs the echo function', () => {
    expect(index('something')).toEqual('something');
  });
});
