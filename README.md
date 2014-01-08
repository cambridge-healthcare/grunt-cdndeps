# grunt-cdndeps

> Local CDN dependency manager.

`grunt-cdndeps` is a Grunt plugin that manages a local dependencies directory based on CDN dependency URLs specified in a given JSON file at any one time.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cdndeps --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cdndeps');
```

## The "cdndeps" task

### Overview
In your project's Gruntfile, add a section named `cdndeps` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  cdndeps: {
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Usage Examples

In this example, `grunt-cdndeps` will read the contents of `package.json` and try to find a `cdnDeps` key whose value is a list of CDN urls, or an object whose values are lists of CDN urls. It will then download all of those files into `tmp/cdns`.

```js
grunt.initConfig({
  cdndeps: {
    files: {
      "tmp/cdns": ["package.json"],
    },
  },
})

```

It is important to note that `tmp/cdns` will have a folder structure that reflects the relative paths of the URLs.

*Given JSON with cdn urls*:

```json
{
  "cdnDeps": {
    "default": [
      "//ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular.js",
      "//ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular-resource.js",
      "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.4.0/moment.js",
      "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.4.0/lang/en-gb.js",
      "https://raw.github.com/DmitryBaranovskiy/raphael/v2.1.2/raphael.js"
    ],
    "IE78": [
      "https://raw.github.com/kriskowal/es5-shim/v2.1.0/es5-shim.js",
      "//cdnjs.cloudflare.com/ajax/libs/json3/3.2.5/json3.js"
    ],
    "IE7": [
      "//cdnjs.cloudflare.com/ajax/libs/sizzle/1.10.9/sizzle.js"
    ]
  }
}

```

*`cdns` folder structure*:

```
cdns
├── DmitryBaranovskiy
│   └── raphael
│       └── v2.1.2
│           └── raphael.js
├── ajax
│   └── libs
│       ├── angularjs
│       │   └── 1.2.3
│       │       ├── angular-resource.js
│       │       └── angular.js
│       ├── json3
│       │   └── 3.2.5
│       │       └── json3.js
│       ├── moment.js
│       │   └── 2.4.0
│       │       ├── lang
│       │       │   └── en-gb.js
│       │       └── moment.js
│       └── sizzle
│           └── 1.10.9
│               └── sizzle.js
└── kriskowal
    └── es5-shim
            └── v2.1.0
                        └── es5-shim.js
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

