import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLayoutStore = create(
  persist(
    (set) => ({
      activeTab: "chats",
      selectedContact: null,
      setSelectContact: (contact) => set({ selectedContact: contact }),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "layout-storage",
    }
  )
);

export default useLayoutStore;
