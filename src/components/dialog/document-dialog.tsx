import { $, component$, useSignal } from "@builder.io/qwik";
import { type Sentence, validateSentences } from "~/schemas/sentences";

interface DocumentDialogProps {
  onClose: () => void;
  onUpdateSentences: (sentences: Sentence) => void;
  defaultValue: string;
}

export const DocumentDialog = component$<DocumentDialogProps>(
  ({ onClose, onUpdateSentences, defaultValue }) => {
    const jsonError = useSignal<string>("");
    const textareaValue = useSignal(defaultValue);

    const handleApply = $(() => {
      try {
        const parsedJson = JSON.parse(textareaValue.value);
        const validatedSentences = validateSentences(parsedJson);

        onUpdateSentences(validatedSentences);
        jsonError.value = "";
        onClose();
      } catch (e) {
        jsonError.value =
          e instanceof Error ? e.message : "Invalid JSON format";
      }
    });

    return (
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white w-full h-full md:w-[800px] md:h-[600px] md:rounded-lg flex flex-col">
          <header class="flex justify-between items-center p-6">
            <h2 class="text-2xl font-bold text-black">マッピングの変更</h2>
            <button
              type="button"
              class="p-2 hover:bg-gray-100 rounded-full text-black"
              onClick$={onClose}
              aria-label="Close dialog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>
          <div class="flex-1 overflow-y-auto p-6 pt-0">
            <div class="flex flex-col gap-4 text-black">
              <div class="flex flex-col gap-2 prose max-w-none text-black">
                <p>1. 以下のテキストエリアにJSONデータを入力</p>
                <p>2. Applyボタンをクリックして適用</p>
              </div>

              <textarea
                value={textareaValue.value}
                onChange$={(e) => {
                  textareaValue.value = (e.target as HTMLTextAreaElement).value;
                }}
                class="w-full h-[300px] p-4 font-mono text-sm border rounded-lg text-black"
                spellcheck={false}
              />

              {jsonError.value && <p class="text-red-600">{jsonError.value}</p>}
            </div>
          </div>

          <footer class="border-t p-4">
            <div class="flex justify-end">
              <button
                type="button"
                onClick$={handleApply}
                class="flex-1 px-4 py-4 rounded-lg bg-blue-600 text-2xl text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </footer>
        </div>
      </div>
    );
  }
);
