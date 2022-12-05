// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default (commits) => {
  let level = 2;
  let release = false;

  let breakings = 0;
  let features = 0;
  let fixes = 0;

  commits.forEach((commit) => {
    if (commit.notes.length > 0) {
      breakings += commit.notes.length;
    } else if (commit.type === 'release') {
      release = true;
    } else if (commit.type === 'feat') {
      features++;
    } else if (commit.type === 'fix') {
      fixes++;
    }
  });

  if (release) {
    if (breakings > 0) {
      level = 0; // major
    } else if (features > 0) {
      level = 1; // minor
    } else if (fixes > 0) {
      level = 2; // patch
    } else {
      level = 3; // pre
    }
  } else {
    level = 3;
  }

  return {
    level,
    reason: `Release/${
      release ? 'stable' : 'beta'
    } with ${breakings} ${breakings}BREAKING CHANGE, ${features} Features, ${fixes} Bug Fix`
  };
};
