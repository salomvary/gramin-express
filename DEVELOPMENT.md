## Making a release

- Run `npm version patch` (or `minor` or `major`)
- Run `git push origin master --tags`
- Wait for the CI builds to complete ([AppVeyor](https://ci.appveyor.com/project/salomvary/gramin-express/history), [Travis CI](https://travis-ci.org/salomvary/gramin-express))
- Go to [GitHub releases](https://github.com/salomvary/gramin-express/releases)
- Add release notes and publish release
- Run `npm version prerelease`
- Run `git push origin master --tags`
