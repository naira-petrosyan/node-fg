# Dependency Management
## What is a dependency
A dependency is a third-party bit of software, which ideally solves a single problem. A web project can have any number of dependencies, ranging from none to many, and your dependencies might include sub-dependencies that you didn't explicitly install — your dependencies may have their own dependencies.

A project dependency can be an entire JavaScript library or framework — such as React or Vue — or a very small utility like our human-readable date library, or it can be a command line tool such as Prettier or eslint, which we talked about in previous articles.

Dependencies are not some things that never change, and thousand new ones are released every day. You may want to replace some dependency taht you are using i the project or update some dependencies with newer versions. When you are working on a small project and you do not have many dependencies this can be done by hand, but for larger projects we use dependency management tools or package manager which will make everything easier and cleaner.

## What is a package manager

A package manager is a system that will manage your project dependencies. 
The package manager will provide a method to install new dependencies (also referred to as "packages"), manage where packages are stored on your file system, and offer capabilities for you to publish your own packages.

In theory you may not need a package manager and you could manually download and store your project dependencies, but a package manager will seamlessly handle installing and uninstalling packages. If you didn't use one, you'd have to manually handle:
* Finding all the correct package JavaScript files.
* Checking them to make sure they don't have any known vulnerabilities.
* Downloading them and putting them in the correct locations in your project.
* Writing the code to include the package(s) in your application
* Doing the same thing for all of the packages' sub-dependencies, of which there could be tens, or hundreds.
* Removing all the files again if you want to remove the packages.

For a package manager to work, it needs to know where to install packages from, and this comes in the form of a package registry. The registry is a central place that a package is published to and thus can be installed from.

### NPM
npm manages downloads of dependencies of your project. It gives commands to install single or multiple dependencies, update or uninstall dependencies keeps the versioning, etc.

For npm to know what it is doing there a package.json file, which is created in the root folder of the project and is a JSON file.
The file contains readable and human friendly metadata about the project and also list of packages that should be installed for the project

