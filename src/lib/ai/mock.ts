import { AIProvider, ChatTurn, LessonContext, EvalResult } from "./types";

export class MockProvider implements AIProvider {
  async chatTurn(ctx: LessonContext, history: ChatTurn[], userInput: string): Promise<string> {
    // Respuesta súper simple acotada a vocabulario de la lección:
    const safe = userInput.toLowerCase().includes("name")
      ? "My name is Ana. What is your name?"
      : "Nice. Where are you from?";
    return `[${ctx.title}] ${safe}`;
  }

  async evaluate(ctx: LessonContext, history: ChatTurn[]): Promise<EvalResult> {
    // Simulación básica: mínimo para desbloquear si hubo 8 turnos
    const turns = history.filter(h => h.role === "user").length;
    const base = Math.min(5, Math.max(2, Math.round(turns / 3)));
    const overall = Math.round((base * 20) + (turns >= 8 ? 10 : 0));
    return {
      grammar: base, vocabulary: base, fluency: base, comprehension: base,
      overall: Math.min(100, overall),
      tips: [
        "Usa oraciones cortas con el verbo 'to be'.",
        "Practica presentarte: 'I am ____. I am from ____.'"
      ]
    };
  }
}
