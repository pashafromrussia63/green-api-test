import { useState } from 'react';
import type { Credentials } from '../types/chat';

type Props = {
  onLogin: (creds: Credentials) => Promise<void>;
};

export function LoginScreen({ onLogin }: Props) {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      setError('Заполните оба поля');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onLogin({
        idInstance: idInstance.trim(),
        apiTokenInstance: apiTokenInstance.trim(),
      });
    } catch {
      setError('Не удалось подключиться. Проверьте idInstance и apiTokenInstance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">GREEN-API Chat</h1>
        <p className="login-subtitle">Войдите в свой аккаунт</p>

        <label className="form-label">
          idInstance
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
          />
        </label>

        <label className="form-label">
          apiTokenInstance
          <input
            className="form-control"
            type="password"
            autoComplete="off"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
          />
        </label>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? 'Проверка...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}