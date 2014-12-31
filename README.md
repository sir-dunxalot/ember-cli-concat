Ember-cli-concat [![Ember Addon](https://s3.amazonaws.com/images.jebbit.com/ember/badge.svg)](//emberaddons.com)
======

Ember CLI Concat is an Ember addon that concatinates Ember CLI's app and vendor files into a single JS file and a single CSS file in production environments. In other words, less HTTP requests and a faster page load speed!

By default:
- In production environments:
  - `vendor.css` and `app-name.css` will become `app.css`
  - `vendor.js` and `app-name.js` will become `app.js`
- In all environments:
  - Only the relevant `<script>` and `<link rel="stylesheet">` will be added to your index.html file so you don't have to worry about requesting assets that don't exist

**By default, concatenation only takes place in production builds**


## Contents

- [Installation](#installation)
- [Documentation](#documentation)
- [Features in the Works](#features-in-the-works)
- [Issues](#issues)
- [Development](#development)
- [Inspirational quotation](#inspirational-quotation)


## Installation

```
npm install --save-dev ember-cli-concat
```

Once you have installed the NPM module you must follow the [setup instructions]() to make sure your `index.html` files are not requesting resources you don't need.


## Documentation

Documentation including installation, usage, and customizable options is available [in the wiki](https://github.com/sir-dunxalot/ember-cli-concat/wiki).


## Features in the Works

- Test suite
- Asset map support (especially in test environment)
- Documentation moved to wiki


## Issues

If you have any issues or feature requests/ideas, please [open an issue](https://github.com/sir-dunxalot/ember-flash-messages/issues/new) or submit a PR.


## Development

```shell
git clone https://github.com/sir-dunxalot/ember-cli-concat.git
ember install
ember s
```

The test suite can be ran as follows:

```shell
ember test
```

### Working on wiki documentation:

Clone the repo as above. Then run:

```shell
cd docs
git submodule update --init --recursive # Updates submodule
```

You can open a PR to the documentation, as usual. Please note it is technically a seperate git repo.


## Inspirational Quotation

"Drink beer and party" - Steve Jobs
