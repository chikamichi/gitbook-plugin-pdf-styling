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

## ImageMagick

I think I'm gonna handle some very simple, very likely use-cases: "fill" area (true/false), gravity exposed as "position" (http://www.imagemagick.org/script/command-line-options.php?#gravity). For the most complex use-cases, I'll let the user provide ImageMagick options directly ("magick").

I also must take the paperSize into account. Pb, calibre has its own list, https://github.com/GitbookIO/gitbook/blob/4e90becd525e88905c44d3f8a3984885c7c9014d/lib/config_default.js, which is not recognized by IM. So I'm probably going to maintain a match table: http://stackoverflow.com/questions/11693137/how-do-i-control-pdf-paper-size-with-imagemagick

We can assume 72 dpi with calibre's PDF output.

### Example: resize image to a4 & fill page

`convert bg.jpg -resize 595x842^ -gravity Center -extent 595x842 bg.pdf` (portrait)

One must compute the dimensions anyway, using `identity`:

* http://unix.stackexchange.com/questions/20026/convert-images-to-pdf-how-to-make-pdf-pages-same-size
* http://stackoverflow.com/questions/32466048/imagemagick-convert-crop-and-resize
