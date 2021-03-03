import axios from 'axios';
import $store from '../store/index';

const server = process.env.API;

const readWriteData = () => {
  async function login(accessCode) {
    try {
      const response = await axios.post(`${server}auth/login`, { accessCode });
      return response.data;
    } catch (err) {
      return { Error: err.response.data.Error };
    }
  }

  async function addData(payload) {
    try {
      await axios.post(`${server}add`, payload);
      return;
    } catch (err) {
      return { Error: err.response.data.Error };
    }
  }

  async function editData(payload) {
    try {
      await axios.post(`${server}edit`, payload);
      return;
    } catch (err) {
      return { Error: err.response.data.Error };
    }
  }

  async function searchData(payload) {
    try {
      const response = await axios.post(`${server}search`, payload);
      return updateData(response.data.data, response.data.balance);
    } catch (err) {
      return { Error: err.response.data.Error };
    }
  }

  async function logout() {
    try {
      await axios.post(`${server}auth/logout`, {});
      return;
    } catch (err) {
      return { Error: err.response.data.Error };
    }
  }

  function updateData(data, balance) {
    let income = { Salary: 0, Bonus: 0, Rewards: 0, Other: 0 };
    let expenses = { Grocery: 0, Rent: 0, Utilities: 0, Insurance: 0, Travel: 0, Vehicle: 0, Miscellaneous: 0, Family: 0 };
    let transactions = { expensesTransactions: [], incomeTransactions: [], allTransactions: [], financialStatus: { Income: 0, Expenses: 0 } };

    for (let i = 0; i < data.length; i++) {
      data[i].amount = Number(parseFloat(data[i].amount).toFixed(2));

      //Expenses
      if (data[i].category == 'Grocery') {
        data[i].icon = 'local_grocery_store';
        data[i].color = 'orange-10';
        expenses['Grocery'] = Number(parseFloat(expenses['Grocery'] + data[i].amount).toFixed(2));
      }
      if (data[i].category == 'Rent') {
        data[i].icon = 'home';
        data[i].color = 'red';
        expenses['Rent'] = Number(parseFloat(expenses['Rent'] + data[i].amount).toFixed(2));
      }
      if (data[i].category == 'Utilities') {
        data[i].icon = 'lightbulb';
        data[i].color = 'red-9';
        expenses['Utilities'] = Number(parseFloat(expenses['Utilities'] + data[i].amount).toFixed(2));
      }
      if (data[i].category == 'Insurance') {
        data[i].icon = 'security';
        data[i].color = 'pink-14';
        expenses['Insurance'] = Number(parseFloat(expenses['Insurance'] + data[i].amount).toFixed(2));
      }
      if (data[i].category == 'Travel') {
        data[i].icon = 'flight_takeoff';
        data[i].color = 'red-14';
        expenses['Travel'] = Number(parseFloat(expenses['Travel'] + data[i].amount).toFixed(2));
      }
      if (data[i].category == 'Vehicle') {
        data[i].icon = 'commute';
        data[i].color = 'red-5';
        expenses['Vehicle'] = Number(parseFloat(expenses['Vehicle'] + data[i].amount).toFixed(2));
      }
      if (data[i].category == 'Family') {
        data[i].icon = 'people';
        data[i].color = 'pink-13';
        expenses['Family'] = Number(parseFloat(expenses['Family'] + data[i].amount).toFixed(2));
      }
      if (data[i].category == 'Miscellaneous') {
        data[i].icon = 'extension';
        data[i].color = 'pink';
        expenses['Miscellaneous'] = Number(parseFloat(expenses['Miscellaneous'] + data[i].amount).toFixed(2));
      }

      //Income
      if (data[i].category == 'Salary') {
        data[i].icon = 'paid';
        data[i].color = 'positive';
        income['Salary'] = Number(parseFloat(income['Salary'] + data[i].amount).toFixed(2));
      }
      if (data[i].category == 'Bonus') {
        data[i].icon = 'payments';
        data[i].color = 'secondary';
        income['Bonus'] = Number(parseFloat(income['Bonus'] + data[i].amount).toFixed(2));
      }
      if (data[i].category == 'Rewards') {
        data[i].icon = 'savings';
        data[i].color = 'teal';
        income['Rewards'] = Number(parseFloat(income['Rewards'] + data[i].amount).toFixed(2));
      }
      if (data[i].category == 'Other') {
        data[i].icon = 'pending';
        data[i].color = 'light-green';
        income['Other'] = Number(parseFloat(income['Other'] + data[i].amount).toFixed(2));
      }

      //Total
      if (data[i].type == 'income') {
        transactions.financialStatus.Income += data[i].amount;
        transactions.incomeTransactions.push(data[i]);
      }
      if (data[i].type == 'expenses') {
        transactions.financialStatus.Expenses += data[i].amount;
        transactions.expensesTransactions.push(data[i]);
      }

      //Update Date format
      data[i].date = data[i].date.split('T')[0];
    }

    transactions.allTransactions = data;
    transactions.income = income;
    transactions.expenses = expenses;
    transactions.financialStatus.Income = Number(parseFloat(transactions.financialStatus.Income).toFixed(2));
    transactions.financialStatus.Expenses = Number(parseFloat(transactions.financialStatus.Expenses).toFixed(2));

    //Update VueX Store
    if (balance) $store.dispatch('updateBalance', { id: balance._id, amount: Number(parseFloat(balance.balance).toFixed(2)) });
    $store.dispatch('updateChartOptions', transactions.financialStatus);
    $store.dispatch('updateTransactions', transactions);
    return;
  }

  return { login, addData, editData, searchData, logout };
};

export default readWriteData;
