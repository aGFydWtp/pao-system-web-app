import { type InferOutput, object, record, safeParse, string } from "valibot";

const SentenceSchema = object({
  person: string(),
  action: string(),
  object: string(),
});

const SentencesSchema = record(string(), SentenceSchema);

export type Sentence = InferOutput<typeof SentencesSchema>;

export const validateSentences = (input: unknown) => {
  const result = safeParse(SentencesSchema, input);
  if (!result.success) {
    throw new Error(
      `Invalid sentences format: ${result.issues.at(0)?.message}`
    );
  }
  return result.output;
};
