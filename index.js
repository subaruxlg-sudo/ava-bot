const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, Events, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const token = process.env.TOKEN;

const textLevels = new Map();
const voiceLevels = new Map();
const voiceTimers = new Map();

function getNextLevelXP(level) {
    return level * 100 + 150;
}

client.once(Events.ClientReady, () => {
    console.log(`Logged in as: ${client.user.tag}`);
});

// ==================== 1. نظام الصوت (Voice XP) ==================== //
client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    const member = newState.member;
    if (!member || member.user.bot) return;

    const userId = member.id;
    const guildId = newState.guild.id;
    const key = `${guildId}-${userId}`;

    if (!oldState.channelId && newState.channelId) {
        if (!voiceTimers.has(key)) {
            const interval = setInterval(() => {
                if (!member.voice.channel) {
                    clearInterval(interval);
                    voiceTimers.delete(key);
                    return;
                }

                let vData = voiceLevels.get(key) || { xp: 0, level: 1, minutes: 0 };
                const xpToAdd = Math.floor(Math.random() * 6) + 10;
                vData.xp += xpToAdd;
                vData.minutes += 1;

                const reqXP = getNextLevelXP(vData.level);
                if (vData.xp >= reqXP) {
                    vData.level += 1;
                    vData.xp = 0;
                }
                voiceLevels.set(key, vData);

            }, 60000);

            voiceTimers.set(key, interval);
        }
    } else if (oldState.channelId && !newState.channelId) {
        if (voiceTimers.has(key)) {
            clearInterval(voiceTimers.get(key));
            voiceTimers.delete(key);
        }
    }
});

