## Description

This subproject brings [AdminJS](https://adminjs.co/) to the base project as a separated module. It has to be developed separately because the base project (NestJS) doesn't support so-called ESM module resolution, which is the only resolution supported by AdminJS. Therefore we need to build AdminJS as a separate package which is then imported into the base project.

## Installation

```bash

# From the base project root, install the required packages. It will install packages for the base proejct and for AdminJS, since the whole project is configured as a workspace.
$ yarn
```

## Development

```bash

# Make sure the required docker containers from the base project are running.
$ yarn docker:up

# Start the development server
$ yarn start:dev

# Start Browsersync to enable automatic reloading on file changes. It can be accessed on http://localhost:3031/admin.
# If needed, you can tune the config for this module in bs-config.cjs. If the browser is reloading before the code is recompiled, you can most likely "fix" that by increasing reloadDelay.
$ yarn start:dev:bs

# If you need to add additional package to AdminJS project, add it form this project root.
$ yarn add <package name>
```

## Publishing

```bash
# When you want to expose the latest version of the AdminJS to the base project, you should build it, either from the base project or AdminJS root.
$ yarn build
```
