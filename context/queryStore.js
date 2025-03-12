const { create } = require("zustand");

export const useQueryStore = create((set, get) => ({
  switcher: false,
  revalidate: () => set({ switcher: !get().switcher }), // Access the current state of switcher using get()
}));

export default useQueryStore;
