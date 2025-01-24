// store.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import uuid from 'react-native-uuid';

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
  region: 'India',
  carryOverBudget: false,
  monthlyBudget: '',
  remainingBalance: 0,

  // Budget Actions
  addBudget: (month, budget) => {
    if (!validatePositiveNumber(budget, 'Budget')) return;
    set(state => ({
      budgets: { ...state.budgets, [month]: budget },
      remainingBalance: calculateRemainingBalance(get),
    }));
  },
  updateBudget: (month, budget) => {
    if (!validatePositiveNumber(budget, 'Budget')) return;
    set(state => ({
      budgets: { ...state.budgets, [month]: budget },
      remainingBalance: calculateRemainingBalance(get),
    }));
  },
  removeBudget: month => {
    set(state => {
      const { [month]: _, ...newBudgets } = state.budgets;
      return {
        budgets: newBudgets,
        remainingBalance: calculateRemainingBalance(get),
      };
    });
  },
  getBudget: month => get().budgets[month],

  // Expense Actions
  addExpense: async (month, expenseObject) => {
    if (expenseObject.amount <= 0) {
      console.error('Expense amount must be a positive number');
      return;
    }
    expenseObject.id = uuid.v4();
    set(state => {
      const newExpenses = { ...state.expenses };
      if (!newExpenses[month]) {
        newExpenses[month] = [];
      }
      newExpenses[month].push(expenseObject);
      return {
        expenses: newExpenses,
        remainingBalance: calculateRemainingBalance(get),
      };
    });
    const currentState = get();
    try {
      await AsyncStorage.setItem('@budgetAppData', JSON.stringify(currentState));
    } catch (error) {
      console.error('Failed to save expense data to storage', error);
    }
  },
  deleteExpense: async (month, expenseId) => {
    set(state => {
      const newExpenses = { ...state.expenses };
      if (!newExpenses[month]) {
        return state;
      }

      const expenseIndex = newExpenses[month].findIndex(
        expense => expense.id === expenseId,
      );
      if (expenseIndex === -1) {
        return state;
      }

      newExpenses[month].splice(expenseIndex, 1);

      try {
        AsyncStorage.setItem('@budgetAppData', JSON.stringify({
          ...state,
          expenses: newExpenses,
          remainingBalance: calculateRemainingBalance(get),
        }));
      } catch (error) {
        console.error('Failed to save expense data to storage', error);
      }

      return {
        expenses: newExpenses,
        remainingBalance: calculateRemainingBalance(get),
      };
    });
  },
  editExpense: async (month, expenseId, updatedExpense) => {
    set(state => {
      const newExpenses = { ...state.expenses };
      if (!newExpenses[month]) {
        return state;
      }
      const expenseIndex = newExpenses[month].findIndex(
        expense => expense.id === expenseId,
      );
      if (expenseIndex === -1) {
        return state;
      }
      newExpenses[month][expenseIndex] = {
        ...newExpenses[month][expenseIndex],
        ...updatedExpense,
      };
      return {
        expenses: newExpenses,
        remainingBalance: calculateRemainingBalance(get),
      };
    });
    const currentState = get();
    try {
      await AsyncStorage.setItem('@budgetAppData', JSON.stringify(currentState));
    } catch (error) {
      console.error('Failed to save data to storage', error);
    }
  },
  updateExpense: async (month, expenseId, updatedExpense) => {
    set(state => {
      const newExpenses = { ...state.expenses };
      if (!newExpenses[month]) {
        return state;
      }
      const expenseIndex = newExpenses[month].findIndex(
        expense => expense.id === expenseId,
      );
      if (expenseIndex === -1) {
        return state;
      }
      newExpenses[month][expenseIndex] = {
        ...newExpenses[month][expenseIndex],
        ...updatedExpense,
      };
      return {
        expenses: newExpenses,
        remainingBalance: calculateRemainingBalance(get),
      };
    });
    const currentState = get();
    try {
      await AsyncStorage.setItem('@budgetAppData', JSON.stringify(currentState));
    } catch (error) {
      console.error('Failed to save data to storage', error);
    }
  },
  getExpenses: month => get().expenses[month] || [],
  getTotalExpenses: month =>
    (get().expenses[month] || []).reduce(
      (total, expense) => total + expense.amount,
      0,
    ),
  resetBudgets: () => set({ budgets: {}, expenses: {} }),

  // Currency & Region Actions
  setCurrency: currency => set({ currency }),
  setSymbol: symbol => set({ symbol }),
  setRegion: region => set({ region }),
  setCarryOverBudget: carryOverBudget => set({ carryOverBudget }),
  setMonthlyBudget: monthlyBudget => set({ monthlyBudget }),

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
      const state = await AsyncStorage.getItem('@budgetAppData');
      if (state) {
        const jsonData = JSON.stringify(JSON.parse(state), null, 2);
  
        // Define the file path in the user's Downloads directory
        const fileName = `Runor_budget_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
  
        // Write the file to the Downloads directory
        await RNFS.writeFile(filePath, jsonData, 'utf8');
        console.log('Success', `Data exported successfully to ${filePath}`);
      } else {
        console.log('Error', 'No data to export.');
      }
    } catch (err) {
      console.error('Error exporting data:', err);
      console.log('Error', 'Failed to export data.');
    }
  },
}));

const calculateRemainingBalance = get => {
  const budgets = get().budgets;
  const expenses = get().expenses;
  const carryOverBudget = get().carryOverBudget;
  if (!carryOverBudget) {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const currentBudget = budgets[currentMonth] || get().monthlyBudget || 0;

    console.log('Current month:', currentMonth, 'Budgets:', budgets,currentBudget);
    console.log('Current budget:', currentBudget);
    const totalExpenses =
      expenses[currentMonth]?.reduce((sum, expense) => sum + expense.amount, 0) ||
      0;
    console.log('Total expenses:', totalExpenses);
    return currentBudget - totalExpenses;
  } else {
    const months = Object.keys(budgets).sort();
    let remaining = 0;
    for (const month of months) {
      const budget = budgets[month] || 0;
      const monthExpenses =
        expenses[month]?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      remaining += budget - monthExpenses;
    }
    return remaining;
  }
};

export default useStore; // Ensure this line is present