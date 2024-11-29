import {create} from 'zustand';

const useStore = create(set => ({
  budgets: {},
  addBudget: (month, budget) =>
    set(state => ({
      budgets: {...state.budgets, [month]: budget},
    })),
  updateBudget: (month, budget) =>
    set(state => ({
      budgets: {...state.budgets, [month]: budget},
    })),
}));

export default useStore;
