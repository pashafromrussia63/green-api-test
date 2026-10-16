import { useCallback, useEffect, useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { ChatPage } from './components/ChatPage';
import { useGreenApi } from './hooks/useGreenApi';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getSettings } from './services/api';
import type { Credentials } from './types/chat';

const CREDS_KEY = 'green-api-creds';

export default function App() {
  const [credentials, setCredentials] = useLocalStorage<Credentials | null>(
    CREDS_KEY,
    null
  );

  const [checking, setChecking] = useState<boolean>(!!credentials);

  const { verify } = useGreenApi(credentials);

  useEffect(() => {
    if (!credentials) return;

    let cancelled = false;

    verify()
      .catch(() => {
        if (!cancelled) setCredentials(null);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = useCallback(
    async (creds: Credentials) => {
      await getSettings(creds);
      setCredentials(creds);
    },
    [setCredentials]
  );

  const handleLogout = useCallback(() => {
    setCredentials(null);
    localStorage.removeItem('green-api-chats');
  }, [setCredentials]);

  if (checking) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <span className="text-muted">Проверка подключения...</span>
      </div>
    );
  }

  if (!credentials) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <ChatPage credentials={credentials} onLogout={handleLogout} />;
}