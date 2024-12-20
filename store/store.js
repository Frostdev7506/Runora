import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';

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
  region: 'India',
  carryOverBudget: false,
  monthlyBudget: '',
  remainingBalance: 0,

  // Budget Actions
  addBudget: (month, budget) => {
    if (!validatePositiveNumber(budget, 'Budget')) return;
    set(state => ({
      budgets: {...state.budgets, [month]: budget},
      remainingBalance: calculateRemainingBalance(get),
    }));
  },

  updateBudget: (month, budget) => {
    if (!validatePositiveNumber(budget, 'Budget')) return;
    set(state => ({
      budgets: {...state.budgets, [month]: budget},
      remainingBalance: calculateRemainingBalance(get),
    }));
  },

  removeBudget: month => {
    set(state => {
      const {[month]: _, ...newBudgets} = state.budgets;
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

    // Add a unique ID to the expense object
    expenseObject.id = uuid.v4();

    set(state => {
      const newExpenses = {...state.expenses};
      if (!newExpenses[month]) {
        newExpenses[month] = [];
      }
      newExpenses[month].push(expenseObject);
      return {
        expenses: newExpenses,
        remainingBalance: calculateRemainingBalance(get),
      };
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

  deleteExpense: async (month, expenseId) => {
    set(state => {
      const newExpenses = {...state.expenses};
      if (!newExpenses[month]) {
        return state;
      }
  
      const expenseIndex = newExpenses[month].findIndex(
        expense => expense.id === expenseId,
      );
      if (expenseIndex === -1) {
        return state; // Or handle the error appropriately
      }
  
      newExpenses[month].splice(expenseIndex, 1);
  
      // Save updated state to AsyncStorage
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

  editExpense : async (month, expenseId, updatedExpense) => {
    set(state => {
      const newExpenses = {...state.expenses};
      if (!newExpenses[month]) {
        return state; // Or handle the error appropriately
      }

      const expenseIndex = newExpenses[month].findIndex(
        expense => expense.id === expenseId,
      );
      if (expenseIndex === -1) {
        return state; // Or handle the error appropriately
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

    // Save updated state to AsyncStorage    
    const currentState = get();
    try {
      await AsyncStorage.setItem('@budgetAppData', JSON.stringify(currentState));
    } catch (error) {
      console.error('Failed to save expense data to storage', error);
    }
  },
  updateExpense: async (month, expenseId, updatedExpense) => {
    set(state => {
      const newExpenses = {...state.expenses};
      if (!newExpenses[month]) {
        return state; // Or handle the error appropriately
      }

      const expenseIndex = newExpenses[month].findIndex(
        expense => expense.id === expenseId,
      );
      if (expenseIndex === -1) {
        return state; // Or handle the error appropriately
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

    // Save updated state to AsyncStorage
    const currentState = get();
    try {
      await AsyncStorage.setItem('@budgetAppData', JSON.stringify(currentState));
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

// Helper function to calculate remaining balance
const calculateRemainingBalance = get => {
  const budgets = get().budgets;
  const expenses = get().expenses;
  const carryOverBudget = get().carryOverBudget;

  if (!carryOverBudget) {
    // Calculate remaining balance for the current month only
    const currentMonth = new Date().toISOString().substring(0, 7);
    const currentBudget = budgets[currentMonth] || 0;
    const totalExpenses =
      expenses[currentMonth]?.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      ) || 0;
    return currentBudget - totalExpenses;
  } else {
    // Calculate cumulative budget and expenses
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

export default useStore;