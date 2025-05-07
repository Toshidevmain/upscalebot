const express = require('express');
const axios = require('axios');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('7766519655:AAHvODWpX3EWY6apdeH7MwiHbxKVQ0Qjli4', { polling: true });

const ZETSU_API_URL = 'https://api.zetsu.xyz/tools/restore';

const userStats = {
    photos: {},
    totalRequests: 0,
    users: {},
    commandLogs: []
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🌟 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝘁𝗵𝗲 𝗧𝗼𝘀𝗵𝗶 𝗨𝗽𝘀𝗰𝗮𝗹𝗶𝗻𝗴 𝗕𝗼𝘁! \n🌟𝗥𝗲𝗮𝗱𝘆 𝘁𝗼 𝗲𝗻𝗵𝗮𝗻𝗰𝗲 𝘆𝗼𝘂𝗿 𝗽𝗵𝗼𝘁𝗼𝘀? 𝗖𝗵𝗼𝗼𝘀𝗲 𝘆𝗼𝘂𝗿 𝗹𝗲𝘃𝗲𝗹:\n\n\n✨ 𝗟𝗶𝗴𝗵𝘁 - 𝗦𝘂𝗯𝘁𝗹𝗲 𝘁𝗼𝘂𝗰𝗵-𝘂𝗽\n✨ 𝗠𝗲𝗱𝗶𝘂𝗺 - 𝗕𝗮𝗹𝗮𝗻𝗰𝗲𝗱 𝗲𝗻𝗵𝗮𝗻𝗰𝗲𝗺𝗲𝗻𝘁\n✨ 𝗛𝗲𝗮𝘃𝘆 - 𝗗𝗿𝗮𝗺𝗮𝘁𝗶𝗰 𝘁𝗿𝗮𝗻𝘀𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻\n\n\n𝗦𝗲𝗻𝗱 𝗺𝗲 𝗮 𝗽𝗵𝗼𝘁𝗼 𝗮𝗻𝗱 𝘆𝗼𝘂𝗿 𝗰𝗵𝗼𝘀𝗲𝗻 𝗹𝗲𝘃𝗲𝗹 𝘁𝗼 𝗴𝗲𝘁 𝘀𝘁𝗮𝗿𝘁𝗲𝗱! 𝗘𝗻𝗷𝗼𝘆! 📸✨');
});

bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    bot.getFileLink(fileId).then((fileUrl) => {
        userStats.photos[chatId] = { url: fileUrl, enhancementLevel: null };

        if (!userStats.users[chatId]) {
            userStats.users[chatId] = { enhancements: 0 };
        }

        bot.sendMessage(chatId, '𝗣𝗛𝗢𝗧𝗢 𝗜𝗦 𝗥𝗘𝗖𝗘𝗜𝗩𝗘𝗗: 𝗖𝗛𝗢𝗘𝗦𝗘 𝗧𝗛𝗘 𝗟𝗘𝗩𝗘𝗟 𝗢𝗙 𝗘𝗡𝗛𝗔𝗡𝗖𝗘𝗠𝗘𝗡𝗧:\n\n\n✨ 𝗟𝗶𝗴𝗵𝘁 - 𝗦𝘂𝗯𝘁𝗹𝗲 𝘁𝗼𝘂𝗰𝗵-𝘂𝗽\n✨ 𝗠𝗲𝗱𝗶𝘂𝗺 - 𝗕𝗮𝗹𝗮𝗻𝗰𝗲𝗱 𝗲𝗻𝗵𝗮𝗻𝗰𝗲𝗺𝗲𝗻𝘁\n✨ 𝗛𝗲𝗮𝘃𝘆 - 𝗗𝗿𝗮𝗺𝗮𝘁𝗶𝗰 𝘁𝗿𝗮𝗻𝘀𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻');
    }).catch((error) => {
        console.error('Error fetching file URL:', error);
        bot.sendMessage(chatId, 'There was an issue retrieving the photo. Please try again.');
    });
});

