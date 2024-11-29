import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

// Helper function to validate positive numbers
const validatePositiveNumber = (value, type) => {
  if (value <= 0) {
    console.error(`${type} must be a positive number`);
    return false;
  }
  return true;
};

const useStore = create((set, get) => ({
  // State
  budgets: {},
  expenses: {},
  symbol: '₹',
  currency: 'rupees',
  region: '',
  carryOverBudget: false,
  monthlyBudget: '',

  // Budget Actions
  addBudget: (month, budget) => {
    if (!validatePositiveNumber(budget, 'Budget')) return;
    set(state => ({
      budgets: {...state.budgets, [month]: budget},
    }));
  },

  updateBudget: (month, budget) => {
    if (!validatePositiveNumber(budget, 'Budget')) return;
    set(state => ({
      budgets: {...state.budgets, [month]: budget},
    }));
  },

  removeBudget: month => {
    set(state => {
      const {[month]: _, ...newBudgets} = state.budgets; // Omit the month key
      return {budgets: newBudgets};
    });
  },

  getBudget: month => get().budgets[month],

  // Expense Actions
  addExpense: async (month, expenseObject) => {
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

    // Save updated state to AsyncStorage
    const currentState = get();
    try {
      await AsyncStorage.setItem(
        '@budgetAppData',
        JSON.stringify(currentState),
      );
    } catch (error) {
      console.error('Failed to save expense data to storage', error);
    }
  },

  getExpenses: month => get().expenses[month] || [],

  getTotalExpenses: month =>
    (get().expenses[month] || []).reduce(
      (total, expense) => total + expense.amount,
      0,
    ),

  resetBudgets: () => set({budgets: {}, expenses: {}}),

  // Currency & Region Actions
  setCurrency: currency => set({currency}),
  setSymbol: symbol => set({symbol}),
  setRegion: region => set({region}),
  setCarryOverBudget: carryOverBudget => set({carryOverBudget}),
  setMonthlyBudget: monthlyBudget => set({monthlyBudget}),

  // Getters
  getCurrency: () => get().currency,
  getRegion: () => get().region,
  getCarryOverBudget: () => get().carryOverBudget,
  getMonthlyBudget: () => get().monthlyBudget,

  // Persistence Actions
  loadFromStorage: async () => {
    try {
      const storedData = await AsyncStorage.getItem('@budgetAppData');
      if (storedData) {
        set(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load data from storage', error);
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem('@budgetAppData', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save data to storage', error);
    }
  },

  exportData: async () => {
    try {
      const state = get();
      const jsonData = JSON.stringify(state);
      const filePath = `${RNFS.DocumentDirectoryPath}/Runor_budget_backup.json`;
      await RNFS.writeFile(filePath, jsonData, 'utf8');
      console.log(`Data exported successfully to ${filePath}`);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  },
}));

export default useStore;
