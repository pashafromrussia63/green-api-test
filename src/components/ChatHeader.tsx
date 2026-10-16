import { formatPhone } from '../utils/phone';

type Props = {
  phone: string;
  onLogout: () => void;
};

export function ChatHeader({ phone, onLogout }: Props) {
  return (
    <header className="chat-header">
      <div className="chat-header-info">
        <strong>{formatPhone(phone)}</strong>
        <span className="chat-header-sub">Whatsapp</span>
      </div>
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={onLogout}
        aria-label="Выйти"
      >
        Выйти
      </button>
    </header>
  );
}