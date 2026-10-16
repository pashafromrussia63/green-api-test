import { useCallback } from 'react';
import * as api from '../services/api';
import type { Credentials, Message } from '../types/chat';

export function useGreenApi(creds: Credentials | null) {
    const send = useCallback(
        async (phone: string, text: string): Promise<string> => {
            if (!creds) throw new Error('Not authenticated');
            const { idMessage } = await api.sendMessage(creds, phone, text);
            return idMessage;
        },
        [creds]
    );

    const poll = useCallback(
        async (): Promise<{ message: Message; senderPhone: string } | null> => {
            if (!creds) return null;

            const notification = await api.receiveNotification(creds);
            if (!notification) return null;

            const { body } = notification;
            const msgType = body.messageData?.typeMessage;

            const cleanup = () => api.deleteNotification(creds, notification.receiptId).catch(() => {});

            let incoming: { message: Message; senderPhone: string } | null = null;

            const isIncoming = body.typeWebhook === 'incomingMessageReceived';
            const isOutgoingEcho = body.typeWebhook === 'outgoingMessageReceived';

            if (
                (isIncoming || isOutgoingEcho) &&
                (msgType === 'textMessage' || msgType === 'extendedTextMessage')
            ) {
                const text =
                body.messageData?.textMessageData?.textMessage ??
                body.messageData?.extendedTextMessageData?.text ??
                '';

                const chatId = body.senderData?.chatId ?? '';
                const senderPhone = chatId.replace('@c.us', '');

                incoming = {
                    message: {
                        id: isIncoming
                        ? `in-${notification.receiptId}`
                        : `out-echo-${notification.receiptId}`,
                        text,
                        sender: isIncoming ? 'them' : 'me',
                        timestamp: Date.now(),
                        status: 'sent',
                    },
                    senderPhone,
                };
            }

            await cleanup();
            return incoming;
        },
        [creds]
    );

    const verify = useCallback(async () => {
        if (!creds) throw new Error('Not authenticated');
        await api.getSettings(creds);
    }, [creds]);

    return { send, poll, verify };
}