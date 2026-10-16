import type { Message } from '../types/chat';
import { formatTime } from '../utils/time';

type Props = {
  message: Message;
  onRetry?: (id: string) => void;
};

export function MessageBubble({ message, onRetry }: Props) {
  const isMe = message.sender === 'me';

  return (
    <div className={`bubble-row ${isMe ? 'right' : 'left'}`}>
      <div className={`bubble ${isMe ? 'bubble-me' : 'bubble-them'}`}>
        <span className="bubble-text">{message.text}</span>
        <span className="bubble-meta">
          {message.status === 'sending' && <span className="bubble-status">…</span>}
          {message.status === 'failed' && (
            <button
              className="bubble-retry"
              onClick={() => onRetry?.(message.id)}
              aria-label="Повторить отправку"
            >
              ⚠
            </button>
          )}
          <span className="bubble-time">{formatTime(message.timestamp)}</span>
        </span>
      </div>
    </div>
  );
}