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
      commit.notes.forEach((note) => {
        if (note.title === 'BREAKING CHANGE') {
          breakings++;
        } else if (note.title === 'release-as') {
          release = true;
        }
      });
    }

    if (commit.type === 'feat') {
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
      throw new Error('must has breakings, features, fixes when release');
    }
  } else {
    if (breakings + features + fixes === 0) {
      level = 4;
    } else {
      level = 3;
    }
  }

  return {
    level,
    reason:
      level === 4
        ? 'nothing to do'
        : `release/${
            release ? 'stable' : 'beta'
          } with ${breakings} ${breakings}BREAKING CHANGE, ${features} Features, ${fixes} Bug Fix`
  };
};
