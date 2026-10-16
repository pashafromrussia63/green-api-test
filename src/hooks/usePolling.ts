import { useEffect, useRef } from 'react';
import { logger } from '../utils/logger';

type PollFn = () => Promise<void>;

export function usePolling(poll: PollFn) {
  const pollRef = useRef(poll);

  useEffect(() => {
    pollRef.current = poll;
  }, [poll]);

  useEffect(() => {
    let cancelled = false;
    let backoff = 1000;

    const loop = async () => {
      while (!cancelled) {
        try {
          await pollRef.current();
          backoff = 1000;
        } catch (err) {
          logger.error('Polling error:', err);
          await new Promise((r) => setTimeout(r, backoff));
          backoff = Math.min(backoff * 2, 30_000);
        }
      }
    };

    loop();

    return () => {
      cancelled = true;
    };
  }, []);
}
