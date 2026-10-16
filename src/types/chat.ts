export type Message = {
    id: string;
    text: string;
    sender: 'me' | 'them';
    timestamp: number;
    status?: 'sending' | 'sent' | 'failed';
};

export type Chat = {
    phone: string;
    messages: Message[];
};

export type Credentials = {
    idInstance: string;
    apiTokenInstance: string;
};