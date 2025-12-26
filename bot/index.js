require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('Bot is running...');

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Assalomu alaykum! 'HARAKAT' turar-joy majmuasiga xush kelibsiz.\n\nSizning Chat ID: ${chatId}\n\nUshbu IDni .env fayliga VITE_TELEGRAM_CHAT_ID sifatida qo'shing.`, {
        reply_markup: {
            keyboard: [
                [{ text: "Raqamni yuborish", char_code: 43, request_contact: true }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

bot.on('contact', (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.contact.first_name;
    const phoneNumber = msg.contact.phone_number;

    bot.sendMessage(chatId, `Rahmat, ${firstName}! Menejerimiz tez orada siz bilan bog'lanadi.`);

    // LOG Lead (In a real app, send to CRM or Email)
    console.log(`NEW LEAD: ${firstName} - ${phoneNumber}`);
});
