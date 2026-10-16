import { useState } from 'react';

type Props = {
  onSend: (text: string) => void;
};

export function MessageInput({ onSend }: Props) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <div className="message-input">
      <input
        className="form-control"
        type="text"
        placeholder="Введите сообщение..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        aria-label="Сообщение"
      />
      <button
        className="btn btn-primary"
        onClick={handleSend}
        disabled={!text.trim()}
      >
        Отправить
      </button>
    </div>
  );
}
