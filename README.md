<h1 align="center">Html to PDF 📓</h1>
<p align="center">
  Easily convert HTML to PDF
</p>
<p align="center">
  <a href="https://npmjs.org/package/@alessiofrittoli/html-to-pdf">
    <img src="https://img.shields.io/npm/v/@alessiofrittoli/html-to-pdf" alt="Latest version"/>
  </a>
  <a href="https://coveralls.io/github/alessiofrittoli/html-to-pdf">
    <img src="https://coveralls.io/repos/github/alessiofrittoli/html-to-pdf/badge.svg" alt="Test coverage"/>
  </a>
  <a href="https://socket.dev/npm/package/@alessiofrittoli/html-to-pdf/overview">
    <img src="https://socket.dev/api/badge/npm/package/@alessiofrittoli/html-to-pdf" alt="Socket Security score"/>
  </a>
  <a href="https://npmjs.org/package/@alessiofrittoli/html-to-pdf">
    <img src="https://img.shields.io/npm/dm/@alessiofrittoli/html-to-pdf.svg" alt="npm downloads"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/html-to-pdf">
    <img src="https://badgen.net/bundlephobia/dependency-count/@alessiofrittoli/html-to-pdf" alt="Dependencies"/>
  </a>
  <a href="https://libraries.io/npm/%40alessiofrittoli%2Fhtml-to-pdf">
    <img src="https://img.shields.io/librariesio/release/npm/@alessiofrittoli/html-to-pdf" alt="Dependencies status"/>
  </a>
</p>
<p align="center">
  <a href="https://bundlephobia.com/package/@alessiofrittoli/html-to-pdf">
    <img src="https://badgen.net/bundlephobia/min/@alessiofrittoli/html-to-pdf" alt="minified"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/html-to-pdf">
    <img src="https://badgen.net/bundlephobia/minzip/@alessiofrittoli/html-to-pdf" alt="minizipped"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/html-to-pdf">
    <img src="https://badgen.net/bundlephobia/tree-shaking/@alessiofrittoli/html-to-pdf" alt="Tree shakable"/>
  </a>
</p>
<p align="center">
  <a href="https://github.com/sponsors/alessiofrittoli">
    <img src="https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2" alt="Fund this package"/>
  </a>
</p>

