interface ChatTurn {
  user: string;
  ai: string;
  intent: string;
}

let sessionMemory: ChatTurn[] = [];

export const addToMemory = (user: string, ai: string, intent: string) => {
  sessionMemory.push({ user, ai, intent });
  if (sessionMemory.length > 5) sessionMemory.shift(); // Keep only last 5 turns
};

export const getLastIntent = (): string | null => {
  if (sessionMemory.length === 0) return null;
  return sessionMemory[sessionMemory.length - 1].intent;
};

export const clearMemory = () => {
  sessionMemory = [];
};
