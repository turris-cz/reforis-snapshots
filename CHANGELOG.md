# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.3.1] - 2025-03-12

### Changed

- Updated several npm dependencies in package.json
- NPM audit fix

## [2.3.0] - 2025-02-20

### Added

- Added & updated Weblate translations

### Changed

- Updated Foris JS library to v6.6.2
- Refactored Snapshots and integrate RichTable component

## [2.2.1] - 2024-10-03

### Changed

- Fixed version in pyproject.toml

## [2.2.0] - 2024-10-03

### Added

- Added & updated Weblate translations

### Changed

- Migrated to FontAwesome v6
- Updated Foris JS library to v6.4.0
- Fixed spelling mistake in handleDownloadSnapshot function
- Refactored CreateSnapshotForm to handle error feedback
- Refactored hooks.js to handle success alerts for snapshot operations
- Refactored SnapshotRow to use ThreeDotsMenu for actions

## [2.1.0] - 2024-06-28

### Changed

- Updated .gitignore file and excluded Ruff cache folder
- Updated Foris JS library to v6.0.2
- Updated dependencies in package.json

### Removed

- Removed redundant .gitkeep files

## [2.0.0] - 2024-03-12

### Added

- Added & updated Weblate translations
- Added data-testid attribute for save snapshot button
- Added missing peerDependencies
- Added Download button

### Changed

- Updated dependencies in package.json
- Updated Node.js to v21.x in Makefile
- Updated ESLint and Prettier configurations
- Updated .gitignore to exclude minified JS files and license files
- Updated webpack.config.js with process/browser alias
- Updated CI to use shared scripts, build and publish python package
- Replaced Pylint & Pycodestyle for Ruff
- Restructured and updated Makefile
- Restructured and divided form and list of snapshots
- Fixed empty table when no snapshots found
- Hid link to the advanced section on Shield
- Changed build system to Hatch
- NPM audit fix

### Removed

- Removed MANIFEST.in

## [1.2.1] - 2021-02-05

- Add repository info & description
- Update translations
- Remove duplicated file for Norwegian Bokmål
- Update snapshots
- NPM audit fix

## [1.2.0] - 2020-11-28

- Add fluid layout support
- Add factory reset endpoint
- Improve SnapshotsTable look
- Restructure Snapshots & CreateSnapshotForm
- Update Foris JS library to v5.1.7
- Integrate ESLint + Prettier + reForis styleguide
- Format all files with Prettier
- NPM audit fix

## [1.1.0] - 2020-03-30

- Update ForisJS v4.5.0.
- NPM update packages & audit fix.
- Improve delete/rollback snapshots UX.

## [1.0.0] - 2020-03-12

- Refactoring and polishing.
- Fix supporting snapshots types.
- Update translations.

## [0.2.0] - 2020-02-12

- Implement main functionality

[unreleased]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v2.3.1...master
[2.3.1]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v2.3.0...v2.3.1
[2.3.0]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v2.2.1...v2.3.0
[2.2.1]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v2.2.0...v2.2.1
[2.2.0]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v2.1.0...v2.2.0
[2.1.0]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v2.0.0...v2.1.0
[2.0.0]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v1.2.1...v2.0.0
[1.2.1]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v1.2.0...v1.2.1
[1.2.0]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v1.1.0...v1.2.0
[1.1.0]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v1.0.0...v1.1.0
[1.0.0]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/compare/v0.2.0...v1.0.0
[0.2.0]: https://gitlab.nic.cz/turris/reforis/reforis-snapshots/-/tags/v0.2.0
