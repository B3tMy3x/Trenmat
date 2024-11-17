import { useLangStore } from "../store/lang";

export function LangToggle() {
  const { lang, setLang } = useLangStore();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ru" : "en")}
      className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
    >
      {lang === "en" ? "RU" : "EN"}
    </button>
  );
}
