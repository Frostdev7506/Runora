// store/store.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import uuid from 'react-native-uuid';
import { AppState } from 'react-native';
import defaultTagsConfig from './defaultTags'; // Import the config
import isValidPositiveNumber from '../utils/isValidPositiveNumber';

const STORAGE_KEY = '@budgetAppData';



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
  loading: true,
  lastBudgetUpdate: null,

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
    await get()._persistData(); //  call _persistData
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
    await get()._persistData(); //  call _persistData
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
    await get()._persistData(); //  call _persistData
  },

  getTag: (tagId) => get().tags.find(tag => tag.id === tagId),

  getTags: () => get().tags,

  addExpense: async ({ month, expense }) => {
    try {
      if (!month || !expense || !expense.date) {
        console.error('Invalid expense data format');
        return false;
      }

      const amount = parseFloat(expense.amount);
      if (!isValidPositiveNumber(amount)) {
        console.error('Expense amount must be a positive number');
        return false;
      }

      const newExpense = {
        ...expense,
        amount, // Use the parsed float amount
        id: uuid.v4(),
        tags: expense.tags || [],
        createdAt: new Date().toISOString()
      };

      set(state => {
        const newExpenses = { ...state.expenses };
        if (!newExpenses[month]) {
          newExpenses[month] = [];
        }
        newExpenses[month].push(newExpense);
        return {
          expenses: newExpenses
        };
      });

      // Calculate new remaining balance
      const newBalance = get().calculateRemainingBalance();
      set({ remainingBalance: newBalance });

      // Persist the data
      await get()._persistData();
      return true;
    } catch (error) {
      console.error('Failed to add expense:', error);
      return false;
    }
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
    await get()._persistData(); //  call _persistData
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
    get()._persistData(); //  call _persistData
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
    get()._persistData(); //  call _persistData
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
    get()._persistData(); //  call _persistData
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

      await get()._persistData(); //  call _persistData
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
    // --- Keep these for manual backup/restore ---
    loadFromStorage: async () => {
      set({ loading: true });
      try {
        const filePath = `${RNFS.DocumentDirectoryPath}/${STORAGE_KEY}.json`;
        const fileExists = await RNFS.exists(filePath);

        if (fileExists) {
          const storedData = await RNFS.readFile(filePath, 'utf8');
          if (storedData) {
            const parsedData = JSON.parse(storedData);

            // Ensure monthlyBudget is a number
            if (typeof parsedData.monthlyBudget === 'string') {
              parsedData.monthlyBudget = Number(parsedData.monthlyBudget);
            }

            // Initialize empty objects if they don't exist
            parsedData.budgets = parsedData.budgets || {};
            parsedData.expenses = parsedData.expenses || {};
            parsedData.tags = Array.isArray(parsedData.tags) ? parsedData.tags : [];

            // Update the store state
            set(state => ({
              ...state,
              ...parsedData,
              loading: false
            }));

            // Recalculate remaining balance
            await get().calculateRemainingBalance();
            await get().checkAndUpdateBudget();
            return true;
          }
        }
        set({ loading: false });
        return false;
      } catch (error) {
        console.error('Failed to load from storage:', error);
        set({ loading: false });
        return false;
      }
    },

    saveToStorage: async () => {
      try {
        const state = get();
        const { loading, ...stateToSave } = state;
        const filePath = `${RNFS.DocumentDirectoryPath}/${STORAGE_KEY}.json`;
        await RNFS.writeFile(filePath, JSON.stringify(stateToSave), 'utf8');
      } catch (error) {
        console.error('Failed to save data to storage', error);
      }
    },
    // --- Automatic Persistence functions ---
      _persistData: async () => {
    try {
      const state = get();
      const { loading, ...stateToSave } = state;
      const filePath = `${RNFS.DocumentDirectoryPath}/${STORAGE_KEY}.json`;
      await RNFS.writeFile(filePath, JSON.stringify(stateToSave), 'utf8');
    } catch (error) {
      console.error('Failed to persist data', error);
    }
  },

  _loadInitialData: async () => {
    set({ loading: true });
    try {
      // Attempt to read from a file
      const filePath = `${RNFS.DocumentDirectoryPath}/${STORAGE_KEY}.json`;
      const fileExists = await RNFS.exists(filePath);

      if (fileExists) {
        const storedData = await RNFS.readFile(filePath, 'utf8');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          // Load stored data if it exists
          if (parsedData) {
            const loadedTags = Array.isArray(parsedData.tags) ? parsedData.tags : [];
            const loadedMonthlyBudget = parsedData.monthlyBudget !== undefined ? Number(parsedData.monthlyBudget) : 0;
            
            // If we have stored tags, use them
            if (loadedTags.length > 0) {
              set({ 
                ...parsedData, 
                tags: loadedTags,
                monthlyBudget: loadedMonthlyBudget 
              });
            } else {
              // Only use default tags if no stored tags exist
              const initialTags = Object.entries(defaultTagsConfig).map(([key, config]) => ({
                id: uuid.v4(),
                name: key,
                label: config.label,
                color: config.color,
                icon: config.icon,
                isCustom: false,
                createdAt: new Date().toISOString()
              }));
              set({ 
                ...parsedData, 
                tags: initialTags,
                monthlyBudget: loadedMonthlyBudget 
              });
            }
            await get().checkAndUpdateBudget();
            return;
          }
        }
      }

      // If no file, try AsyncStorage (for migration)
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const loadedTags = Array.isArray(parsedData.tags) ? parsedData.tags : [];
        const loadedMonthlyBudget = parsedData.monthlyBudget !== undefined ? Number(parsedData.monthlyBudget) : 0;
        
        // If we have stored tags in AsyncStorage, use them
        if (loadedTags.length > 0) {
          set({ 
            ...parsedData, 
            tags: loadedTags,
            monthlyBudget: loadedMonthlyBudget 
          });
        } else {
          // Only use default tags if no stored tags exist
          const initialTags = Object.entries(defaultTagsConfig).map(([key, config]) => ({
            id: uuid.v4(),
            name: key,
            label: config.label,
            color: config.color,
            icon: config.icon,
            isCustom: false,
            createdAt: new Date().toISOString()
          }));
          set({ 
            ...parsedData, 
            tags: initialTags,
            monthlyBudget: loadedMonthlyBudget 
          });
        }
        
        await get().checkAndUpdateBudget();
        await get()._persistData(); // Save to file after migrating
        await AsyncStorage.removeItem(STORAGE_KEY); // Remove from AsyncStorage
      } else {
        // No stored data at all, initialize with default tags
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
        await get()._persistData();
      }
    } catch (error) {
      console.error('Failed to load initial data', error);
      // On error, only set default tags if we don't have any tags
      const state = get();
      if (!state.tags || state.tags.length === 0) {
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
        await get()._persistData();
      }
    } finally {
      set({ loading: false });
    }
  },

  exportData: async () => {
    try {
      const state = get();
      const { loading, ...stateToSave } = state; // Don't export the loading state
      const jsonData = JSON.stringify(stateToSave, null, 2);
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
      // Basic tags schema validation
      if (importedData.tags && !Array.isArray(importedData.tags)) {
            throw new Error("Invalid 'tags' data.  Expected an array.");
      }
      if (importedData.tags) {
          for (const tag of importedData.tags) {
              if (!tag.id || typeof tag.id !== 'string') {
                throw new Error("Invalid tag: 'id' must be a string.");
              }
              if (!tag.name || typeof tag.name !== 'string') {
                throw new Error("Invalid tag: 'name' must be a string.");
              }
          }
      }
      // Merge the imported data, giving priority to the imported values
      set(state => ({
        ...state,
        ...importedData,
      }));
      console.log("Successfully imported", result.name);
      await get()._persistData();

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
let lastSaveTimestamp = Date.now();
const SAVE_THROTTLE_MS = 1000; // Throttle saves to once per second

const initializeAppStateListener = () => {
  if (appStateSubscription) {
    appStateSubscription.remove(); // Remove any existing listener
  }

  appStateSubscription = AppState.addEventListener('change', nextAppState => {
    const store = useStore.getState();
    
    if (nextAppState === 'active') {
      // When app becomes active, load latest data and check budget
      store._loadInitialData();
      store.checkAndUpdateBudget();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // Save state when app goes to background or becomes inactive
      const currentTime = Date.now();
      if (currentTime - lastSaveTimestamp >= SAVE_THROTTLE_MS) {
        store._persistData();
        lastSaveTimestamp = currentTime;
      }
    }
  });
};

// Subscribe to store changes for automatic saving
useStore.subscribe((state, prevState) => {
  // Only save if actual data changed (ignore loading state changes)
  const { loading: currentLoading, ...currentState } = state;
  const { loading: prevLoading, ...prevStateData } = prevState;
  
  if (JSON.stringify(currentState) !== JSON.stringify(prevStateData)) {
    const currentTime = Date.now();
    if (currentTime - lastSaveTimestamp >= SAVE_THROTTLE_MS) {
      useStore.getState()._persistData();
      lastSaveTimestamp = currentTime;
    }
  }
});

export const initializeBudgetUpdater = () => {
  initializeAppStateListener();
  useStore.getState()._loadInitialData();
};

export default useStore;