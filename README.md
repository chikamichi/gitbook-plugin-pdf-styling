Post-processing GitBook PDF made easy
=====================================

By default, GitBook generates very simple, black-on-white PDF documents. Although one can achieve some degree of customization through [`styles/pdf.css`](https://help.gitbook.com/styling/book.html) and the use of `book.json` to provide [custom headers and footers](https://help.gitbook.com/format/configuration.html), some operations remain out of reach. For instance, one cannot set a background, although common use-cases for a custom background include watermarking/stamping or even adding a nice color/texture.

This plugin allows you to perform some common post-processing operations. Features:

- [ ] background or foreground watermarking (soon)
- [ ] colorful background (soon)
- [ ] texture-based background (soon)

## Using the plugin on gitbook.com

The plugin is available from the *Plugin Store* under the name [pdf-styling](https://plugins.gitbook.com/plugin/pdf-styling).

To activate it, while editing your book, open the *Plugin Store* menu and look for "PDF Styling".

Then, have a look at the "Usage" section below for further information on how to use the plugin.

## Local installation

Either install the plugin manually:

```
$ npm install gitbook-plugin-pdf-styling
```

Or add it to your book's `package.json` and run `gitbook install`.

All binary dependencies are bundled with the plugin. When using the plugin locally though, you may install custom versions and the plugin will use them if they're available in your PATH:

* [pdftk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) (note: under most GNU/Linux distributions, usually available as a `pdftk` system package)

Then, have a look at the "Usage" section below for further information on how to use the plugin.

## How to use it:

In your **book.json**:

```
{
    "plugins": ["pdf-styling"],
    "pluginsConfig": {
        "pdf-styling": {
            // Configuration for pdf-styling (see below)
        }
    }
}
```

## Configuration

Configuration for **pdf-styling**:

```js
{
    // One can use only one of those three background options at once.
    "background": {
        "color": "#E2E2E2",
        "image": "path/to/your/image.ext",
        "texture": "path/to/your/texture.ext"
    },
    // One can use only one of those two foreground options at once.
    "foreground": {
        "image": "path/to/your/image.ext",
        "texture": "path/to/your/texture.ext"
    }
}
```

## Usage

### Setting a background

Soon…
