import {
  defineNuxtModule,
  addComponent,
  createResolver,
  addImportsDir,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@creatiwity/datatable",
    configKey: "creatDatatable",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup() {
    const resolver = createResolver(import.meta.url);

    addComponent({
      name: "CreatDatable", // name of the component to be used in vue templates
      filePath: resolver.resolve("runtime/components/DataTable.vue"),
    });

    addImportsDir(resolver.resolve("runtime/types"));
  },
});