// ==================== 2. نظام الرسائل والأوامر ==================== //
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.guild) {
        const guildId = message.guild.id;
        const userId = message.author.id;
        const key = `${guildId}-${userId}`;
        const msgContent = message.content.trim();

        // أ) أمر الاستعلام الشخصي (R فقط)
        if (msgContent.toLowerCase() === "r") {
            const tData = textLevels.get(key) || { xp: 0, level: 1, messagesCount: 0 };
            const vData = voiceLevels.get(key) || { xp: 0, level: 1, minutes: 0 };
            
            const reqTextXP = getNextLevelXP(tData.level);
            const reqVoiceXP = getNextLevelXP(vData.level);

            const rankEmbed = new EmbedBuilder()
                .setColor("#0099FF")
                .setTitle(`📊 بطاقة المستويات لـ ${message.author.username}`)
                .addFields(
                    { name: "💬 تفاعل الشات", value: `Level: **${tData.level}** | XP: **${tData.xp}/${reqTextXP}**\nالرسائل: **${tData.messagesCount}**`, inline: false },
                    { name: "🎙️ تفاعل الصوت", value: `Level: **${vData.level}** | XP: **${vData.xp}/${reqVoiceXP}**\nالوقت: **${vData.minutes} دقيقة**`, inline: false }
                )
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            await message.reply({ embeds: [rankEmbed] });
            return;
        }

        // ب) أمر التوب المتكامل (T فقط)
        if (msgContent.toLowerCase() === "t") {
            // 1. توب الشات
            const textUsers = [];
            for (const [k, data] of textLevels.entries()) {
                if (k.startsWith(`${guildId}-`)) {
                    textUsers.push({ userId: k.split("-")[1], ...data });
                }
            }
            textUsers.sort((a, b) => (b.level * 1000 + b.xp) - (a.level * 1000 + a.xp));
            const topText = textUsers.slice(0, 5);

            let textDesc = "";
            if (topText.length === 0) textDesc = "لا توجد بيانات شات مسجلة بعد.\n";
            else {
                topText.forEach((u, i) => {
                    let m = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔸";
                    textDesc += `${m} | **#${i + 1}** <@${u.userId}> - XP: **${u.xp}** | Level: **${u.level}**\n`;
                });
            }

            // 2. توب الصوت
            const voiceUsers = [];
            for (const [k, data] of voiceLevels.entries()) {
                if (k.startsWith(`${guildId}-`)) {
                    voiceUsers.push({ userId: k.split("-")[1], ...data });
                }
            }
            voiceUsers.sort((a, b) => (b.level * 1000 + b.xp) - (a.level * 1000 + a.xp));
            const topVoice = voiceUsers.slice(0, 5);

            let voiceDesc = "";
            if (topVoice.length === 0) voiceDesc = "لا توجد بيانات صوت مسجلة بعد.";
            else {
                topVoice.forEach((u, i) => {
                    let m = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔸";
                    voiceDesc += `${m} | **#${i + 1}** <@${u.userId}> - XP: **${u.xp}** | Level: **${u.level}**\n`;
                });
            }

            const topEmbed = new EmbedBuilder()
                .setColor("#FFD700")
                .setTitle("🏆 لوحة متصدري السيرفر (Leaderboard)")
                .addFields(
                    { name: "💬 TOP TEXT (الشات الكتابي)", value: textDesc, inline: false },
                    { name: "🎙️ TOP VOICE (الرومات الصوتية)", value: voiceDesc, inline: false }
                )
                .setFooter({ text: `طلب بواسطة ${message.author.username}` })
                .setTimestamp();

            await message.channel.send({ embeds: [topEmbed] });
            return;
        }

        // ج) أمر الترسيت للإداريين (!reset)
        if (msgContent.startsWith("!reset")) {
            if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return message.reply({ content: "❌ هذا الأمر مخصص للإداريين (Administrator) فقط!", ephemeral: true });
            }

            const args = msgContent.split(" ");
            const targetType = args[1];

            if (targetType === "all") {
                textLevels.clear();
                voiceLevels.clear();
                return message.reply("🔄 تم تصفير جميع نقاط الشات والصوت للسيرفر بالكامل!");
            } else if (targetType === "text") {
                textLevels.clear();
                return message.reply("🔄 تم تصفير نقاط الشات فقط بنجاح!");
            } else if (targetType === "voice") {
                voiceLevels.clear();
                return message.reply("🔄 تم تصفير نقاط الصوت فقط بنجاح!");
            }

            return message.reply("⚠️ الاستخدام الصحيح:\n`!reset all` (تصفير الكل)\n`!reset text` (تصفير الشات)\n`!reset voice` (تصفير الصوت)");
        }

        // زيادة نقاط الشات تلقائياً مع كل رسالة
        let tData = textLevels.get(key) || { xp: 0, level: 1, messagesCount: 0 };
        const xpToAdd = Math.floor(Math.random() * 11) + 15;
        tData.xp += xpToAdd;
        tData.messagesCount += 1;

        const reqTextXP = getNextLevelXP(tData.level);
        if (tData.xp >= reqTextXP) {
            tData.level += 1;
            tData.xp = 0;
            const lvlEmbed = new EmbedBuilder().setColor("#FFD700").setDescription(`🎉 مبروك ${message.author}، صعدت للفل شات **${tData.level}**!`);
            const sent = await message.channel.send({ embeds: [lvlEmbed] });
            setTimeout(() => sent.delete().catch(() => {}), 8000);
        }
        textLevels.set(key, tData);
    }

    // د) أمر قوانين السيرفر: !قوانين1
    if (message.content === "!قوانين1") {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply({ content: "❌ هذا الأمر مخصص للإداريين فقط", ephemeral: true });
        }
        const rulesEmbed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📜 قوانين السيرفر الرسمية")
            .setDescription("1. احترام الجميع.\n2. منع السبام والروابط.\n3. الالتزام بالرومات.");
        await message.delete().catch(() => {});
        await message.channel.send({ embeds: [rulesEmbed] });
        return;
    }

    // هـ) أمر التذاكر: !ticket
    if (message.content === "!ticket") {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply({ content: "❌ هذا الأمر مخصص للإداريين فقط", ephemeral: true });
        }
        const ticketEmbed = new EmbedBuilder().setColor("#5865F2").setTitle("🎫 التذاكر").setDescription("اضغط الزر لفتح تذكرة.");
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("create_ticket").setLabel("إنشاء تذكرة 🎫").setStyle(ButtonStyle.Primary)
        );
        await message.channel.send({ embeds: [ticketEmbed], components: [row] });
        return;
    }
});

// ==================== 3. نظام التذاكر (الأزرار) ==================== //
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "create_ticket") {
        const guild = interaction.guild;
        const member = interaction.member;

        const existingChannel = guild.channels.cache.find(c => c.name === `ticket-${member.user.username.toLowerCase()}`);
        if (existingChannel) {
            return interaction.reply({ content: "❌ لديك تذكرة مفتوحة بالفعل!", ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });
        try {
            const ticketChannel = await guild.channels.create({
                name: `ticket-${member.user.username}`,
                type: ChannelType.GuildText,
                parent: interaction.channel.parentId,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: member.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                    { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] },
                ],
            });

            const closeRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("close_ticket").setLabel("إغلاق التذكرة 🔒").setStyle(ButtonStyle.Danger)
            );

            await ticketChannel.send({ content: `مرحباً ${member}، تم فتح التذكرة.`, components: [closeRow] });
            await interaction.editReply({ content: `✅ تم إنشاء التذكرة: ${ticketChannel}` });
        } catch (err) {
            console.error(err);
            await interaction.editReply({ content: "❌ حدث خطأ أثناء إنشاء التذكرة." });
        }
    }

    if (interaction.customId === "close_ticket") {
        const channel = interaction.channel;
        await interaction.reply({ content: "🔒 جاري إغلاق التذكرة وحذف الغرفة..." });
        setTimeout(() => channel.delete().catch(() => {}), 3000);
    }
});

client.login(token);
