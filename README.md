# Creat Datatable

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

:warning: This package is under development stay tuned. :warning:

Nuxt3 Typescript Simple Datatable that handles dynamic row content with generic typing

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

<!-- Highlight some of the features your module provide here -->

- &nbsp;Table
- &nbsp;Generic typing
- &nbsp;Dynamic row content

## Quick Setup

1. Add `@creatiwity/datatable` dependency to your project

```bash
# Using pnpm
pnpm add @creatiwity/datatable

# Using yarn
yarn add @creatiwity/datatable

# Using npm
npm install @creatiwity/datatable
```

2. Add `@creatiwity/datatable` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["@creatiwity/datatable"],
});
```

That's it! You can now use Creat Datatable in your Nuxt app ✨

## Usage

```ts
const dataTableInfos = {
  headers: [
    {
      id: "name",
      label: "Nom",
    },
  ],
  data: [{ name: "Toto" }, { name: "Tata" }],
};
```

```html
<CreatDatable id="creat-datatable" :infos="dataTableInfos">
  <template #name="category">
    <strong>{{ category.data.name }}</strong>
  </template>
</CreatDatable>
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@creatiwity/datatable/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@creatiwity/datatable
[npm-downloads-src]: https://img.shields.io/npm/dm/@creatiwity/datatable.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@creatiwity/datatable
[license-src]: https://img.shields.io/npm/l/@creatiwity/datatable.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@creatiwity/datatable
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
