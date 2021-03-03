<template>
  <div>
    <div class="q-gutter-lg q-mb-sm q-pl-xs">
      <q-radio dark v-model="type" val="income" label="Income" />
      <q-radio dark v-model="type" val="expenses" label="Expense" />
    </div>
    <div class="q-pl-md q-pr-lg">
      <q-select v-model="category" :options="incCategory" label="Income Source" dark class="q-pb-md" v-if="type == 'income'" />
      <q-select v-model="category" :options="expCategory" label="Expense Category" dark class="q-pb-md" v-if="type == 'expenses'" />
      <q-input dark outline v-model="description" label="Description" class="q-pb-md" />
      <q-input dark outline type="number" v-model="amount" label="Amount ($)" class="q-pb-md" />

      <q-banner class="text-white bg-red q-mt-xs q-mb-sm" dense v-if="error"> {{ error }} </q-banner>
      <q-banner class="text-white bg-positive q-mt-xs q-mb-sm" dense v-if="success"> {{ success }} </q-banner>

      <q-btn-group class="q-mt-sm">
        <q-btn color="positive" :icon="edit ? 'edit' : 'add'" outline :label="label" @click="addRecord" />
        <q-btn color="warning" icon="close" outline label="Reset" class="q-ml-md" @click="resetForm" />
      </q-btn-group>
    </div>
  </div>
</template>

<script>
import readWriteData from '../composables/readWriteData';

export default {
  props: ['editFields'],
  data() {
    return {
      error: null,
      success: null,

      type: '',
      category: null,
      description: '',
      amount: '',
      balance: 0,

      edit: false,
      label: 'Add Record',
      incCategory: ['Salary', 'Bonus', 'Rewards', 'Other'],
      expCategory: ['Grocery', 'Rent', 'Utilities', 'Vehicle', 'Family', 'Insurance', 'Travel', 'Miscellaneous']
    };
  },
  watch: {
    type: function() {
      this.category = null;
    }
  },
  created() {
    if (this.editFields.type) {
      this.edit = true;
      this.type = this.editFields.type;
      this.category = this.editFields.category;
      this.description = this.editFields.description;
      this.amount = this.editFields.amount;
      this.label = 'Edit Record';
    } else this.edit = false;
  },
  methods: {
    async addRecord() {
      this.success = null;
      if (!this.type) return (this.error = 'Select Income or Expense!');
      if (this.type == 'income' && !this.category) return (this.error = 'Select Income Source!');
      if (this.type == 'expenses' && !this.category) return (this.error = 'Select Expense Category!');
      if (!this.description) return (this.error = 'Description is Required!');
      if (!this.amount) return (this.error = 'Amount is Required!');

      //If Form is Valid
      try {
        let isoDate = new Date(this.editFields.date).toISOString();
        if (this.edit) {
          const data = { date: isoDate, type: this.type, category: this.category, description: this.description.toString(), amount: this.amount.toString() };
          await readWriteData().editData({ id: this.editFields._id, data });
          this.success = 'Record Updated Successfully!';
        } else {
          const data = { date: isoDate, type: this.type, category: this.category, description: this.description.toString(), amount: this.amount.toString() };
          await readWriteData().addData({ data });
          this.success = 'Record Added Successfully!';
        }
        //Update Balance
        let balance = this.$store.state.balance;
        if (this.edit) {
          if (this.type == 'income') this.balance = Number(balance.amount) + Number(this.amount) - Number(this.editFields.amount);
          if (this.type == 'expenses') this.balance = Number(balance.amount) - Number(this.amount) + Number(this.editFields.amount);
        } else {
          if (this.type == 'income') this.balance = Number(balance.amount) + Number(this.amount);
          if (this.type == 'expenses') this.balance = Number(balance.amount) - Number(this.amount);
        }
        await readWriteData().editData({ id: balance.id, type: 'balance', data: { balance: Number(parseFloat(this.balance).toFixed(2)) } });
        await readWriteData().searchData({ data: this.$store.state.dateRange });
      } catch (err) {
        this.error = 'Error on Server!';
        return;
      }
      this.error = this.type = this.description = this.amount = this.category = this.date = this.readAbleDate = null;
      return;
    },
    resetForm() {
      this.type = this.description = this.amount = this.category = null;
    }
  }
};
</script>

<style></style>
