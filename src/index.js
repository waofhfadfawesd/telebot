// Cloudflare Worker - Telegram Bot
// Responds to /start with "سلام"

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Health check / info
    if (request.method === 'GET') {
      if (url.pathname === '/setWebhook') {
        // Helper endpoint to register the webhook with Telegram.
        // Visit: https://<worker>.workers.dev/setWebhook?secret=<WEBHOOK_SECRET>
        const secret = url.searchParams.get('secret');
        if (!env.WEBHOOK_SECRET || secret !== env.WEBHOOK_SECRET) {
          return new Response('Unauthorized', { status: 401 });
        }
        const webhookUrl = `${url.origin}/webhook`;
        const tgRes = await fetch(
          `https://api.telegram.org/bot${env.BOT_TOKEN}/setWebhook`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: webhookUrl,
              secret_token: env.WEBHOOK_SECRET,
            }),
          }
        );
        const data = await tgRes.json();
        return new Response(JSON.stringify(data, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(
        'Telegram bot worker is running. POST updates to /webhook.',
        { status: 200 }
      );
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Verify Telegram secret token if configured
    if (env.WEBHOOK_SECRET) {
      const token = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (token !== env.WEBHOOK_SECRET) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    let update;
    try {
      update = await request.json();
    } catch {
      return new Response('Bad request', { status: 400 });
    }

    const message = update.message || update.edited_message;
    if (!message) {
      return new Response('ok');
    }

    const chatId = message.chat?.id;
    const text = (message.text || '').trim();

    if (!chatId) {
      return new Response('ok');
    }

    if (text === '/start' || text.startsWith('/start ')) {
      await sendTelegramMessage(env.BOT_TOKEN, chatId, 'سلام 👋 به ربات خوش آمدید!');
    } else {
      // Optional: echo a friendly reply for any other message
      await sendTelegramMessage(
        env.BOT_TOKEN,
        chatId,
        'سلام! برای شروع /start را بزنید.'
      );
    }

    return new Response('ok');
  },
};

async function sendTelegramMessage(token, chatId, text) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  if (!res.ok) {
    console.error('sendMessage failed', await res.text());
  }
}
