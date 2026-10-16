import { useState } from 'react';
import type { Chat } from '../types/chat';
import { formatPhone, isValidPhone, normalizePhone } from '../utils/phone';

type Props = {
  chats: Chat[];
  activePhone: string;
  onSelect: (phone: string) => void;
  onCreate: (phone: string) => void;
};

export function Sidebar({ chats, activePhone, onSelect, onCreate }: Props) {
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleCreate = () => {
    const digits = normalizePhone(input);
    if (!isValidPhone(digits)) {
      setInputError('Введите номер в формате 79001234567');
      return;
    }
    setInputError(null);
    onCreate(digits);
    setInput('');
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Чаты</h2>

      <div className="new-chat">
        <label className="form-label small mb-1" htmlFor="new-chat-phone">
          Номер получателя
        </label>
        <input
          id="new-chat-phone"
          className="form-control mb-2"
          type="tel"
          placeholder="79001234567"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCreate();
            }
          }}
        />
        {inputError && (
          <div className="text-danger small mb-2" role="alert">
            {inputError}
          </div>
        )}
        <button className="btn btn-primary w-100" onClick={handleCreate}>
          Создать чат
        </button>
      </div>

      <div className="chat-list">
        {chats.length === 0 && (
          <p className="text-muted small text-center mt-3">
            Пока нет чатов
          </p>
        )}
        {chats.map((chat) => (
          <button
            key={chat.phone}
            className={`chat-item ${chat.phone === activePhone ? 'active' : ''}`}
            onClick={() => onSelect(chat.phone)}
          >
            <div className="chat-avatar">{chat.phone.slice(-2)}</div>
            <div className="chat-meta">
              <div className="chat-name">{formatPhone(chat.phone)}</div>
              <div className="chat-preview">
                {chat.messages[chat.messages.length - 1]?.text ?? 'Нет сообщений'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}