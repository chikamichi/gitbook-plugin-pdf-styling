Post-processing GitBook PDF made easy
=====================================

By default, GitBook generates very simple, black-on-white PDF documents. Although one can achieve some degree of customization through [`styles/pdf.css`](https://help.gitbook.com/styling/book.html) and the use of `book.json` to provide [custom headers and footers](https://help.gitbook.com/format/configuration.html), some operations remain out of reach. For instance, one cannot set a background, although common use-cases for a custom background include watermarking/stamping or even adding a nice color/texture.

This plugin allows you to perform some common post-processing operations. Features:

* [x] **image as background** (fill-page mode supported)
* [ ] *colorful background (soon)*
* [ ] *texture-based background (soon)*
* [ ] *foreground stamping (soon)*

## Using the plugin on gitbook.com

The plugin is available from the *Plugin Store* under the name [pdf-styling](https://plugins.gitbook.com/plugin/pdf-styling).

To activate it, while editing your book, open the *Plugin Store* menu and look for "PDF Styling".

Then, have a look at the "Usage" section below for further information on how to use the plugin.

## Local installation

Either install the plugin manually:

```
$ npm install gitbook-plugin-pdf-styling
```

Or add it to the `plugins` list in your `book.json`, then run `gitbook install`.

Some binary dependencies are bundled with the plugin:

* [`pdftk`](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/)

You will need to have [`imagemagick`](http://www.imagemagick.org/script/index.php) installed locally, though.

Then, have a look at the "Usage" section below for further information on how to use the plugin.

## Configuration

In your **book.json**:

``` json
{
  "plugins": ["pdf-styling"],
  "pluginsConfig": {
    "pdf-styling": {
    }
  }
}
```

## Usage

Simply append the configuration you need within the empty `pdf-styling` property.

### Using an image as background

``` json
"pdf-styling": {
  "background": {
    "image": "path/to/image.ext"
  }
}
```

With the "background" mode, you MUST provide an `image` property, with a valid path. The path is relative to your GitBook project.

The image will be centered by default. You can specify the position by providing an aptly named `position` property:

``` json
"pdf-styling": {
  "background": {
    "image": "path/to/image.ext",
    "position": "northwest"
  }
}
```

Available positions: `center` (default), `north`, `northeast`, `east`, `southeast`, `south`, `southwest`, `west`, `northwest`.

### Using a full-page image as background

You can have your image fill the whole page by setting the `fill` property:

``` json
"pdf-styling": {
  "background": {
    "image": "path/to/image.ext",
    "fill": true
  }
}
```

Any specified `position` property will be ignored in this mode.
