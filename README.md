# grunt-cdndeps

> Local CDN dependency manager.

`grunt-cdndeps` is a Grunt plugin that manages a local dependencies directory based on a set of content delivery network (CDN) dependency URLs specified in a given JSON file at any one time.

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

## Cdndeps task

_Run this task with the `grunt cdndeps` command._

### Options

#### src
Type: `String`

Default: empty string

String containing the name of a JSON file which lists the CDN URLs `grunt-cdndeps` is to download.

#### dest
Type: `String`

Default: empty string

String containing the name of a directory into which `grunt-cdndeps` will download the CDN URLs. _It's important to note that the destination directory will have a subsequent folder structure that reflects the relative path of each URL._

#### prune
Type: `Boolean`

Default: `true`

By default `grunt-cdndeps` will prune (remove) any files which exist in the directory `dest` directory after downloading and mirroring the CDN URLs. Setting `prune` to `false` will disable this and preserve existing files.

#### clean
Type: `Boolean`

Default: `true`

By default `grunt-cdndeps` will clean up any empty directories that result from downloading and mirroring the CDN URLs. Setting `clean` to `false` will disable this and leave empty directories in situ.

### Usage Examples

#### Mirror a set of CDN URLs

In this example, `grunt-cdndeps` will read the contents of `package.json` and try to find a `cdnDeps` key whose value is a list of CDN urls, or an object whose values are lists of CDN urls. It will then download all of those files into `tmp/cdns`.

```js
grunt.initConfig({
  cdndeps: {
    options: {
      src: "package.json",
      dest: "tmp/cdns"
    }
  },
})

```

As mentioned above, it's important to note that `tmp/cdns` will have a folder structure that reflects the relative paths of the URLs.

##### Sample JSON File

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
##### Resulting folder structure

```
cdns
├── DmitryBaranovskiy
│   └── raphael
│       └── v2.1.2
│           └── raphael.js
├── ajax
│   └── libs
│       ├── angularjs
│       │   └── 1.2.3
│       │       ├── angular-resource.js
│       │       └── angular.js
│       ├── json3
│       │   └── 3.2.5
│       │       └── json3.js
│       ├── moment.js
│       │   └── 2.4.0
│       │       ├── lang
│       │       │   └── en-gb.js
│       │       └── moment.js
│       └── sizzle
│           └── 1.10.9
│               └── sizzle.js
└── kriskowal
    └── es5-shim
            └── v2.1.0
                └── es5-shim.js
```

#### Getting a list of paths to include in `<script>` tags

Once a folder is created that holds all of the required dependencies, there will most likely be a need to get a list of all the files in that folder, to include in `<script>` tags, for example. While this sits slightly outside of the scope of this plugin, we do provide a helper module in `/lib` that provides this feature.

##### Basic usage

```javascript
require("grunt-cdndeps")({
  production: true,
  src: "package.json",
  dest: "libraries"
})
```

###### production
Type: `Boolean`

Default: `false`

Whether the resulting list of paths will be used in a production environment.

###### src
Type: `String`

Default: `grunt.config("cdndeps.options.src")`

The source file used by `grunt-cdndeps`.

###### dest
Type: `String`

Default: `grunt.config("cdndeps.options.dest")`

The target folder used by `grunt-cdndeps`.

If `production` is set to `true`, a list of the actual URLs from the JSON will be returned, but with `.min.js` appended. If `false`, a list of filepaths to the libraries in the `cdn_folder` will be returned.

For cases where simply appending ".min.js" to a given URL will produce an invalid result, you can define a URL as an object instead of a String:

```
[
  "//ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular-resource.js",
  "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.4.0/moment.js",
  {
    "dev": "https://raw.github.com/DmitryBaranovskiy/raphael/v2.1.2/raphael.js",
    "prod": "//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js"
  }
]
```

In the above case, calling `cdn_paths` with `production: true` will give us `//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js`. With `production: false`, we will instead get `cdns/DmitryBaranovskiy/raphael/v2.1.2/raphael.js`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
