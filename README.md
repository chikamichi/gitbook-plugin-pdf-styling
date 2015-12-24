# Post-processing your GitBook PDFs made easy

By default, GitBook generates very simple, clean, black-on-white PDF documents. Although one can achieve some degree of customization through [`styles/pdf.css`](https://help.gitbook.com/styling/book.html) and the use of `book.json` to provide [custom headers and footers](https://help.gitbook.com/format/configuration.html), some operations remain out of reach. For instance, one cannot set a background or foreground layers, although common use-cases include watermarking/stamping, or even simply adding a nice color/texture to the document.

This plugin allows you to perform some common post-processing operations. It features:

* [x] **setting an image as background** (with fill-page mode supported)
* [ ] *setting a colorful background (soon)*
* [ ] *setting a texture-based background (soon)*
* [ ] *performing foreground stamping (soon)*

## Using the plugin

### On gitbook.com

The plugin is available from the *Plugin Store* under the name [pdf-styling](https://plugins.gitbook.com/plugin/pdf-styling).

To activate it, while editing your book, open the *Plugin Store* menu and look for "pdf-styling".

Do not use the GUI configuration feature from gitbook.com. Have a look at the "Usage" section below instead for further information on how to configure and use the plugin.

### Local installation

If you plan on generating PDF documents locally, you should add `pdf-styling` to the `plugins` list in your `book.json`, then run `gitbook install`.

Some binary dependencies are bundled with the plugin:

* [`pdftk`](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/)

You will need to have [`imagemagick`](http://www.imagemagick.org/script/index.php) installed locally, though.

Then, have a look at the "Usage" section below for further information on how to configure and use the plugin.

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

You must provide a valid path with the `image` property (there is no default value). The path is relative to your GitBook project.

#### Position

The image will be centered by default. You can specify the position by setting an aptly named `position` property:

``` json
"pdf-styling": {
  "background": {
    "image": "path/to/image.ext",
    "position": "northwest"
  }
}
```

Available positions: `center` (default), `north`, `northeast`, `east`, `southeast`, `south`, `southwest`, `west`, `northwest`.

#### Offsets

Depending on the `position`, you may specify horizontal and/or vertical offsets. For instance, the `northwest` position allows for both directions to be set, whereas the `north` position only allows for the vertical one. The "center" position is not affected by offsets. Think of offsetting as "unsticking from an edge or corner".

You can provide either one or two values:

``` js
"20x50" // 20pt offset on the horizontal axis, 50pt offset on the vertical axis.
"10" // 10pt offset on both directions.
```

``` js
"0x50" // Fits "north" or "south" positions.
"50x0" // Fits "west" and "east" positions.
"10" // Fits any corner position ("northwest", "northeast", etc.)
"20x70" // Fits any corner position.
```

An example configuration could then look like this:

``` json
"pdf-styling": {
  "background": {
    "image": "path/to/image.ext",
    "position": "northwest",
    "offset": "10x20"
  }
}
```

### Using a full-page image as background

You can have your image filling the whole page by enabling the `fill` property:

``` json
"pdf-styling": {
  "background": {
    "image": "path/to/image.ext",
    "fill": true
  }
}
```

Note: all specified properties but `image` will be ignored in `fill` mode.
