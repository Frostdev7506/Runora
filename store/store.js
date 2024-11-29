import {create} from 'zustand';

const useStore = create(set => ({
  budgets: {},
  expenses: {},
  currency: 'rupees',
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
  addExpense: (month, expense) => {
    if (expense <= 0) {
      console.error('Expense must be a positive number');
      return;
    }
    set(state => {
      const newExpenses = {...state.expenses};
      if (!newExpenses[month]) {
        newExpenses[month] = [];
      }
      newExpenses[month].push(expense);
      return {expenses: newExpenses};
    });
  },
  getExpenses: month => {
    return useStore.getState().expenses[month] || [];
  },
  getTotalExpenses: month => {
    const expenses = useStore.getState().expenses[month] || [];
    return expenses.reduce((total, expense) => total + expense, 0);
  },
  resetBudgets: () => {
    set({budgets: {}, expenses: {}});
  },
}));

export default useStore;