#### package.json
Your project's package.json is the central place to configure and describe how to interact with and run your application. It is used by the npm CLI (and yarn) to identify your project and understand how to handle the project's dependencies. It's the package.json file that enables npm to start your project, run scripts, install dependencies, publish to the NPM registry, and many other useful tasks. The npm CLI is also the best way to manage your package.json because it helps generate and update your package.json file throughout a project's life.
Let's look on some of the common fields in package.json file
* `name` - this is the name of the package(project), if you are trying to publish some package to registry this field is required and unique(gives error if not when publishing). There are also rules for the field value(length, allowed characters, etc.)
```json
"name": "my-project",
```
* `version` - The version field is very important for any published package, and required before publishing. It is the current version of the software that the package.json is describing.
```json
"version": "1.5.0",
```
* `license` - This is a very important but often overlooked property. The license field lets us define what license applies to the code the package.json is describing. Again, this is very important when publishing a project to the NPM registry, as the license may limit the use of your software by some developers or organizations.
```json
"license": "MIT",
```
* `author` and `contributors` - The author and contributor fields function similarly. They are both "people" fields which can be either a string in the format of "Name <email> <url>" , or an object with fields name, email, url. The email and url are both optional.
```json
"author": "Jon Church jon@example.com https://www.osioslabs.com/#team",
"contributors": [{
	"name": "Amber Matz",
	"email": "example@example.com",
	"url": "https://www.osiolabs.com/#team"
}],
```
* `description` - The description field is used by the NPM registry for published packages, to describe the package in search results and on the npmjs.com website. This can also be a simple documentation about the project if you are not publishing it as a package
* `keywords` - The keywords field is an array of strings, and serves a similar purpose to the description. This field is indexed by the NPM registry to help find packages when someone searches for them. Each value in the array is one keyword associated with your package.
```json
"keywords": ["server", "express", "date"],
```
* `main` - The main field is a functional property of your package.json. This defines the entry point into your project, and commonly the file used to start the project. If your package (let's say its name is foo-lib) is installed by a user, then when a user does require('foo-lib'), it is the module.exports property of the file listed in the main field that is returned by require.
```json
"main": "src/index.js",
```
* `scripts` - The scripts field is another functional piece of metadata in your package.json. The scripts property takes an object with its keys being scripts we can run with npm run <scriptName>, and the value is the actual command which is run. These are typically terminal commands, which we put into the scripts field so we can both document them and reuse them easily.
```json
"scripts": {
	"start": "node index.js",
	"dev": "nodemon"
},
```
* `repository` - You can record the repository the code for a project lives in by providing the repository field. This field is an object which defines the url where the source code is located, and what type of version control system it uses. For open source projects, this is likely GitHub or Bitbucket with Git as the version control system.
```json
"repository": {
	"type": "git",
	"url": "https://github.com/my-date/example.git"
}
```
* `dependencies` -  This is one of the most important fields in your package.json, and likely the entire reason you need one. All of the dependencies your project uses (the external code that the project relies on) are listed here. When a package is installed using the npm CLI, it is downloaded to your node_modules/ folder and an entry is added to your dependencies property, noting the name of the package and the installed version.
```json
"dependencies": {
	"express": "^4.16.4",
    "compression": "~1.7.4"
}
```
* `devDependencies` - Similar to the dependencies field, but for packages which are only needed during development, and aren't needed in production.
```json
"devDependencies": {
	"nodemon": "^1.18.11"
}
```
* `optionalDependencies` - the difference is that build failure of the dependency will not cause installation to fail. But it is your program's responsibility to handle the lack of the dependency.

npm is used to manage dependencies. It has 2 ways of installing packages
1. local packages
2. global packages 
#### NPM Commands
* `npm init` - To generate package.json file, we need to run `npm init` command. The file should be a valid JSON, so commas, quotes and overall syntax should be maintained.
* `npm install` - installs all the dependencies listed in package.json
* `npm install <package-name>` installs a specific package(Furthermore, since npm 5, this command adds <package-name> to the package.json file dependencies. Before version 5, you needed to add the flag `--save`(`-S`).) this command has some flags
    * `--save-dev`(`-D`) -  installs and adds the entry to the package.json file devDependencies
    * `--no-save` -  installs but does not add the entry to the package.json file dependencies
    * `--save-optional`(-O) - installs and adds the entry to the package.json file optionalDependencies
    * ` --no-optional` -  will prevent optional dependencies from being installed
    
    * `npm install <package>@<version>`
* `npm update` - npm will check all packages for a newer version that satisfies your versioning constraints.
    * `npm update <package-name>` - a single package to update as well
* `npm run <task-name>` - run tasks that are defined in package.json `scripts` 
##### Global and Local packages
* local packages are installed in the directory where you run npm install <package-name>, and they are put in the node_modules folder under this directory
* global packages are all put in a single place in your system (exactly where depends on your setup), regardless of where you run npm install -g <package-name>
In your code you can only require local packages:

In general, all packages should be installed locally.

Great examples of popular global packages which you might know are
npm
create-react-app
vue-cli
grunt-cli
mocha
react-native-cli
gatsby-cli
forever
nodemon
##### Versioning
In addition to plain downloads, npm also manages versioning, so you can specify any specific version of a package, or require a version higher or lower than what you need. 
1. Many times you'll find that a library is only compatible with a major release of another library.
2. Or a bug in the latest release of a lib, still unfixed, is causing an issue.
3. Specifying an explicit version of a library also helps to keep everyone on the same exact version of a package, so that the whole team runs the same version until the package.json file is updated.
 
In all those cases, versioning helps a lot, and npm follows the semantic versioning (semver) standard.

* `npm outdated` - run to discover new releases of the packages
* `npm install -g npm-check-updates` - To update all packages to a new major version, install the npm-check-updates package globally

#### `package-lock.json`

In version 5, npm introduced the `package-lock.json` file.
The goal of `package-lock.json` file is to keep track of the exact version of every package that is installed so that a product is 100% reproducible in the same way even if packages are updated by their maintainers.
This solves a very specific problem that package.json left unsolved. In package.json you can set which versions you want to upgrade to (patch or minor), using the semver notation, for example,
* if you write ~0.13.0, you want to only update patch releases: 0.13.1 is ok, but 0.14.0 is not.
* if you write ^0.13.0, you want to get updates that do not change the leftmost non-zero number: 0.13.1, 0.13.2 and so on. If you write ^1.13.0, you will get patch and minor releases: 1.13.1, 1.14.0 and so on up to 2.0.0 but not 2.0.0.
* if you write 0.13.0, that is the exact version that will be used, always

You don't commit to Git your `node_modules` folder, which is generally huge, and when you try to replicate the project on another machine by using the `npm install` command, if you specified the `~` syntax and a patch release of a package has been released, that one is going to be installed. Same for `^` and minor releases.

It could be you, or another person trying to initialize the project on the other side of the world by running `npm install`.

So your original project and the newly initialized project are actually different. Even if a patch or minor release should not introduce breaking changes, we all know bugs can (and so, they will) slide in.

The `package-lock.json` sets your currently installed version of each package in stone, and npm will use those exact versions when running `npm ci`.
The `package-lock.json` file needs to be committed to your Git repository, so it can be fetched by other people, if the project is public or you have collaborators, or if you use Git as a source for deployments.

The dependencies versions will be updated in the `package-lock.json` file when you run `npm update`.
Example of `package-lock.json` when running `npm install cowsay`.
```json
{
  "requires": true,
  "lockfileVersion": 1,
  "dependencies": {
    "ansi-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-3.
0.0.tgz",
      "integrity": "sha1-7QMXwyIGT3lGbAKWa922Bas32Zg="
    },
    "cowsay": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/cowsay/-/cowsay-1.3.1.tgz"
,
      "integrity": "sha512-3PVFe6FePVtPj1HTeLin9v8WyLl+VmM1l1H/5P+BTTDkM
Ajufp+0F9eLjzRnOHzVAYeIYFF5po5NjRrgefnRMQ==",
      "requires": {
        "get-stdin": "^5.0.1",
        "optimist": "~0.6.1",
        "string-width": "~2.1.1",
        "strip-eof": "^1.0.0"
      }
    },
    "get-stdin": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/get-stdin/-/get-stdin-5.0.
1.tgz",
      "integrity": "sha1-Ei4WFZHiH/TFJTAwVpPyDmOTo5g="
    },
    "is-fullwidth-code-point": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/
is-fullwidth-code-point-2.0.0.tgz",
      "integrity": "sha1-o7MKXE8ZkYMWeqq5O+764937ZU8="
    },
    "minimist": {
      "version": "0.0.10",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-0.0.10
.tgz",
      "integrity": "sha1-3j+YVD2/lggr5IrRoMfNqDYwHc8="
    },
    "optimist": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/optimist/-/optimist-0.6.1.tgz",
      "integrity": "sha1-2j6nRob6IaGaERwybpDrFaAZZoY=",

      "requires": {
        "minimist": "~0.0.1",
        "wordwrap": "~0.0.2"
      }
    },
    "string-width": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-2.1.1.tgz",
      "integrity": "sha512-nOqH59deCq9SRHlxq1Aw85Jnt4w6KvLKqWVik6oA9ZklXLNIOlqg4F2yrT1MVaTjAqvVwdfeZ7w7aCvJD7ugkw==",
      "requires": {
        "is-fullwidth-code-point": "^2.0.0",
        "strip-ansi": "^4.0.0"
      }
    },
    "strip-ansi": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-4.0.0.tgz",
      "integrity": "sha1-qEeQIusaw2iocTibY1JixQXuNo8=",
      "requires": {
        "ansi-regex": "^3.0.0"
      }
    },
    "strip-eof": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/strip-eof/-/strip-eof-1.0.0.tgz",
      "integrity": "sha1-u0P/VZim6wXYm1n80SnJgzE2Br8="
    },
    "wordwrap": {
      "version": "0.0.3",
      "resolved": "https://registry.npmjs.org/wordwrap/-/wordwrap-0.0.3.tgz",
      "integrity": "sha1-o9XabNXAvAAI03I0u68b7WMFkQc="
    }
  }
}

```
[Read](https://nodejs.dev/learn/an-introduction-to-the-npm-package-manager) about npm and rest here.
### npx
npx is a package runner and itself it is a npm package that comes with npm 5.2 by default.
Before npx some packages needed tobe installed globally to use their cli commands. npx gives opporutnity to run commands by even not installing the packages before runnging.
npx executes either from local node_modules or from registry, by installing the package if not already installed.
Let's look at the example from my personal experience.
I have used sequelize for my projects. Sequelize gives cli commands to create and run migrations and seeders. 
One example is `sequelize db:migrate`. Before npm5.2 version, `sequelize` needed to be globally installed in order to have access to `sequelize`
command in terminals. Other solution was to run command with relative path to where the package was installed locally. There are some other tricks to acheive this, but npx gives simpler solution. When we run the same command as `npx sequelize db:migrate`, it tries to locate sequelize package in local node_modules and runs the package. If sequelize is not installed locally, it installs and then runs the command.
npx command also has its flags, more on [DOC](https://www.npmjs.com/package/npx)

### nvm

  