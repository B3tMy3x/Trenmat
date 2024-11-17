import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../i18n";

interface LangState {
  lang: string;
  setLang: (lang: string) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => {
        i18n.changeLanguage(lang);
        set({ lang });
      },
    }),
    {
      name: "lang-storage",
    },
  ),
);
