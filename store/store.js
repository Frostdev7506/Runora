import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import uuid from 'react-native-uuid';
import { AppState } from 'react-native'; // Import AppState

const STORAGE_KEY = '@budgetAppData';

const isValidPositiveNumber = (value) => {
  return typeof value === 'number' && value >= 0;
};

const defaultTagsConfig = {
  food: { icon: '🍔', color: '#FF6B6B', label: 'Food & Dining' },
  transport: { icon: '🚗', color: '#4ECDC4', label: 'Transportation' },
  shopping: { icon: '🛍️', color: '#45B7D1', label: 'Shopping' },
  groceries: { icon: '🛒', color: '#A7D1AB', label: 'Groceries' },
  entertainment: { icon: '🎮', color: '#96CEB4', label: 'Entertainment' },
  health: { icon: '💊', color: '#FF8CC6', label: 'Healthcare' },
  utilities: { icon: '💡', color: '#FFD93D', label: 'Utilities' },
  other: { icon: '📝', color: '#6C5CE7', label: 'Other' }
};

const useStore = create((set, get) => ({
  budgets: {},
  expenses: {},
  tags: [],
  symbol: '₹',
  currency: 'rupees',
  region: 'India',
  carryOverBudget: false,
  monthlyBudget: 0,
  remainingBalance: 0,
  loading: false,
  lastBudgetUpdate: null, // Add a timestamp for the last budget update

  addTag: async (tagName, color = '#666666', icon = '📝') => {
    if (!tagName || typeof tagName !== 'string') {
      console.error('Tag name must be a non-empty string');
      return null;
    }

    const newTag = {
      id: uuid.v4(),
      name: tagName.trim(),
      color,
      icon,
      label: tagName.trim(),
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    set(state => ({
      tags: [...state.tags, newTag]
    }));
    await get().saveToStorage();
    return newTag;
  },

  updateTag: async (tagId, updates) => {
    set(state => ({
      tags: state.tags.map(tag =>
        tag.id === tagId
          ? { ...tag, ...updates, updatedAt: new Date().toISOString() }
          : tag
      )
    }));
    await get().saveToStorage();
  },

  deleteTag: async (tagId) => {
    set(state => {
      const newExpenses = { ...state.expenses };
      Object.keys(newExpenses).forEach(month => {
        newExpenses[month] = newExpenses[month].map(expense => ({
          ...expense,
          tags: (expense.tags || []).filter(id => id !== tagId)
        }));
      });

      return {
        expenses: newExpenses,
        tags: state.tags.filter(tag => tag.id !== tagId)
      };
    });
    await get().saveToStorage();
  },

  getTag: (tagId) => get().tags.find(tag => tag.id === tagId),

  getTags: () => get().tags,

  addExpense: async (month, expenseObject) => {
    if (!isValidPositiveNumber(expenseObject.amount)) {
      console.error('Expense amount must be a positive number');
      return;
    }

    const newExpense = {
      ...expenseObject,
      id: uuid.v4(),
      tags: expenseObject.tags || [],
      createdAt: new Date().toISOString()
    };

    set(state => {
      const newExpenses = { ...state.expenses };
      if (!newExpenses[month]) {
        newExpenses[month] = [];
      }
      newExpenses[month].push(newExpense);
      return {
        expenses: newExpenses,
        remainingBalance: get().calculateRemainingBalance(),
      };
    });
    await get().saveToStorage();
  },

  updateExpense: async (month, expenseId, updatedExpense) => {
    if (!isValidPositiveNumber(updatedExpense.amount)) {
      console.error('Updated expense amount must be a positive number.');
      return;
    }

    set(state => {
      const newExpenses = { ...state.expenses };
      if (!newExpenses[month]) return state;

      const expenseIndex = newExpenses[month].findIndex(
        expense => expense.id === expenseId
      );
      if (expenseIndex === -1) return state;


      const updatedTags = updatedExpense.tags ||
        newExpenses[month][expenseIndex].tags ||
        [];

      newExpenses[month][expenseIndex] = {
        ...newExpenses[month][expenseIndex],
        ...updatedExpense,
        tags: updatedTags,
        updatedAt: new Date().toISOString()
      };

      return {
        expenses: newExpenses,
        remainingBalance: get().calculateRemainingBalance(),
      };
    });
    await get().saveToStorage();
  },

  getExpensesByTag: (tagId) => {
    const { expenses } = get();
    const allExpenses = [];

    Object.keys(expenses).forEach(month => {
      expenses[month].forEach(expense => {
        if (expense.tags && expense.tags.includes(tagId)) {
          allExpenses.push({ ...expense, month });
        }
      });
    });

    return allExpenses;
  },

  getTotalByTag: (tagId) => {
    const tagExpenses = get().getExpensesByTag(tagId);
    return tagExpenses.reduce((total, expense) => total + expense.amount, 0);
  },

  addBudget: (month, budget) => {
      
      set(state => ({
          budgets: { ...state.budgets, [month]: budget },
          remainingBalance: get().calculateRemainingBalance(),
          lastBudgetUpdate: new Date().toISOString(), // Update the timestamp
      }));
      get().saveToStorage(); // Save after updating
  },

  updateBudget: (month, budget) => {
    if (!isValidPositiveNumber(budget)) {
      console.error('Budget must be a positive number');
      return;
    }
    set(state => ({
      budgets: { ...state.budgets, [month]: budget },
      remainingBalance: get().calculateRemainingBalance(),
      lastBudgetUpdate: new Date().toISOString()
    }));
      get().saveToStorage();
  },

  removeBudget: (month) => {
    set(state => {
      const { [month]: _, ...newBudgets } = state.budgets;
      return {
        budgets: newBudgets,
        remainingBalance: get().calculateRemainingBalance(),
        lastBudgetUpdate: new Date().toISOString()
      };
    });
    get().saveToStorage();
  },

  getBudget: (month) => get().budgets[month] || 0,

  deleteExpense: async (month, expenseId) => {
    try {
      set((state) => {
        const monthExpenses = state.expenses[month] || [];
        const updatedExpenses = {
          ...state.expenses,
          [month]: monthExpenses.filter((expense) => expense.id !== expenseId),
        };

        return {
          expenses: updatedExpenses,
          remainingBalance: state.calculateRemainingBalance(),
        };
      });

      await get().saveToStorage();
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  getExpenses: (month) => get().expenses[month] || [],

  getTotalExpenses: (month) =>
    (get().expenses[month] || []).reduce(
      (total, expense) => total + expense.amount,
      0,
    ),

  resetBudgets: () => set({ budgets: {}, expenses: {} }),

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

    checkAndUpdateBudget: async () => {
      const now = new Date();
      const currentMonth = now.toISOString().substring(0, 7);
      const { lastBudgetUpdate, monthlyBudget, budgets } = get();

      // Determine if an update is needed
      let needsUpdate = false;
      if (!lastBudgetUpdate) {
          needsUpdate = true; // First run, always update
      } else {
          const lastUpdateMonth = new Date(lastBudgetUpdate).toISOString().substring(0, 7);
          needsUpdate = currentMonth !== lastUpdateMonth; // Update if the month has changed
      }

        if (needsUpdate) {
            const existingBudget = budgets[currentMonth] || 0;
            const newBudget = existingBudget + monthlyBudget; // Add to existing, if any
            get().addBudget(currentMonth, newBudget); // Use addBudget to handle updates and saving
        }
    },

    loadFromStorage: async () => {
        set({ loading: true });
        try {
            const storedData = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                const loadedTags = Array.isArray(parsedData.tags) ? parsedData.tags : [];
                const loadedMonthlyBudget = parsedData.monthlyBudget !== undefined ? Number(parsedData.monthlyBudget) : 0;
                set({ ...parsedData, tags: loadedTags, monthlyBudget: loadedMonthlyBudget });

                // Check and update budget after loading
              await get().checkAndUpdateBudget();
            } else {
                const initialTags = Object.entries(defaultTagsConfig).map(([key, config]) => ({
                    id: uuid.v4(),
                    name: key,
                    label: config.label,
                    color: config.color,
                    icon: config.icon,
                    isCustom: false,
                    createdAt: new Date().toISOString()
                }));
                set({ tags: initialTags });
                await get().saveToStorage(); // Initial save if no data
            }

        } catch (error) {
            console.error('Failed to load data from storage', error);
        } finally {
            set({ loading: false });
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
        return;
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

  importData: async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.json],
      });

      const fileContent = await RNFS.readFile(result.uri, 'utf8');
      const importedData = JSON.parse(fileContent);

      if (importedData.budgets && typeof importedData.budgets !== 'object') {
          throw new Error("Invalid 'budgets' data in the imported file.");
      }
      if (importedData.expenses && typeof importedData.expenses !== 'object') {
          throw new Error("Invalid 'expenses' data in the imported file.");
      }
      // Merge the imported data, giving priority to the imported values
      set(state => ({
        ...state,
        ...importedData,
      }));
      console.log("Successfully imported", result.name);
      get().saveToStorage();

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('Error importing data:', err);
      }
    }
  },

  calculateRemainingBalance: () => {
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
  },
}));

// --- AppState Listener (Outside the store) ---

let appStateSubscription;

const initializeAppStateListener = () => {
  if (appStateSubscription) {
    appStateSubscription.remove(); // Remove any existing listener
  }

  appStateSubscription = AppState.addEventListener('change', nextAppState => {
    if (nextAppState === 'active') {
      useStore.getState().checkAndUpdateBudget();
    }
  });
};


export const initializeBudgetUpdater = () => {
    initializeAppStateListener();
    useStore.getState().loadFromStorage().then(() => {  // load and *then* check
      useStore.getState().checkAndUpdateBudget();
    });
};

export default useStore;