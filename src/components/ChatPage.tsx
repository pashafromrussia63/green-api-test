import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { ErrorBanner } from '../components/ErrorBanner';
import { useGreenApi } from '../hooks/useGreenApi';
import { usePolling } from '../hooks/usePolling';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { logger } from '../utils/logger';
import type { Chat, Credentials, Message } from '../types/chat';

type Props = {
  credentials: Credentials;
  onLogout: () => void;
};

const STORAGE_KEY = 'green-api-chats';

export function ChatPage({ credentials, onLogout }: Props) {
  const [chats, setChats] = useLocalStorage<Chat[]>(STORAGE_KEY, []);
  const [activePhone, setActivePhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { send, poll } = useGreenApi(credentials);

  const activeChat = useMemo(
    () => chats.find((c) => c.phone === activePhone),
    [chats, activePhone]
  );

  const upsertChat = useCallback(
    (phone: string, updater: (chat: Chat) => Chat) => {
      setChats((prev) => {
        const idx = prev.findIndex((c) => c.phone === phone);
        if (idx === -1) {
          const created = updater({ phone, messages: [] });
          return [...prev, created];
        }
        const next = [...prev];
        next[idx] = updater(prev[idx]);
        return next;
      });
    },
    [setChats]
  );

  const appendMessage = useCallback(
    (phone: string, message: Message) => {
      upsertChat(phone, (chat) => {
        if (chat.messages.some((m) => m.id === message.id)) return chat;
        return {
          ...chat,
          messages: [...chat.messages, message]
        };
      });
    },
    [upsertChat]
  );

  const updateMessageStatus = useCallback(
    (phone: string, messageId: string, status: Message['status']) => {
      upsertChat(phone, (chat) => ({
        ...chat,
        messages: chat.messages.map((m) =>
          m.id === messageId ? { ...m, status } : m
        ),
      }));
    },
    [upsertChat]
  );

  const createChat = useCallback(
    (phone: string) => {
      setChats((prev) => {
        if (prev.some((c) => c.phone === phone)) return prev;
        return [...prev, { phone, messages: [] }];
      });
      setActivePhone(phone);
    },
    [setChats]
  );

  const handleSend = useCallback(
    async (text: string) => {
      if (!activePhone) return;

      const tempId = `out-${Date.now()}`;
      const optimistic: Message = {
        id: tempId,
        text,
        sender: 'me',
        timestamp: Date.now(),
        status: 'sending',
      };
      appendMessage(activePhone, optimistic);

      try {
        await send(activePhone, text);
        updateMessageStatus(activePhone, tempId, 'sent');
      } catch (err) {
        logger.error('Send failed:', err);
        updateMessageStatus(activePhone, tempId, 'failed');
        setError('Не удалось отправить сообщение');
      }
    },
    [activePhone, appendMessage, send, updateMessageStatus]
  );

  const handleRetry = useCallback(
    async (messageId: string) => {
      if (!activeChat) return;
      const failed = activeChat.messages.find((m) => m.id === messageId);
      if (!failed) return;

      updateMessageStatus(activeChat.phone, messageId, 'sending');
      try {
        await send(activeChat.phone, failed.text);
        updateMessageStatus(activeChat.phone, messageId, 'sent');
      } catch {
        updateMessageStatus(activeChat.phone, messageId, 'failed');
      }
    },
    [activeChat, send, updateMessageStatus]
  );

  const doPoll = useCallback(async () => {
    const incoming = await poll();
    if (!incoming) return;
  
    const { message, senderPhone } = incoming;
  
    setChats((prev) => {
      const existing = prev.find((c) => c.phone === senderPhone);
      const updated = existing ?? {
        phone: senderPhone,
        messages: [] as Message[]
      };
  
      const isDuplicate = updated.messages.some(
        (m) =>
          m.sender === message.sender &&
          m.text === message.text &&
          Math.abs(m.timestamp - message.timestamp) < 10_000
      );
      if (isDuplicate) return prev;
  
      const next = {
        ...updated,
        messages: [...updated.messages, message],
      };
  
      return existing
        ? prev.map((c) => (c.phone === senderPhone ? next : c))
        : [...prev, next];
    });
  
    setActivePhone((prev) => prev || senderPhone);
  }, [poll, setChats]);

  usePolling(doPoll);

  useEffect(() => {
    if (activePhone && !activeChat) setActivePhone('');
  }, [activePhone, activeChat]);

  return (
    <div className="chat-layout">
      <Sidebar
        chats={chats}
        activePhone={activePhone}
        onSelect={setActivePhone}
        onCreate={createChat}
      />

      <main className="chat-main">
        {activePhone ? (
          <>
            <ChatHeader phone={activePhone} onLogout={onLogout} />
            {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
            <MessageList
              messages={activeChat?.messages ?? []}
              onRetry={handleRetry}
            />
            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Выберите чат слева или создайте новый</p>
          </div>
        )}
      </main>
    </div>
  );
}