<template>
  <div>
    <CreatDatable
      id="creat-datatable"
      v-model:sort="sorting"
      :infos="dataTableInfos"
    >
      <template #id="category">
        <strong>{{ category.data.id }}</strong>
      </template>

      <template #lastname="category">
        <strong>{{ category.data.lastname }}</strong>
      </template>

      <template #firstname="category">
        <strong>{{ category.data.firstname }}</strong>
      </template>
    </CreatDatable>
  </div>
</template>

<script setup>
import { ref } from "vue";

const dataTableInfos = {
  headers: [
    {
      id: "id",
      label: "ID",
    },
    {
      id: "firstname",
      label: "Prénom",
    },
    {
      id: "lastname",
      label: "Nom",
    },
  ],
  data: [
    { id: 0, firstname: "John", lastname: "Doe" },
    { id: 1, firstname: "Rocco", lastname: "Appleseed" },
    { id: 2, firstname: "Jak", lastname: "Schultz" },
    { id: 3, firstname: "Ibraheem", lastname: "Massey" },
    { id: 4, firstname: "Joanne", lastname: "Kerr" },
    { id: 5, firstname: "Verity", lastname: "Powers" },
  ],
};

const sorting = ref(["lastname", "desc"]);
</script>
