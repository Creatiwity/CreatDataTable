import { defineNuxtModule, addComponent, createResolver } from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "creat-datatable",
    configKey: "creatDatatable",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    addComponent({
      name: "CreatDatable", // name of the component to be used in vue templates
      export: "CreatDatable", // (optional) if the component is a named (rather than default) export
      filePath: resolver.resolve("runtime/components/DataTable.vue"),
    });
  },
});
