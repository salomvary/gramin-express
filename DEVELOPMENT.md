## Build status

[![Build Status](https://travis-ci.org/salomvary/gramin-express.svg?branch=master)](https://travis-ci.org/salomvary/gramin-express)
[![Build status](https://ci.appveyor.com/api/projects/status/5pb49mjp8jhh48oq?svg=true)](https://ci.appveyor.com/project/salomvary/gramin-express)

## Making a release

- Run `npm version patch` (or `minor` or `major`)
- Run `git push origin master --tags`
- Wait for the CI builds to complete ([AppVeyor](https://ci.appveyor.com/project/salomvary/gramin-express/history), [Travis CI](https://travis-ci.org/salomvary/gramin-express))
- Go to [GitHub releases](https://github.com/salomvary/gramin-express/releases)
- Add release notes and publish release
- Run `npm version prerelease`
- Run `git push origin master --tags`
