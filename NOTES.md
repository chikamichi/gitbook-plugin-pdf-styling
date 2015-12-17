## Developing locally

A few tips to ease local development for the plugin.

### Linking the module

Use [`npm link`](https://docs.npmjs.com/cli/link) to bind a gitbook-enabled
directory with this plugin.

First, in the plugin directory:

``` sh
npm link
```

Then, in a gitbook-enabled directory:

``` sh
npm link gitbook-plugin-pdf-styling
```

### Debugging

In a gitbook-enabled directory, to build the book in debug mode:

``` sh
rm book.pdf && gitbook pdf . book.pdf --log=debug --debug
```

`--log=debug` sets LOG_LEVEL up to failure, while `--debug` actually enables
debug logging which is normally hidden.

### Using a custom gitbook

Use GitBook's [linking feature](https://github.com/GitbookIO/gitbook#how-to-use-the-latest-commit-from-gitbook-in-gitbook-cli):

``` sh
gitbook versions:link /path/to/cloned/gitbook
```
