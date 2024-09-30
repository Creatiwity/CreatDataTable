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
- &nbsp;Sorting

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
      sortable: false, // default: true
    },
  ],
  data: [{ name: "Toto" }, { name: "Tata" }],
};
```

```html
<CreatDatable id="creat-datatable" :infos="dataTableInfos" table-class="class">
  <template #header-name="category">
    <span>{{ category.data.name }}</span>
    <input />
  </template>
  <template #name="category">
    <strong>{{ category.data.name }}</strong>
  </template>
  <template #empty-state>
    <p>No data</p>
  </template>
</CreatDatable>
```

## Style

To change th and td style

```ts
const dataTableInfos = {
  headers: [
    {
      id: "id",
      label: "ID",
      thClass: "centerth",
    },
  ],

  content: [
    {
      id: "id",
      tdClass: "class",
    },
  ],
};
```

## Type

```html
<CreatDatable type="local" />
```

By default type is `local`

Type `local` will directly change the dataTable data depending on the actions

With the type `remote` you need to add v-model to control the data change

## Sort

```html
<CreatDatable v-model:sort="sorting" />
```

```ts
const dataTableInfos = {
  headers: [
    {
      id: "firstname",
      label: "Prénom",
      sortable: true,
    },
  ],
};

const sorting = ref(["firstname", "desc"]);
```

Set the id you want to sort and the direction `desc` or `asc`

## Filters

```html
<CreatDatable
  v-model:filters="filtering"
  :filters-config="{
    class: 'class',
  }"
/>
```

```ts
const dataTableInfos = {
  headers: [
    {
      id: "firstname",
      label: "Prénom",
      filtering: true,
    },
  ],
};

const filtering = ref({});
```

On input it will return data like this `filtering = { "firstname": "j" }`

## Checkbox

```html
<CreatDatable
  v-model:checkbox="checkbox"
  :checkbox-config="{
    overFilterMode: 'delete',
    class: 'checkboxTest',
  }"
/>
```

`overFilterMode` is to be used with the `filters` action, by default it's set to `keep` so when the checkbox of a line is selected it's doesn't deselect all the checkbox if you are typing in a filter input.
And the mode `delete` clear all the checkbox if you are typing in a filter input

```ts
const checkbox = ref([]);
```

On checkbox selection the array will look like [{ id: 0, firstname: "John" }, { id: 1, firstname: "Jack" }]

## Pagination

```html
<CreatDatable
  :pagination-config="{
    itemsPerPage: 5,
    currentPage: 1,
    nbItems: 20,
    paginationClass: 'class',
    previousButtonClass: 'class',
    nextButtonClass: 'class',
  }"
  :on-page-change="(page) => console.log('new page index = ', page)"
/>
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
