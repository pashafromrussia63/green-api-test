import axios from 'axios';
import type { Credentials } from '../types/chat';

const api = axios.create({
  baseURL: import.meta.env.VITE_GREEN_API_HOST ?? 'https://api.greenapi.com',
  timeout: 30_000,
});

export const getSettings = async (creds: Credentials) => {
  const { idInstance, apiTokenInstance } = creds;
  const res = await api.get(
    `/waInstance${idInstance}/getSettings/${apiTokenInstance}`
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
    }
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
    `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
  );
  return res.data;
};

export const deleteNotification = async (
  creds: Credentials,
  receiptId: number
) => {
  const { idInstance, apiTokenInstance } = creds;
  const res = await api.delete(
    `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
  );
  return res.data;
};
