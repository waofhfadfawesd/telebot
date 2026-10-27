# ربات تلگرام - Cloudflare Worker

## راه‌اندازی

1. وابستگی‌ها را نصب کنید:
   ```bash
   npm install
   ```

2. ربات را در BotFather بسازید و توکن را بگیرید.

3. توکن و رمز وب‌هوک را به‌عنوان secret ثبت کنید:
   ```bash
   npx wrangler secret put BOT_TOKEN
   npx wrangler secret put WEBHOOK_SECRET
   ```

4. دیپلوی کنید:
   ```bash
   npm run deploy
   ```

5. وب‌هوک را ثبت کنید (یک‌بار):
   ```
   https://<worker>.workers.dev/setWebhook?secret=<WEBHOOK_SECRET>
   ```

## رفتار
- با ارسال `/start` ربات پاسخ `سلام 👋` می‌دهد.
- برای پیام‌های دیگر هم پیام خوش‌آمد می‌فرستد.

## دیپلوی زنده
- Worker URL: https://telegram-bot.waofhfadfawesd.workers.dev
- Webhook: https://telegram-bot.waofhfadfawesd.workers.dev/webhook
- Webhook در تلگرام ثبت شده است (secret token فعال).
