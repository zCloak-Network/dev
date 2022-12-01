#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import conventionalChangelog from 'conventional-changelog';
import conventionalRecommendedBump from 'conventional-recommended-bump';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { copySync } from './copy.mjs';
import { execSync } from './execute.mjs';
import gitSetup from './gitSetup.mjs';

console.log('$ zcloak-ci-ghact-build', process.argv.slice(2).join(' '));

const repo = `https://${process.env.GH_PAT}@github.com/${process.env.GITHUB_REPOSITORY}.git`;

function runClean() {
  execSync('yarn zcloak-dev-clean-build');
}

function runCheck() {
  execSync('yarn lint');
}

function runTest() {
  execSync('yarn test');
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

function npmGetVersion() {
  return npmGetJson().version;
}

function npmSetup() {
  const registry = 'registry.npmjs.org';

  fs.writeFileSync(
    path.join(os.homedir(), '.npmrc'),
    `//${registry}/:_authToken=${process.env.NPM_TOKEN}`
  );
}

function npmPublish() {
  if (fs.existsSync('.skip-npm')) {
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

async function verBump() {
  const result = await new Promise((resolve, reject) => {
    conventionalRecommendedBump({ preset: 'conventionalcommits' }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  if (result.releaseType) {
    execSync(`yarn zcloak-dev-version ${result.releaseType}`);
  }
}

async function gitPush() {
  const version = npmGetVersion();

  const stream = conventionalChangelog({ preset: 'conventionalcommits' }, { version });

  const content = await new Promise((resolve, reject) => {
    stream.on('data', (data) => resolve(data.toString()));
    stream.on('error', reject);
  }).replace(/\n+$/, '\n');

  const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');

  console.log('$ write changelog');
  console.log(content);

  fs.writeFileSync(
    'CHANGELOG.md',
    changelog.replace(
      '# CHANGELOG',
      `# CHANGELOG

${content}`
    )
  );

  execSync('git add --all .');

  // add the skip checks for GitHub ...
  execSync(`git commit --no-status --quiet -m "[CI Skip] release/${
    version.includes('-') ? 'beta' : 'stable'
  } ${version}
  skip-checks: true"`);

  execSync(`git push ${repo} HEAD:${process.env.GITHUB_REF}`, true);

  const files = process.env.GH_RELEASE_FILES ? `--assets ${process.env.GH_RELEASE_FILES}` : '';

  execSync(`yarn zcloak-exec-ghrelease ${files} --yes`);
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

async function main() {
  // first do infrastructure setup
  gitSetup();
  npmSetup();

  await verBump();

  // perform the actual CI ops
  runClean();
  runCheck();
  runTest();
  runBuild();

  // publish to all GH repos
  await gitPush();

  // publish to npm
  loopFunc(npmPublish);
}

main();
