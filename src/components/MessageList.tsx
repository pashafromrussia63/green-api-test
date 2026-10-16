import { useEffect, useMemo, useRef } from 'react';
import type { Message } from '../types/chat';
import { groupByDate } from '../utils/time';
import { MessageBubble } from './MessageBubble';

type Props = {
  messages: Message[];
  onRetry: (id: string) => void;
};

export function MessageList({ messages, onRetry }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  const groups = useMemo(() => groupByDate(messages), [messages]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      shouldAutoScroll.current = distance < 100;
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (shouldAutoScroll.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="message-list empty" ref={containerRef}>
        <div className="empty-state">Начните диалог — напишите первое сообщение</div>
      </div>
    );
  }

  return (
    <div className="message-list" ref={containerRef} role="log" aria-live="polite">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="date-divider">
            <span>{group.label}</span>
          </div>
          {group.items.map((m) => (
            <MessageBubble key={m.id} message={m} onRetry={onRetry} />
          ))}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}