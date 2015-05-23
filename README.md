# Skivvy package: `clean`
[![npm version](https://img.shields.io/npm/v/@skivvy/skivvy-package-clean.svg)](https://www.npmjs.com/package/@skivvy/skivvy-package-clean)
![Stability](https://img.shields.io/badge/stability-stable-brightgreen.svg)
[![Build Status](https://travis-ci.org/skivvyjs/skivvy-package-clean.svg?branch=master)](https://travis-ci.org/skivvyjs/skivvy-package-clean)

> Delete files and folders


## Installation

```bash
skivvy install clean
```


## Overview

This package allows you to delete files and folders from within the [Skivvy](https://www.npmjs.com/package/skivvy) task runner.


## Included tasks

### `clean`

Delete files and folders

#### Configuration settings:

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `path` | `string`,`Array` | Yes | N/A | Files/folders to delete |
| `options` | `object` | No | `null` | [Glob options](https://github.com/isaacs/node-glob#options) |
| `options.force` | `boolean` | No | `false` | Allow deleting of the current working directory and files/folders outside it |
