import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { DocumentDialog } from "~/components/dialog/document-dialog";
import { type Sentence, validateSentences } from "~/schemas/sentences";
import defaultSentences from "../data/sentences.json";

type DisplayType = "person" | "action" | "object";
const STORAGE_KEY = "pao-sentences";

export default component$(() => {
  const selectedType = useSignal<DisplayType>("person");
  const currentKey = useSignal<string>("00");
  const showValue = useSignal(false);
  const showDialog = useSignal(false);
  const customSentences = useSignal<Sentence>(defaultSentences);

  const handleShuffle = $(() => {
    const keys = Object.keys(customSentences.value);
    if (keys.length < 2) {
      currentKey.value = keys[0];
    } else {
      let newKey: string;
      do {
        const randomIndex = Math.floor(Math.random() * keys.length);
        newKey = keys[randomIndex];
      } while (newKey === currentKey.value);
      currentKey.value = newKey;
    }
    showValue.value = false;
  });

  const handleUpdateSentences = $((newSentences: Sentence) => {
    customSentences.value = newSentences;
    // LocalStorageに保存
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSentences));
  });

  const handleShow = $(() => {
    showValue.value = true;
  });

  const handleCloseDialog = $(() => {
    showDialog.value = false;
  });

  // LocalStorageからデータを読み込む
  useVisibleTask$(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = validateSentences(parsed);
        customSentences.value = validated;
      }
    } catch (e) {
      console.warn("Failed to load sentences from localStorage:", e);
      customSentences.value = defaultSentences;
    }
    handleShuffle();
  });

  return (
    <div class="min-h-screen flex flex-col">
      <header class="bg-blue-600 shadow-lg">
        <div class="mx-auto px-4 py-2">
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">PAO System</h1>
            <button
              type="button"
              class="p-2 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="document"
              onClick$={() => {
                showDialog.value = true;
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <title>document</title>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div class="flex-1 container mx-auto px-4 py-6">
        <div class="flex flex-col items-center gap-6">
          <select
            value={selectedType.value}
            onChange$={(e) => {
              const value = (e.target as HTMLSelectElement).value;
              if (
                value === "person" ||
                value === "action" ||
                value === "object"
              ) {
                selectedType.value = value;
                showValue.value = false;
              }
            }}
            class="w-full max-w-xs p-3 rounded-lg border border-gray-300 text-lg text-black"
          >
            <option value="person">Person</option>
            <option value="action">Action</option>
            <option value="object">Object</option>
          </select>

          <div class="text-9xl md:text-9xl font-bold my-4">
            {currentKey.value}
          </div>

          {showValue.value && (
            <div class="text-2xl md:text-2xl mt-4 text-center px-4">
              {customSentences.value[currentKey.value][selectedType.value]}
            </div>
          )}
        </div>
      </div>

      <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
        <div class="mx-auto px-4 py-4">
          <div class="flex gap-4 justify-center">
            <div class="flex gap-4 w-full md:w-[600px]">
              <button
                type="button"
                onClick$={handleShow}
                class="flex-1 px-4 py-4 rounded-lg bg-blue-600 text-2xl text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Show
              </button>
              <button
                type="button"
                onClick$={handleShuffle}
                class="flex-1 px-4 py-4 rounded-lg bg-blue-600 text-2xl text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Shuffle
              </button>
            </div>
          </div>
        </div>
      </footer>

      {showDialog.value && (
        <DocumentDialog
          onClose={handleCloseDialog}
          onUpdateSentences={handleUpdateSentences}
          defaultValue={JSON.stringify(customSentences.value, null, 2)}
        />
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "PAO System",
};
