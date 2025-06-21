import Storage from "@/hooks/Storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChstStore = create(
  persist((set) => ({}), {
    name: "chat-store",
    storage: Storage,
  })
);