bot.onText(/^(Light|Medium|Heavy)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const enhancementLevel = match[1].toLowerCase();
    const photoData = userStats.photos[chatId];
    const username = msg.from.username;

    if (!photoData) {
        bot.sendMessage(chatId, '𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮 𝗽𝗵𝗼𝘁𝗼 𝗳𝗶𝗿𝘀𝘁 𝗯𝗲𝗳𝗼𝗿𝗲 𝘀𝗲𝗹𝗲𝗰𝘁𝗶𝗻𝗴 𝗮𝗻 𝗲𝗻𝗵𝗮𝗻𝗰𝗲𝗺𝗲𝗻𝘁 𝗹𝗲𝘃𝗲𝗹.');
        return;
    }

    if (photoData.enhancementLevel) {
        bot.sendMessage(chatId, '𝗬𝗼𝘂 𝗵𝗮𝘃𝗲 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝘀𝗲𝗹𝗲𝗰𝘁𝗲𝗱 𝗮𝗻 𝗲𝗻𝗵𝗮𝗻𝗰𝗲𝗺𝗲𝗻𝘁 𝗹𝗲𝘃𝗲𝗹. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝘄𝗵𝗶𝗹𝗲 𝘄𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀 𝗶𝘁.');
        return;
    }

    userStats.photos[chatId].enhancementLevel = enhancementLevel;
    userStats.totalRequests++;

    userStats.commandLogs.push({ username, enhancementLevel, timestamp: new Date().toISOString() });

    const enhancementMessage = await bot.sendMessage(chatId, '𝗘𝗡𝗛𝗔𝗡𝗖𝗜𝗡𝗚 𝗧𝗛𝗘 𝗣𝗛𝗢𝗧𝗢 𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧 𝗔 𝗠𝗢𝗠𝗘𝗡𝗧.');
    const countdownMessage = await bot.sendMessage(chatId, `𝗘𝗻𝗵𝗮𝗻𝗰𝗲𝗺𝗲𝗻𝘁 𝘄𝗶𝗹𝗹 𝘁𝗮𝗸𝗲 𝗮𝗽𝗽𝗿𝗼𝘅𝗶𝗺𝗮𝘁𝗲𝗹𝘆 5 𝘀𝗲𝗰𝗼𝗻𝗱𝘀...`);

    const messageIdsToDelete = [enhancementMessage.message_id, countdownMessage.message_id];

    let countdown = 5;
    const countdownInterval = setInterval(async () => {
        countdown--;
        if (countdown > 0) {
            const countdownMsg = await bot.sendMessage(chatId, `𝗘𝗻𝗵𝗮𝗻𝗰𝗲𝗺𝗲𝗻𝘁 𝘄𝗶𝗹𝗹 𝘁𝗮𝗸𝗲 𝗮𝗽𝗽𝗿𝗼𝘅𝗶𝗺𝗮𝘁𝗲𝗹𝘆 ${countdown} 𝘀𝗲𝗰𝗼𝗻𝗱𝘀.`);
            messageIdsToDelete.push(countdownMsg.message_id);
        } else {
            clearInterval(countdownInterval);
        }
    }, 1000);

    try {
        const response = await axios.get(`${ZETSU_API_URL}?url=${encodeURIComponent(photoData.url)}&level=${enhancementLevel}&apikey=8933abbc66c727718e73a9705eef5086`);

        clearInterval(countdownInterval);

        for (const messageId of messageIdsToDelete) {
            await bot.deleteMessage(chatId, messageId);
        }

        if (response.status === 200 && response.data.result) {
            const upscaledImageUrl = response.data.result;
            bot.sendMessage(chatId, `𝗛𝗘𝗥𝗘 𝗜𝗦 𝗬𝗢𝗨𝗥 𝗘𝗡𝗛𝗔𝗡𝗖𝗘𝗗 𝗜𝗠𝗔𝗚𝗘 :\n\n\n𝗙𝗘𝗘𝗗𝗕𝗔𝗖𝗞 𝗛𝗘𝗥𝗘: @Nighative`);
            bot.sendPhoto(chatId, upscaledImageUrl);
            userStats.users[chatId].enhancements++;
        } else {
            console.error('Error: Invalid response from API:', response.data);
            bot.sendMessage(chatId, 'Sorry, there was an error processing the image.');
        }
    } catch (error) {
        console.error('Error enhancing photo:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error processing the image.');
    }
});

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

app.get('/api/stats', (req, res) => {
    const userCount = Object.keys(userStats.users).length;
    const enhancementDetails = Object.values(userStats.users).reduce((acc, user) => acc + user.enhancements, 0);

    res.json({
        userCount,
        totalRequests: userStats.totalRequests,
        totalEnhancements: enhancementDetails,
        commandLogs: userStats.commandLogs
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
