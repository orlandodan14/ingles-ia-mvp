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

export interface AIProvider {
  chatTurn(ctx: LessonContext, history: ChatTurn[], userInput: string): Promise<string>;
  evaluate(ctx: LessonContext, history: ChatTurn[]): Promise<EvalResult>;
}
