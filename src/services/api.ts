import axios from 'axios';
import type { Credentials } from '../types/chat';

export const DEFAULT_API_HOST =
  import.meta.env.VITE_GREEN_API_HOST ?? 'https://api.greenapi.com';

const api = axios.create({
  timeout: 30_000,
});

function resolveHost(creds: Credentials): string {
  const host = creds.apiHost?.trim() || DEFAULT_API_HOST;
  return host.replace(/\/+$/, '');
}

export const getSettings = async (creds: Credentials) => {
  const { idInstance, apiTokenInstance } = creds;
  const res = await api.get(
    `/waInstance${idInstance}/getSettings/${apiTokenInstance}`,
    { baseURL: resolveHost(creds) }
  );
  return res.data;
};

export const sendMessage = async (
  creds: Credentials,
  phone: string,
  text: string
) => {
  const { idInstance, apiTokenInstance } = creds;
  const res = await api.post(
    `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
    {
      chatId: `${phone}@c.us`,
      message: text,
      typingTime: 1000,
    },
    { baseURL: resolveHost(creds) }
  );
  return res.data as { idMessage: string };
};

export type GreenApiNotification = {
  receiptId: number;
  body: {
    typeWebhook: string;
    senderData?: { chatId: string; sender: string };
    messageData?: {
      typeMessage: string;
      textMessageData?: { textMessage: string };
      extendedTextMessageData?: { text: string };
    };
  };
};

export const receiveNotification = async (
  creds: Credentials
): Promise<GreenApiNotification | null> => {
  const { idInstance, apiTokenInstance } = creds;
  const res = await api.get(
    `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
    { baseURL: resolveHost(creds) }
  );
  return res.data;
};

export const deleteNotification = async (
  creds: Credentials,
  receiptId: number
) => {
  const { idInstance, apiTokenInstance } = creds;
  const res = await api.delete(
    `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
    { baseURL: resolveHost(creds) }
  );
  return res.data;
};
