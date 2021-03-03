<template>
  <q-page class="flex column text-white shadow-2 " style="width:450px">
    <q-toolbar class="bg-black text-white q-pt-sm q-pb-sm q-mb-sm">
      <q-icon name="assessment" size="3em" flat class="q-ml-none q-pl-none" />

      <q-toolbar-title>
        <q-item-label class="text-white"> S & D Budget Sheet</q-item-label>
        <q-item-label caption lines="2" class="text-grey-3">{{ datesHeader.from }} to {{ datesHeader.to }}</q-item-label>
      </q-toolbar-title>

      <q-btn round color="primary" icon="date_range" dense>
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="dateRange" range dark minimal mask="YYYY-MM-DD">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Search" icon="search" color="primary" flat @click="explore" />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
      <q-btn round color="negative" icon="logout" @click="logout" dense class="q-ml-sm q-mr-sm" />
    </q-toolbar>

    <div v-if="$store.state.balance">
      <div class="summary">
        <q-item>
          <q-item-section>
            <PieChart />
          </q-item-section>
          <q-item-section class="q-pa-sm">
            <div class="q-pl-sm">
              <q-item class="bg-grey-2 text-black soft-border">
                <q-icon left size="3em" name="account_balance" color="black" />
                <q-item-section>
                  <q-item-label class="subheading"> Balance</q-item-label>
                  <q-item-label :class="$store.state.balance.amount > 0 ? 'text-positive text-subtitle2' : 'text-negative text-subtitle2'"> ${{ $store.state.balance.amount }} </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="bg-grey-2 text-black q-mt-sm soft-border">
                <q-item-section>
                  <q-chip square class="bg-grey-2 text-subtitle2 text-positive q-pl-sm q-ml-none q-mb-none q-pr-none q-mr-none" v-if="$store.state.transactions.financialStatus">
                    <q-icon name="local_atm" class="q-mr-md" size="2em" /> ${{ $store.state.transactions.financialStatus.Income }}
                  </q-chip>
                  <q-chip
                    square
                    class="bg-grey-2 q-mt-none q-pt-none text-subtitle2 text-negative q-pl-sm q-ml-none q-mb-none q-pb-none q-pr-none q-mr-none"
                    v-if="$store.state.transactions.financialStatus"
                  >
                    <q-icon name="moving" class="q-mr-md" size="2em" /> ${{ $store.state.transactions.financialStatus.Expenses }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </div>
          </q-item-section>
        </q-item>
      </div>

      <div class="transactions q-mt-sm">
        <q-item class="q-pl-sm q-pr-lg q-mb-sm shadow-2">
          <q-item-section class="text-h6 q-pl-sm">
            {{ currentSelection }}
          </q-item-section>
          <q-item-section side>
            <q-icon name="list_alt" style="cursor:pointer;" @click="showAllTransactions" />
          </q-item-section>
          <q-item-section side>
            <q-icon name="local_atm" style="cursor:pointer;" @click="showIncome" />
          </q-item-section>
          <q-item-section side>
            <q-icon name="moving" style="cursor:pointer;" @click="showExpenses" />
          </q-item-section>
          <q-item-section side v-if="!add">
            <q-icon name="edit" @click="edit = !edit" style="cursor:pointer;" />
          </q-item-section>
          <q-item-section side>
            <q-avatar :color="addButtonColor" text-color="white" icon="add" style="cursor:pointer;" @click="addNew" />
          </q-item-section>
        </q-item>

        <div v-if="add">
          <InputForm :editFields="editFields" />
        </div>

        <div class="history" v-else>
          <q-select borderless dense v-model="category" :options="filterCategory" label="Filter by Category..." dark class="q-pl-lg q-pr-lg q-pb-md" v-if="displayFilter" />
          <q-item class="q-pl-md q-pr-lg" v-for="item in transactionsToShow" :key="item._id">
            <q-item-section top avatar>
              <q-avatar :color="item.color" text-color="white" :icon="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.description }}</q-item-label>

              <q-item-label caption lines="2" class="text-white">{{ item.date }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label :class="item.type == 'income' ? 'text-positive text-subtitle2' : 'text-negative text-subtitle2'">
                {{ item.type == 'income' ? `+$${item.amount}` : `-$${item.amount}` }}
              </q-item-label>
            </q-item-section>
            <q-item-section side v-if="edit">
              <q-icon name="edit" size="xs" style="cursor:pointer;" @click="editData(item)" />
            </q-item-section>
          </q-item>
        </div>
      </div>
    </div>

    <div v-else>
      <q-page class="flex column text-white container q-pa-md">
        <q-input dark filled type="number" v-model="balance" label="Opening Balance ($)" @keyup.enter="addOpeningBalance"> </q-input>
        <q-btn color="primary" icon-right="send" label="Submit" class="q-mt-md" @click="addOpeningBalance" />
      </q-page>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar';
import readWriteData from '../composables/readWriteData';
import PieChart from '../components/ApexPieChart';
import InputForm from '../components/InputForm';

export default {
  name: 'Index',
  components: { PieChart, InputForm },
  data() {
    return {
      add: false,
      edit: false,
      editFields: {},
      balance: null,
      datesHeader: { from: '', to: '', today: '' },
      addButtonColor: 'primary',
      dateRange: { from: '', to: '' },
      currentSelection: 'Transactions',
      transactionsToShow: [],

      displayFilter: false,
      category: '',
      incCategory: ['Salary', 'Bonus', 'Rewards', 'Other'],
      expCategory: ['Grocery', 'Rent', 'Utilities', 'Vehicle', 'Family', 'Insurance', 'Travel', 'Miscellaneous'],
      filterCategory: []
    };
  },
  async mounted() {
    this.getDate();
    let dateRange = { from: this.dateRange.from, to: this.dateRange.to };
    this.$store.dispatch('updateDateRange', dateRange);
    await this.getData();
    this.transactionsToShow = this.$store.state.transactions.allTransactions;
  },
  watch: {
    category: function() {
      if (this.category) {
        let filteredTransactions = [];
        for (let i = 0; i < this.$store.state.transactions.allTransactions.length; i++) {
          if (this.$store.state.transactions.allTransactions[i].category == this.category) filteredTransactions.push(this.$store.state.transactions.allTransactions[i]);
        }
        this.transactionsToShow = filteredTransactions;
      }
    }
  },
  methods: {
    async getData() {
      let data = { from: this.dateRange.from, to: this.dateRange.to };
      this.dateRange = {};
      return await readWriteData().searchData({ data });
    },
    showIncome() {
      this.add = false;
      this.currentSelection = 'Income';
      this.addButtonColor = 'primary';
      this.edit = false;
      this.displayFilter = true;
      this.category = null;
      this.filterCategory = this.incCategory;
      this.transactionsToShow = this.$store.state.transactions.incomeTransactions;
      this.$store.dispatch('updateChartOptions', this.$store.state.transactions.income);
    },
    showExpenses() {
      this.add = false;
      this.currentSelection = 'Expenses';
      this.addButtonColor = 'primary';
      this.edit = false;
      this.category = null;
      this.displayFilter = true;
      this.filterCategory = this.expCategory;
      this.transactionsToShow = this.$store.state.transactions.expensesTransactions;
      this.$store.dispatch('updateChartOptions', this.$store.state.transactions.expenses);
    },
    showAllTransactions() {
      this.add = false;
      this.currentSelection = 'Transactions';
      this.addButtonColor = 'primary';
      this.edit = false;
      this.category = null;
      this.displayFilter = false;
      this.transactionsToShow = this.$store.state.transactions.allTransactions;
      this.$store.dispatch('updateChartOptions', this.$store.state.transactions.financialStatus);
    },
    async explore() {
      this.displayFilter = false;
      this.category = null;
      this.getDate(this.dateRange);
      await this.getData();
      this.transactionsToShow = this.$store.state.transactions.allTransactions;
    },
    addNew() {
      if (!this.add) {
        this.editFields = { category: null, date: this.datesHeader.today };
        this.add = true;
        this.currentSelection = 'Add Record';
      }
    },
    editData(item) {
      this.addButtonColor = 'grey-5';
      this.editFields = item;
      this.add = true;
      this.currentSelection = 'Edit Record';
    },
    getDate(userDate = null) {
      if (!userDate) {
        let timeStamp = Date.now();
        let currentDate = date.formatDate(timeStamp, 'YYYY-MM-DD');
        let currentDateString = date.formatDate(timeStamp, 'DD MMM YYYY');

        let dateArray = currentDate.split('-');
        let dateStringArray = currentDateString.split(' ');
        let firstDayOfMonthString = `01 ${dateStringArray[1]} ${dateStringArray[2]}`;

        let newDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        newDate = date.addToDate(newDate, { days: 1 });

        this.dateRange.from = `${dateArray[0]}-${dateArray[1]}-01`;
        this.dateRange.to = date.formatDate(newDate, 'YYYY-MM-DD');

        this.datesHeader.today = date.formatDate(timeStamp, 'YYYY-MM-DD');
        this.datesHeader.from = firstDayOfMonthString;
        this.datesHeader.to = currentDateString;
      } else {
        let from = userDate.from.split('-');
        from = new Date(Number(from[0]), Number(from[1]) - 1, Number(from[2]));

        let to = userDate.to.split('-');
        to = new Date(Number(to[0]), Number(to[1]) - 1, Number(to[2]));
        let newDate = date.addToDate(to, { days: 1 });

        this.dateRange.from = date.formatDate(from, 'YYYY-MM-DD');
        this.dateRange.to = date.formatDate(newDate, 'YYYY-MM-DD');

        this.datesHeader.from = date.formatDate(from, 'DD MMM YYYY');
        this.datesHeader.to = date.formatDate(to, 'DD MMM YYYY');
      }
    },
    async addOpeningBalance() {
      await readWriteData().addData({ type: 'balance', data: { balance: this.balance } });
      await readWriteData().addData({
        data: { date: new Date(this.datesHeader.today).toISOString(), type: 'income', category: 'Other', description: 'Opening Balance', amount: this.balance.toString() }
      });
      return await readWriteData().searchData({ data: this.$store.state.dateRange });
    },
    async logout() {
      await readWriteData().logout();
      this.$router.push({ name: 'Login' });
      return;
    }
  }
};
</script>

<style lang="sass">
.q-page
  background: $grey-10

.subheading
  font-size: 15px

.soft-border
  border-radius:6px

.container
  border: 0px solid grey
</style>
