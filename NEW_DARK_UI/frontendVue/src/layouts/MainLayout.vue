<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container container class="bg-grey-6 row justify-center" :class="$q.platform.is.mobile ? '' : 'q-pa-md'">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout'
};
</script>
