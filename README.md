# Ember-cli-concat

`ember-cli-concat` is an Ember CLI addon that:
- Concatenates your javascript files into a single js file for production
- Concatenates your stylesheets into a single css file for production
- Automatically adds the relevant `<script>` and `<style>` tags to your index.html file

In other words, in production builds `vendor.css` and `app-name.css` will become `app.css`, and the same for the javascript files. This addon also handles the `<script>` and `<link rel="stylesheet">` tags in your index.html file so you don't have to worry about requesting assets that don't exist.

**By default concatenation will only happen in production builds.**

## Installation

Add the package:

```
npm install --save-dev ember-cli-concat
```

And remove the main `<script>` and `<link rel="stylesheet">` tags from your app's main HTML file (usually `app/index.html`):

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Dummy</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{content-for 'head'}}

    <!-- Removed stylesheets -->
    <!-- <link rel="stylesheet" href="assets/vendor.css"> -->
    <!-- <link rel="stylesheet" href="assets/app-name.css"> -->
  </head>
  <body>
    {{content-for 'body'}}

    <!-- Removed scripts -->
    <!-- <script src="assets/vendor.js"> -->
    <!-- <script src="assets/app-name.js"> -->
  </body>
</html>

```

## Customizable Options

Several options are made available for you to customize the addon. They can be set in your app's Brocfile as follows:

```js
var app = new EmberApp({
  'ember-cli-concat': {
    footer: null,
    forceConcatination: false,
    header: null,
    outputDir: 'assets',
    outputFileName: 'app',
    wrapScriptsInFunction: true
  }
});
```

#### footer

The string to add to the end of all concatenated files. Usually this is a comment. For example:

```js
string: '// Copyright © I Am Devloper 2014'
```

@property footer
@type String
@default null


#### forceConcatination

An override the developer can utilize to concatenate regardless of the environment. Useful for debugging purposes.

@property forceConcatination
@type Boolean
@default false


#### header

The string to add to the start of all concatenated files. Usually this is a comment. For example:

```js
string: '// Author: I Am Devloper'
```

@property footer
@type String
@default null


#### outputDir

The output directory that the concatenated files will be saved to. Define it as a relative path with no opening or closing slashes. For example:

`outputDir` is combined with `outputFileName` to determine the full file path for saving concatenated files.

```js
outputDir: 'assets'
// or
outputDir: 'assets/public'
```

@property outputDir
@type String
@default 'assets'


#### outputFileName

The name of the concatenated file that will hold the styles or script for your project. Define it as a string with no file extention. This addon will automatically append the require file extentions. For example:

```js
outputFileName: 'app' // Results in app.css and app.js being created
```

The full file path is determine by `outputFileName` and `outputDir`. For example:

```js
outputDir: 'assets',
outputFileName: 'app'
// Results in assets/app.css and assets/app.js being created
```

@property outputFileName
@type String
@default 'app'


#### wrapScriptsInFunction

Whether or not to wrap the concatenated javascript in an eval statement.

@property wrapScriptsInFunction
@type Boolean
@default true


## Issues

Please open an issue or PR.
