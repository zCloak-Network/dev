// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export { circ1 } from './circ1.js';
export { circ2 } from './circ2.js';

/**
 * Some first test link
 * @link ../testRoot.ts
 */
export default (test: string): string => test;

// eslint config test
export function blah(): void {
  console.log('123');
}

export function adder(a: number, b: number): number {
  return a + b;
}
