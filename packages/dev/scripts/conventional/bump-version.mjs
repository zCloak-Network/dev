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

  if (breakings > 0) {
    level = 0; // major
  } else if (features > 0) {
    level = 1; // minor
  } else if (fixes > 0) {
    level = 2; // patch
  } else {
    level = 2; // patch
  }

  if (release) {
    level += 3;
  }

  return {
    level,
    reason: `release with ${breakings} BREAKING CHANGE, ${features} Features, ${fixes} Bug Fix`
  };
};
