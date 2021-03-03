import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {},
  state: { chartOptions: {}, transactions: {}, dateRange: {}, newRecord: {}, balance: null },
  mutations: {
    updateChartOptions(state, chartOptions) {
      state.chartOptions = chartOptions;
    },
    updateTransactions(state, transactions) {
      state.transactions = transactions;
    },
    updateDateRange(state, range) {
      state.dateRange = range;
    },
    updateRecord(state, record) {
      state.newRecord = record;
    },

    updateBalance(state, balance) {
      state.balance = balance;
    }
  },
  actions: {
    updateChartOptions({ commit }, chartOptions) {
      commit('updateChartOptions', chartOptions);
    },
    updateTransactions({ commit }, transactions) {
      commit('updateTransactions', transactions);
    },
    updateDateRange({ commit }, range) {
      commit('updateDateRange', range);
    },
    updateRecord({ commit }, record) {
      commit('updateRecord', record);
    },
    updateBalance({ commit }, balance) {
      commit('updateBalance', balance);
    }
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING
});
