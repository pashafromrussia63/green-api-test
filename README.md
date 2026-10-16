# green-api-test

Веб-чат на React + TypeScript + Vite для работы с [GREEN-API](https://green-api.com/) (WhatsApp).

## Требования

- [Node.js](https://nodejs.org/) 20+ (рекомендуется LTS)
- npm (идёт вместе с Node.js)
- Аккаунт GREEN-API с активным инстансом (`idInstance` и `apiTokenInstance`)

## Локальный запуск

1. Клонируйте репозиторий и перейдите в папку проекта:

```bash
git clone <url-репозитория>
cd green-api-test
```

2. Установите зависимости:

```bash
npm install
```

3. (Опционально) Задайте хост API, если ваш инстанс на другом сервере. По умолчанию используется `https://7107.api.greenapi.com`.

Создайте файл `.env` в корне проекта:

```env
VITE_GREEN_API_HOST=https://7107.api.greenapi.com
```

Хост можно посмотреть в личном кабинете GREEN-API у вашего инстанса.

4. Запустите dev-сервер:

```bash
npm run dev
```

5. Откройте в браузере адрес, который выведет Vite (обычно [http://localhost:5173](http://localhost:5173)).

6. На экране входа укажите `idInstance` и `apiTokenInstance` из [кабинета GREEN-API](https://console.green-api.com/). После успешной проверки откроется чат.

## Другие команды

| Команда | Описание |
| --- | --- |
| `npm run dev` | Dev-сервер с hot reload |
| `npm run build` | Сборка production в папку `dist` |
| `npm run preview` | Локальный просмотр собранного `dist` |
| `npm run lint` | Проверка ESLint |

## Как пользоваться

1. Войдите с данными инстанса GREEN-API.
2. В сайдбаре добавьте чат по номеру телефона (международный формат, без `+`, например `79001234567`).
3. Отправляйте текстовые сообщения; входящие подтягиваются через polling `receiveNotification`.

Учётные данные сохраняются в `localStorage` браузера. При выходе они удаляются.
