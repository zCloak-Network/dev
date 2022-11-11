#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import os from 'os';
import path from 'path';

import { copySync } from './copy.mjs';
import { execSync } from './execute.mjs';
import gitSetup from './gitSetup.mjs';

console.log('$ zcloak-ci-ghact-build', process.argv.slice(2).join(' '));

const repo = `https://${process.env.GH_PAT}@github.com/${process.env.GITHUB_REPOSITORY}.git`;

let withNpm = false;

function runClean() {
  execSync('yarn zcloak-dev-clean-build');
}

function runCheck() {
  execSync('yarn lint');
}

function runTest() {
  execSync('yarn test');

  // if [ -f "coverage/lcov.info" ] && [ -n "$COVERALLS_REPO_TOKEN" ]; then
  //   console.log('*** Submitting to coveralls.io');

  //   (cat coverage/lcov.info | yarn run coveralls) || true
  // fi
}

function runBuild() {
  execSync('yarn build');
}

function npmGetJsonPath() {
  return path.resolve(process.cwd(), 'package.json');
}

function npmGetJson() {
  return JSON.parse(fs.readFileSync(npmGetJsonPath(), 'utf8'));
}

function npmSetJson(json) {
  fs.writeFileSync(npmGetJsonPath(), `${JSON.stringify(json, null, 2)}\n`);
}

function npmGetVersion() {
  return npmGetJson().version;
}

function npmSetVersionFields() {
  const json = npmGetJson();

  if (!json.versions) {
    json.versions = {};
  }

  json.versions.git = json.version;

  json.versions.npm = json.version;

  npmSetJson(json);
}

function npmSetup() {
  const registry = 'registry.npmjs.org';

  fs.writeFileSync(
    path.join(os.homedir(), '.npmrc'),
    `//${registry}/:_authToken=${process.env.NPM_TOKEN}`
  );
}

function npmPublish() {
  if (fs.existsSync('.skip-npm') || !withNpm) {
    return;
  }

  ['LICENSE', 'package.json']
    .filter((file) => !fs.existsSync(path.join(process.cwd(), 'build', file)))
    .forEach((file) => copySync(file, 'build'));

  process.chdir('build');

  const tag = npmGetVersion().includes('-') ? '--tag beta' : '';
  let count = 1;

  while (true) {
    try {
      execSync(`npm publish --access public ${tag}`);

      break;
    } catch (error) {
      if (count < 5) {
        const end = Date.now() + 15000;

        console.error(`Publish failed on attempt ${count}/5. Retrying in 15s`);
        count++;

        while (Date.now() < end) {
          // just spin our wheels
        }
      }
    }
  }

  process.chdir('..');
}

function verBump() {
  const { version: currentVersion, versions } = npmGetJson();
  const lastVersion = versions.npm;

  if (currentVersion !== lastVersion) {
    withNpm = true;
    // always ensure we have made some changes, so we can commit
    npmSetVersionFields();
  }
}

function gitPush() {
  if (!withNpm) return;

  const version = npmGetVersion();
  let doGHRelease = false;

  if (process.env.GH_RELEASE_GITHUB_API_TOKEN) {
    const changes = fs.readFileSync('CHANGELOG.md', 'utf8');

    if (changes.includes(`## ${version}`)) {
      doGHRelease = true;
    } else if (!version.includes('-')) {
      throw new Error(`Unable to release, no CHANGELOG entry for ${version}`);
    }
  }

  execSync('git add --all .');

  // add the skip checks for GitHub ...
  execSync(`git commit --no-status --quiet -m "[CI Skip] release/${
    version.includes('-') ? 'beta' : 'stable'
  } ${version}


skip-checks: true"`);

  execSync(`git push ${repo} HEAD:${process.env.GITHUB_REF}`, true);

  if (doGHRelease) {
    const files = process.env.GH_RELEASE_FILES ? `--assets ${process.env.GH_RELEASE_FILES}` : '';

    execSync(`yarn zcloak-exec-ghrelease --draft ${files} --yes`);
  }
}

function loopFunc(fn) {
  if (fs.existsSync('packages')) {
    fs.readdirSync('packages')
      .filter((dir) => {
        const pkgDir = path.join(process.cwd(), 'packages', dir);

        return (
          fs.statSync(pkgDir).isDirectory() &&
          fs.existsSync(path.join(pkgDir, 'package.json')) &&
          fs.existsSync(path.join(pkgDir, 'build'))
        );
      })
      .forEach((dir) => {
        process.chdir(path.join('packages', dir));
        fn();
        process.chdir('../..');
      });
  } else {
    fn();
  }
}

// first do infrastructure setup
gitSetup();
npmSetup();

verBump();

// perform the actual CI ops
runClean();
runCheck();
runTest();
runBuild();

// publish to all GH repos
gitPush();

// publish to npm
loopFunc(npmPublish);
