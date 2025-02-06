// store.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker'; // Not directly used, but good to keep if you have import/export features
import uuid from 'react-native-uuid';

const STORAGE_KEY = '@budgetAppData'; // Consistent storage key

// Helper function for input validation
const isValidPositiveNumber = (value) => {
  return typeof value === 'number' && value > 0;
};

const useStore = create((set, get) => ({
  // --- Initial State ---
  budgets: {},
  expenses: {},
  symbol: '₹',
  currency: 'rupees',
  region: 'India',
  carryOverBudget: false,
  monthlyBudget: 0, // Use 0 instead of '' for numerical consistency
  remainingBalance: 0,
  loading: false, // Add loading state

  // --- Budget Actions ---
  addBudget: (month, budget) => {
    if (!isValidPositiveNumber(budget)) {
      console.error('Budget must be a positive number');
      return;
    }
    set(state => ({
      budgets: { ...state.budgets, [month]: budget },
      remainingBalance: calculateRemainingBalance(get()),
    }));
  },

  updateBudget: (month, budget) => {
    if (!isValidPositiveNumber(budget)) {
      console.error('Budget must be a positive number');
      return;
    }
    set(state => ({
      budgets: { ...state.budgets, [month]: budget },
      remainingBalance: calculateRemainingBalance(get()),
    }));
  },

  removeBudget: (month) => {
    set(state => {
      const { [month]: _, ...newBudgets } = state.budgets;
      return {
        budgets: newBudgets,
        remainingBalance: calculateRemainingBalance(get()),
      };
    });
  },

  getBudget: (month) => get().budgets[month] || 0, // Return 0 if budget is not set


  // --- Expense Actions ---
  addExpense: async (month, expenseObject) => {
    if (!isValidPositiveNumber(expenseObject.amount)) {
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
        remainingBalance: calculateRemainingBalance(get()),
      };
    });
    await get().saveToStorage(); // Use the saveToStorage action
  },

  deleteExpense: async (month, expenseId) => {
    set(state => {
      const newExpenses = { ...state.expenses };
      if (!newExpenses[month]) {
        return state; // No expenses for this month
      }

      const filteredExpenses = newExpenses[month].filter(
        expense => expense.id !== expenseId,
      );

      newExpenses[month] = filteredExpenses; // Update the expenses for the month

      return {
        expenses: newExpenses,
        remainingBalance: calculateRemainingBalance(get()),
      };
    });
    await get().saveToStorage(); // Use the saveToStorage action

  },

  // Combined edit/update logic (since they're identical)
  updateExpense: async (month, expenseId, updatedExpense) => {
    if (!isValidPositiveNumber(updatedExpense.amount)) {
      console.error('Updated expense amount must be a positive number.');
      return;
    }

    set(state => {
      const newExpenses = { ...state.expenses };
      if (!newExpenses[month]) {
        return state; // No expenses for this month
      }

      const expenseIndex = newExpenses[month].findIndex(
        expense => expense.id === expenseId,
      );
      if (expenseIndex === -1) {
        return state; // Expense not found
      }

      // Update the specific expense
      newExpenses[month][expenseIndex] = {
        ...newExpenses[month][expenseIndex],
        ...updatedExpense,
      };

      return {
        expenses: newExpenses,
        remainingBalance: calculateRemainingBalance(get()),
      };
    });
    await get().saveToStorage();  // Use the saveToStorage action
  },

  getExpenses: (month) => get().expenses[month] || [],

  getTotalExpenses: (month) =>
    (get().expenses[month] || []).reduce(
      (total, expense) => total + expense.amount,
      0,
    ),

  resetBudgets: () => set({ budgets: {}, expenses: {} }),

  // --- Currency & Region Actions ---
  setCurrency: (currency) => set({ currency }),
  setSymbol: (symbol) => set({ symbol }),
  setRegion: (region) => set({ region }),
  setCarryOverBudget: (carryOverBudget) => set({ carryOverBudget }),
  setMonthlyBudget: (monthlyBudget) => {
    if (!isValidPositiveNumber(monthlyBudget)) {
      console.error('Monthly budget must be a positive number');
      return;
    }
    set({ monthlyBudget })
  },

  // --- Persistence Actions ---
  loadFromStorage: async () => {
    set({ loading: true }); // Set loading to true
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Ensure monthlyBudget is treated as a number
        const loadedMonthlyBudget = parsedData.monthlyBudget !== undefined
          ? Number(parsedData.monthlyBudget)
          : 0;

        set({ ...parsedData, monthlyBudget: loadedMonthlyBudget }); // Set loaded data
      }
    } catch (error) {
      console.error('Failed to load data from storage', error);
    } finally {
      set({ loading: false }); // Set loading to false, always
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
       // Exclude 'loading' from being saved
      const { loading, ...stateToSave } = state;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save data to storage', error);
    }
  },

  exportData: async () => {
    try {
      const state = await AsyncStorage.getItem(STORAGE_KEY);
      if (!state) {
        console.log('No data to export.');
        return; // Early return
      }

      const jsonData = JSON.stringify(JSON.parse(state), null, 2);
      const fileName = `Runor_budget_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      await RNFS.writeFile(filePath, jsonData, 'utf8');
      console.log('Success', `Data exported successfully to ${filePath}`);
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  },
    //  import file
    importData: async () => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.json],
            });

            const fileContent = await RNFS.readFile(result.uri, 'utf8');
            const importedData = JSON.parse(fileContent);

            // Validate crucial data before merging
            if (importedData.budgets && typeof importedData.budgets !== 'object') {
                throw new Error("Invalid 'budgets' data in the imported file.");
            }
            if (importedData.expenses && typeof importedData.expenses !== 'object') {
                throw new Error("Invalid 'expenses' data in the imported file.");
            }
            // Add more validation for other critical state properties as needed

            // Merge the imported data, giving priority to the imported values
            set(state => ({
                ...state,
                ...importedData,
            }));
            console.log("Successfully imported", result.name);
            get().saveToStorage(); //save data

        } catch (err) {
             if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled file picker');
              } else {
            console.error('Error importing data:', err);
            }
        }
    },
}));

const calculateRemainingBalance = (get) => {  // Pass get to the function
    const { budgets, expenses, carryOverBudget, monthlyBudget } = get();
    if (!carryOverBudget) {
        const currentMonth = new Date().toISOString().substring(0, 7);
        const currentBudget = budgets[currentMonth] || monthlyBudget || 0;
        const totalExpenses =
            expenses[currentMonth]?.reduce((sum, expense) => sum + expense.amount, 0) ||
            0;
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

export default useStore;