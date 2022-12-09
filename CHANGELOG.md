# CHANGELOG

## [0.11.3](https://github.com/zCloak-Network/toolkit/compare/v0.11.2...v0.11.3) (2022-12-09)


### Bug Fixes

* **ci:** skip public folder ([a50909a](https://github.com/zCloak-Network/toolkit/commit/a50909aae32deacd97ee2aeb28befd469c2f4d02))


## [0.11.2](https://github.com/zCloak-Network/toolkit/compare/v0.11.1...v0.11.2) (2022-12-09)


### Bug Fixes

* **ci:** public folder exists error ([700c37d](https://github.com/zCloak-Network/toolkit/commit/700c37d557157a061f83cd88783840d3fdd86249))


## [0.11.1](https://github.com/zCloak-Network/toolkit/compare/v0.11.0...v0.11.1) (2022-12-09)


### Bug Fixes

* **ci:** use public folder exists instead .skip-lint ([45c2f78](https://github.com/zCloak-Network/toolkit/commit/45c2f786c72dea60fcdca159ea77135b883e2a92))


## [0.11.0](https://github.com/zCloak-Network/toolkit/compare/v0.10.5...v0.11.0) (2022-12-09)


### Features

* **ci:** add .skip-lint file to skip lint dependencies ([6c02015](https://github.com/zCloak-Network/toolkit/commit/6c02015830dde1368f61ecfb894deebf8d4eca2a))


## [0.10.5](https://github.com/zCloak-Network/toolkit/compare/v0.10.4...v0.10.5) (2022-12-05)


### Bug Fixes

* **ci:** skipt npm ([cadf8f2](https://github.com/zCloak-Network/toolkit/commit/cadf8f2656d1fce5638f70e31aabfa1dc33697ef))


## [0.10.4](https://github.com/zCloak-Network/toolkit/compare/v0.10.3...v0.10.4) (2022-12-05)


### Bug Fixes

* **build:** fix build includes error ([96f3e12](https://github.com/zCloak-Network/toolkit/commit/96f3e12da2b8aa10752d3836791abc87546d90b9))


## [0.10.3](https://github.com/zCloak-Network/toolkit/compare/v0.10.2...v0.10.3) (2022-12-05)


### Bug Fixes

* **ci:** skip npm when level=4 ([4122883](https://github.com/zCloak-Network/toolkit/commit/4122883d15a7fd834850c8441208ab65cc7f031f))


## [0.10.2](https://github.com/zCloak-Network/toolkit/compare/v0.10.0...v0.10.2) (2022-12-05)


### Bug Fixes

* **ci:** remove spaces. ([242f481](https://github.com/zCloak-Network/toolkit/commit/242f481e6110989d5c87b256a8e69980fe73aa0d))
* **ci:** when the patch version number is 0, the changelog output error. ([88cfd2d](https://github.com/zCloak-Network/toolkit/commit/88cfd2de16ba04148728e06773cba880f3bd4332))


##[0.10.1](https://github.com/zCloak-Network/toolkit/compare/v0.10.0...v0.10.1) (2022-12-05)


### Bug Fixes

* **ci:** when the patch version number is 0, the changelog output error. ([88cfd2d](https://github.com/zCloak-Network/toolkit/commit/88cfd2de16ba04148728e06773cba880f3bd4332))


## [0.10.0](https://github.com/zCloak-Network/toolkit/compare/v0.8.1...v0.10.0) (2022-12-05)


### Bug Fixes

* **ci:** not push changes because the level is less 4. ([9b159cc](https://github.com/zCloak-Network/toolkit/commit/9b159cc46fecd40dd147b22bc3892c6eb1748977))


### Features

* **ci:** add release-as note ([91560f9](https://github.com/zCloak-Network/toolkit/commit/91560f926dfa064e4d0e264b408f980854d71366))
* **ci:** bump version by commit ([552b099](https://github.com/zCloak-Network/toolkit/commit/552b099a5732be84ab8ee451fc66f2d59ed6c047))


## [0.8.1](https://github.com/zCloak-Network/toolkit/compare/v0.8.0...v0.8.1) (2022-12-01)


### Bug Fixes

* use angular instead conventionalcommits ([51c01e5](https://github.com/zCloak-Network/toolkit/commit/51c01e525b134e7d5206536436cc322349dc0725))


## [0.8.0](https://github.com/zCloak-Network/toolkit/compare/v0.7.6...v0.8.0) (2022-12-01)


### Features

* **dev:** recommend bump version ([ccb3619](https://github.com/zCloak-Network/toolkit/commit/ccb361962f1ea5f8d1fa55298d3415796460e8c8))
* **ghact:** remove release-pr github actions ([4dd16b0](https://github.com/zCloak-Network/toolkit/commit/4dd16b07ef611c9659ead1a6819cb9a77c136686))


### Bug Fixes

* **ci:** no replace func ([1a4aaf1](https://github.com/zCloak-Network/toolkit/commit/1a4aaf13325554f5b80be3aa7daa4b94e99890e3))
* **ghact:** remove if ([413821c](https://github.com/zCloak-Network/toolkit/commit/413821cb25d049534fc175b917e2a78d4f64a33e))


## [0.7.6](https://github.com/zCloak-Network/toolkit/compare/v0.6.6...v0.7.6) (2022-12-01)


### Features

* **dev:** release-pr ci ([#5](https://github.com/zCloak-Network/toolkit/issues/5)) ([cdde6b4](https://github.com/zCloak-Network/toolkit/commit/cdde6b44a501f93a6a51222a15c2ca8b365bf8ec))

## 0.6.6 Nov 18, 2022

Changes:

- skip lint dependencies when hash .skip-build file.


## 0.6.5 Nov 18, 2022

Changes:

- allow to build js and jsx files.

## 0.6.4 Nov 17, 2022

Changes:

- allow to build js and jsx files.

## 0.6.3 Nov 15, 2022

Changes:

- fix zcloak-dev-run-lint tsc not throw error.

## 0.6.2 Nov 15, 2022

Changes:

- fix zcloak-lint would not lint the type dependencies in locals.

## 0.6.1 Nov 13, 2022

Changes:

- fix @zcloak/lint dependencies.

## 0.6.0 Nov 13, 2022

Changes:

- add @zcloak/lint package, it to lint dependencies in package.json, and also lint references in tsconfig.build.json when local dependencies.
- add zcloak-dev-lint-dependencies ci.


## 0.5.0 Nov 11, 2022

Changes:

- don't make packageInfo.json
- bump version manual


## 0.4.1 Nov 10, 2022

Changes:

- update babel config
- update prettier config
- update jest config
- check dependencies when build


## 0.3.1 Sep 19, 2022

Changes:

- add eslint-plugin-header
- up deps

## 0.2.1 Sep 19, 2022

Changes:

- upgrade dependiencies

## 0.1.1 May 25, 2022

Changes:

- Add github release script support.
