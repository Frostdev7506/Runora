import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

const useStore = create(set => ({
  budgets: {},
  expenses: {},
  symbol: '₹',
  currency: 'rupees',
  region: '',
  carryOverBudget: false,
  monthlyBudget: '',
  addBudget: (month, budget) => {
    if (budget <= 0) {
      console.error('Budget must be a positive number');
      return;
    }
    set(state => ({
      budgets: {...state.budgets, [month]: budget},
    }));
  },
  updateBudget: (month, budget) => {
    if (budget <= 0) {
      console.error('Budget must be a positive number');
      return;
    }
    set(state => ({
      budgets: {...state.budgets, [month]: budget},
    }));
  },
  removeBudget: month => {
    set(state => {
      const newBudgets = {...state.budgets};
      delete newBudgets[month];
      return {budgets: newBudgets};
    });
  },
  getBudget: month => {
    return useStore.getState().budgets[month];
  },
  addExpense: (month, expenseObject) => {
    if (expenseObject.amount <= 0) {
      console.error('Expense amount must be a positive number');
      return;
    }
    set(state => {
      const newExpenses = {...state.expenses};
      if (!newExpenses[month]) {
        newExpenses[month] = [];
      }
      newExpenses[month].push(expenseObject);
      return {expenses: newExpenses};
    });
  },
  getExpenses: month => {
    return useStore.getState().expenses[month] || [];
  },
  getSymbol: () => {
    return useStore.getState().symbol;
  },
  getTotalExpenses: month => {
    const expenses = useStore.getState().expenses[month] || [];
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  },
  resetBudgets: () => {
    set({budgets: {}, expenses: {}});
  },
  setCurrency: currency => {
    set({currency});
  },
  setSymbol: symbol => {
    set({symbol});
  },
  setRegion: region => {
    set({region});
  },
  setCarryOverBudget: carryOverBudget => {
    set({carryOverBudget});
  },
  setMonthlyBudget: monthlyBudget => {
    set({monthlyBudget});
  },
  getCurrency: () => {
    return useStore.getState().currency;
  },
  getRegion: () => {
    return useStore.getState().region;
  },
  getCarryOverBudget: () => {
    return useStore.getState().carryOverBudget;
  },
  getMonthlyBudget: () => {
    return useStore.getState().monthlyBudget;
  },
  loadFromStorage: async () => {
    try {
      const storedData = await AsyncStorage.getItem('@budgetAppData');
      if (storedData) {
        const data = JSON.parse(storedData);
        set(data);
      }
    } catch (error) {
      console.error('Failed to load data from storage', error);
    }
  },
  saveToStorage: async () => {
    try {
      const data = useStore.getState();
      await AsyncStorage.setItem('@budgetAppData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data to storage', error);
    }
  },
  exportData: async () => {
    try {
      const state = useStore.getState();
      const jsonData = JSON.stringify(state);
      const filePath = `${RNFS.DocumentDirectoryPath}/budget_backup.json`;
      await RNFS.writeFile(filePath, jsonData, 'utf8');
      console.log(`Data exported successfully to ${filePath}`);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  },
}));

export default useStore;
