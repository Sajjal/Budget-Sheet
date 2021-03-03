<template>
  <q-page class="flex column text-white shadow-2 bg-grey-10" style="width:450px">
    <div class="text-h5 q-pb-md q-pt-lg">
      <center>S & D Budget Sheet</center>
    </div>

    <q-input dark filled v-model="input" label="Please Enter the Access Code !" @keyup.enter="handleSubmit" class="q-pa-md">
      <template v-slot:append>
        <q-icon v-if="input === ''" name="lock" />
        <q-icon v-else name="clear" class="cursor-pointer" @click="input = ''" />
      </template>
    </q-input>

    <q-banner dense class="bg-red text-white q-mt-xs q-ml-md q-mr-md q-mb-sm" v-if="loginError">
      <template v-slot:avatar>
        <q-icon name="report" />
      </template>
      {{ loginError }}
    </q-banner>

    <q-btn color="primary" icon-right="send" label="Submit" class="q-mt-sm q-ml-md q-mr-md" @click="handleSubmit" />
  </q-page>
</template>

<script>
import readWriteData from '../composables/readWriteData';
export default {
  data() {
    return {
      input: '',
      loginError: false
    };
  },
  mounted() {
    this.input = '';
    this.loginError = null;
  },
  methods: {
    async handleSubmit() {
      if (!this.input) return (this.loginError = 'Access Code is Required!');
      const response = await readWriteData().login(this.input);
      if (response.Error) this.loginError = response.Error;
      else {
        this.loginError = null;
        this.$router.push({ name: 'Dashboard' });
      }
    }
  }
};
</script>

<style></style>