[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

### Table of Contents

- [Getting started](#getting-started)
- [Development](#development)
  - [Local development](#local-development)
  - [Production build](#production-build)
  - [Unit tests](#unit-tests)
    - [Run tests with coverage](#run-tests-with-coverage)
  - [Contributing](#contributing)
  - [Security](#security)
- [API Reference](#api-reference)
- [Examples](#examples)
  - [Basic usage](#basic-usage)
  - [Generate a PDF from a webpage](#generate-a-pdf-from-a-webpage)
  - [Store generated PDF into a file](#store-generated-pdf-into-a-file)
  - [Disabling inline CSS](#disabling-inline-css)
  - [Loading custom fonts](#loading-custom-fonts)
    - [Load custom font from remote URL](#load-custom-font-from-remote-url)
    - [Load custom font declaration from local file](#load-custom-font-declaration-from-local-file)
    - [Load custom font from local file](#load-custom-font-from-local-file)
  - [Generating multiple pdf with the same constructed instance](#generating-multiple-pdf-with-the-same-constructed-instance)
  - [Rendering Readable Streams](#rendering-readable-streams)
- [Credits](#made-with-)

---

### Getting started

Run the following command to start using `html-to-pdf` in your projects:

```bash
npm i @alessiofrittoli/html-to-pdf
```

or using `pnpm`

```bash
pnpm i @alessiofrittoli/html-to-pdf
```

---

### Development

Run the following to start development

```shell
nvm use

pnpm i
```

#### Local development

Run the following

```shell
pnpm dev
```

This will generate unminified output code, sourcemaps and will enable source file watcher.

---

#### Production build

Run the following to create a local production build

```shell
pnpm build
```

This will generate minified output code without sourcemaps.

---

#### Unit tests

Run all the defined test suites by running the following:

```shell
# Run tests and watch file changes.
pnpm test:watch

# Run tests in a CI environment.
pnpm test:ci
```

---

##### Run tests with coverage

An HTTP server is then started to serve coverage files from `./coverage` folder.

⚠️ You may see a blank page the first time you run this command. Simply refresh the browser to see the updates.

```shell
pnpm test:coverage:serve
```

---

#### Contributing

Contributions are truly welcome!

Please refer to the [Contributing Doc](./CONTRIBUTING.md) for more information on how to start contributing to this project.

Help keep this project up to date with [GitHub Sponsor][sponsor-url].

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

---

#### Security

If you believe you have found a security vulnerability, we encourage you to **_responsibly disclose this and NOT open a public issue_**. We will investigate all legitimate reports. Email `security@alessiofrittoli.it` to disclose any security vulnerabilities.

---

### API Reference

#### Supported input types

We accept multiple input types to provide high flexibility by using [`coerceToUint8Array()`](https://npmjs.com/package/@alessiofrittoli/crypto-buffer#coercetouint8array) exported by [@alessiofrittoli/crypto-buffer](https://npmjs.com/package/@alessiofrittoli/crypto-buffer) which gives us a standard view of the provided data.

See [`coerceToUint8Array()`](https://npmjs.com/package/@alessiofrittoli/crypto-buffer#coercetouint8array) for a list of supported data type.

---

### Examples

#### Basic usage

```ts
import { PDF } from '@alessiofrittoli/html-to-pdf'

const content = `
  <html>
    <body>
      <h1>My first PDF!</h1>
    </body>
  </html>
`

const buffer = await new PDF({ content }).generate()
// do something with pdf `buffer`
```

---

#### Generate a PDF from a webpage

```ts
import { PDF } from '@alessiofrittoli/html-to-pdf'

const url = 'https://google.com'

const buffer = await new PDF({ url }).generate()
// do something with pdf `buffer`
```

---

#### Store generated PDF into a file

```ts
import { PDF } from '@alessiofrittoli/html-to-pdf'
import { join } from 'path'

const content = `...`
const path = 'folder/my-first-pdf.pdf'

const buffer = await new PDF({ content, path }).generate()
// do something else with pdf `buffer`
```

---

#### Disabling inline CSS

By default all styles defined in a `<style />` HTML tag get applied to the corresponding HTML NodeElement. You can opt-out by this behavior by setting `inlineCss` to `false`.

This may be usefull to properly load custom fonts using `@font-face` declaration. If you still want to inline CSS (which is recommended) but load custom fonts, please read [Loading custom fonts](#loading-custom-fonts) section.

```ts
import { PDF } from '@alessiofrittoli/html-to-pdf'

const content = `
  <html>
    <head>
      <style>
        ...
      </style>
    </head>
    <body>
      <h1>My first PDF!</h1>
    </body>
  </html>
`

// parsed markup will contain `<style />` tag before rendering the PDF.
await new PDF({ content }).generate()
```

---

#### Loading custom fonts

You can load additional styles that won't be parsed before rendering the PDF by defining URLs, paths or CSS declarations through the `GeneratePdfOptions.styles` option.

##### Load custom font from remote URL

```ts
import { PDF, type StyleTagsOptions } from '@alessiofrittoli/html-to-pdf'

const content = `
  <html class='corinthia-regular'>
    <head>
      <style>
        .corinthia-regular {
          font-family: "Corinthia", cursive;
          font-weight: 400;
          font-style: normal;
        }
      </style>
    </head>
    <body>
      <h1>My first PDF!</h1>
    </body>
  </html>
`

const styles: StyleTagsOptions = [{ url: 'https://fonts.googleapis.com/css2?family=Corinthia&display=swap' }]

const pdf = new PDF({ content, styles })
```

---

##### Load custom font declaration from local file

```ts
import { PDF, type StyleTagsOptions } from '@alessiofrittoli/html-to-pdf'
import { join } from 'path'

const content = `
  <html class='corinthia-regular'>
    <head>
      <style>
        .corinthia-regular {
          font-family: "Corinthia", cursive;
          font-weight: 400;
          font-style: normal;
        }
      </style>
    </head>
    <body>
      <h1>My first PDF!</h1>
    </body>
  </html>
`

const styles: StyleTagsOptions = [{ path: join(process.cwd(), 'font-css-file-declaration.css') }]

const pdf = new PDF({ content, styles })
```

---

```css
/* font-css-file-declaration.css */
/* latin */
@font-face {
  font-family: 'Corinthia';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/corinthia/v13/wEO_EBrAnchaJyPMHE01VvoK_kgXiQ.woff2) format('woff2');
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
    U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

---

##### Load custom font from local file

If you need to load a custom font that will be available in off-line conditions or you don't want to depend on external resources, you can embed the font by encoding it to base64.

```ts
import { PDF, type StyleTagsOptions } from '@alessiofrittoli/html-to-pdf'
import { Base64 } from '@alessiofrittoli/crypto-encoder'
import { join } from 'path'

const content = `
  <html class='corinthia-regular'>
    <head>
      <style>
        .corinthia-regular {
          font-family: "Corinthia", cursive;
          font-weight: 400;
          font-style: normal;
        }
      </style>
    </head>
    <body>
      <h1>My first PDF!</h1>
    </body>
  </html>
`

const fontBasePath = resolve(process.cwd(), 'assets/fonts/Corinthia')
const fontfile = readFileSync(join(fontBasePath, 'local-font-filename.woff2'))
const fontBase64 = Base64.encode(fontfile, false)
const css = readFileSync(join(fontBasePath, 'font-css-file-declaration.css'), 'utf-8').replace(
  'url(custom-font-url)',
  `url(data:font/woff2;base64,${fontBase64})`,
)

const styles: StyleTagsOptions = [{ content: css }]

const pdf = new PDF({ content, styles })
```

---

```css
/* font-css-file-declaration.css */
/* latin */
@font-face {
  font-family: 'Corinthia';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(custom-font-url) format('woff2');
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
    U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

---

#### Generating multiple pdf with the same constructed instance

You can generate multiple PDFs with a single constructed instance of `PDF` which shares common options and eventually override or add new options for each generated pdf.

This is possible since customization options can be either passed to the `PDF` constructor or to the `PDF.generate()` method.

> [!WARNING]
> Note that you cannot generate multiple PDFs with the same ReadableStream since it can be read once.
> If you still need to do so, please set the `content` once by passing the `ReadableStream` in the constructor.
> Please refer to the [Rendering Readable Streams](#rendering-readable-streams) section for more info.

```ts
import { PDF } from '@alessiofrittoli/html-to-pdf'

const pdf = new PDF({
  format: 'A4',
  styles: [{ path: '/absolute/path/to/custom/style.css' }],
})

await pdf.generate({ content: 'PDF 1', path: 'folder/pdf-1.pdf' })
await pdf.generate({
  content: 'PDF 2',
  path: 'folder/pdf-2.pdf',
  format: 'A3',
  landscape: true,
})
```

---

#### Rendering Readable Streams

In addition to the various [supported input types](#supported-input-types), this library also supports `ReadableStreams` (it happens more often than you think).

In this example we render async React Server Components inside a PDF page.

Asynchronous React Server Components needs to be rendered using [`renderToReadableStream()`](https://react.dev/reference/react-dom/server/renderToReadableStream) which returns a Promise that resolves a `ReadableStream` so this is a perfect example on how to deal with it.

> [!WARNING]
>
> Make sure to install [`@alessiofrittoli/stream-reader`](https://npmjs.com/package/@alessiofrittoli/stream-reader) package in order to use this feature.

```tsx
import { PDF } from '@alessiofrittoli/html-to-pdf'

const MyAsyncPdfComponent: React.FC = async () => {
  await { ...someAsyncTask }

  return (
    <html>
      <body>
        <h1>My React PDF Component</h1>
      </body>
    </html>
  )
}

const { renderToReadableStream } = await import('react-dom/server')

const content = await renderToReadableStream(<MyAsyncPdfComponent />)
const pdf = new PDF({ content })

await pdf.generate()
```

---

### Made with ☕

<table style='display:flex;gap:20px;'>
  <tbody>
    <tr>
      <td>
        <img alt="avatar" src='https://avatars.githubusercontent.com/u/35973186' style='width:60px;border-radius:50%;object-fit:contain;'>
      </td>
      <td>
        <table style='display:flex;gap:2px;flex-direction:column;'>
          <tbody>
              <tr>
                <td>
                  <a href='https://github.com/alessiofrittoli' target='_blank' rel='noopener'>Alessio Frittoli</a>
                </td>
              </tr>
              <tr>
                <td>
                  <small>
                    <a href='https://alessiofrittoli.it' target='_blank' rel='noopener'>https://alessiofrittoli.it</a> |
                    <a href='mailto:info@alessiofrittoli.it' target='_blank' rel='noopener'>info@alessiofrittoli.it</a>
                  </small>
                </td>
              </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
