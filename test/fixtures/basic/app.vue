<template>
  <div>
    <CreatDatable id="datatable" :infos="dataTableInfos">
      <template #header-firstname>
        <span>CUSTOM_FIRSTNAME</span>
      </template>
    </CreatDatable>
  </div>
</template>

<script setup>
const dataTableInfos = {
  headers: [
    { id: 'firstname', label: 'Firstname' },
    { id: 'lastname', label: 'Lastname' },
  ],
  data: [
    { firstname: 'John', lastname: 'Doe' },
  ],
}
</script>
