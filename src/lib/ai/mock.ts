// =============================================
// FILE: src/lib/ai/mock.ts (proveedor mock sin costo)
// =============================================

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type EvalResult = {
  grammar: number; vocabulary: number; fluency: number; comprehension: number;
  overall: number; tips: string[];
};

export interface LessonContext {
  title: string;
  grammarPoints: string[];
  vocabList: string[];
}

export class MockProvider {
  async chatTurn(_ctx: LessonContext, _history: ChatTurn[], userInput: string): Promise<string> {
    if (/mother|father|son|daughter|baby/i.test(userInput)) {
      return "Great! Keep sentences short: 'This is the mother.' Try asking: 'Is this the mother?'";
    }
    return "Let's practice with family words: mother, father, son, daughter, baby.";
  }

  async evaluate(_ctx: LessonContext, history: ChatTurn[]) {
    const turns = history.filter((h) => h.role === "user").length;
    const base = Math.min(5, Math.max(2, Math.round(turns / 3)));
    const overall = Math.min(100, base * 20 + (turns >= 6 ? 10 : 0));
    return {
      grammar: base,
      vocabulary: base,
      fluency: base,
      comprehension: base,
      overall,
      tips: [
        "Usa 'This is ...' para presentar.",
        "Para preguntar usa 'Is this ... ?' y responde 'Yes, this is ...'.",
      ],
    } as const;
  }
}
