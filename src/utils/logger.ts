export const logger = {
  error: (...args: unknown[]) => {
    console.error('[app]', ...args);
  },
};