const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, Events, EmbedBuilder } = require("discord.js");
const token = process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once(Events.ClientReady, () => {
    console.log(`Logged in as: ${client.user.tag}`);
});

// ================= بيانات الألعاب ================= //

const cutQuestions = [
    "تفضل العيش بدون انترنت لمدة اسبوع أم بدون هاتف نهائيا؟",
    "تفضل السفر الى الماضي لرؤية اجدادك أم المستقبل لرؤية العالم؟",
    "تفضل ان تكون قادرا على الطيران أو الاختفاء؟",
    "تفضل العيش في مدينة مطيرة طوال العام أم مشمسة وصحراوية؟",
    "تفضل قراءة الافكار أو التحكم بالوقت؟",
    "تفضل الاكل الحلو فقط طوال حياتك أم المالح فقط؟",
    "تفضل الخسارة في لعبة تحبها أم عدم اللعب نهائيا؟",
    "تفضل ان تملك سيارة احلامك أو منزلا ذكيا متكاملا؟",
    "تفضل العمل طوال الليل والنوم نهارا أم العكس؟",
    "تفضل التحدث بجميع لغات العالم أم التحدث مع الحيوانات؟",
    "تفضل السفر وحدك دائما أم مع مجموعة ضخمة؟",
    "تفضل العيش في عالم الالعاب أم في عالم الانمي؟",
    "تفضل نسيان كل ذكرياتك السيئة أم معرفة المستقبل؟",
    "تفضل ان تكون ذكيا جدا ولكن فقيرا أم غنيا جدا ولكن متوسط الذكاء؟",
    "تفضل الشتاء مع المطر أم الصيف مع البحر؟",
    "تفضل الاكل الحار جدا أم البارد جدا؟",
    "تفضل ان تفقد القدرة على التحدث لمدة يوم أم القدرة على سماع الاخرين؟",
    "تفضل الاستغناء عن الالعاب أم الاستغناء عن منصات التواصل؟",
    "تفضل العيش بدون تلفاز أم بدون الالعاب؟",
    "تفضل ان تكون مشهورا عالميا أم تعيش حياة هادئة ومجهولة؟",
    "تفضل النوم على ارضية صلبة أم على سرير مزعج؟",
    "تفضل شرب القهوة فقط طوال حياتك أم الشاي فقط؟",
    "تفضل ان تملك طاقة خارقة واحدة أو حظا اسطوريا طوال حياتك؟",
    "تفضل العيش في الغابة لوحدك أم في جزيرة منسية؟",
    "تفضل ان تقرأ كتابا ضخما أم تشاهد فيلما طويلا؟",
    "تفضل التخلص من خوفك الاكبر فورا أم تحقيق امنية واحدة؟",
    "تفضل السفر عبر الزمن الى الامام أم الى الوراء؟",
    "تفضل ان تكون بطلا خارقا شرسا أم شريرا طيب القلب؟",
    "تفضل ان تستيقظ مبكرا بنشاط أم تسهر طوال الليل براحة؟",
    "تفضل اكل وجبة واحدة تحبها طوال حياتك أم وجبات مختلفة لا تحبها؟",
    "تفضل تذكر كل كلمة تقال لك أم نسيان كل شيء فورا؟",
    "تفضل العيش في منزل عائم في البحر أم في منزل شجري في الغابة؟",
    "تفضل ان تكون كاتبا مشهورا أم مخرج الالعاب ناجحا؟",
    "تفضل التخلي عن هاتفك المحمول أم حاسوبك الشخصي؟",
    "تفضل دائما قول الحقيقة مهما كانت أم الكذب لحماية صديق؟",
    "تفضل ان تكون قادرا على اعادة اي لحظة في حياتك أم معرفة نهايتها؟",
    "تفضل اللعب مع اصدقائك دائما أم اللعب وحدك بهدوء؟",
    "تفضل الضحك طوال اليوم أم البكاء مرة واحدة لترتاح؟",
    "تفضل تناول الطعام البارد دائما أم الساخن لدرجة تحرق لسانك؟",
    "تفضل ان يعود بك الزمن 5 سنوات للوراء أم تتقدم 5 سنوات للمستقبل؟"
];

const flagsData = [
    { country: "العراق", image: "https://flagcdn.com/w320/iq.png" },
    { country: "السعودية", image: "https://flagcdn.com/w320/sa.png" },
    { country: "الكويت", image: "https://flagcdn.com/w320/kw.png" },
    { country: "الامارات", image: "https://flagcdn.com/w320/ae.png" },
    { country: "قطر", image: "https://flagcdn.com/w320/qa.png" },
    { country: "البحرين", image: "https://flagcdn.com/w320/bh.png" },
    { country: "عمان", image: "https://flagcdn.com/w320/om.png" },
    { country: "مصر", image: "https://flagcdn.com/w320/eg.png" },
    { country: "المغرب", image: "https://flagcdn.com/w320/ma.png" },
    { country: "الجزائر", image: "https://flagcdn.com/w320/dz.png" },
    { country: "تونس", image: "https://flagcdn.com/w320/tn.png" },
    { country: "اليابان", image: "https://flagcdn.com/w320/jp.png" },
    { country: "كوريا الجنوبية", image: "https://flagcdn.com/w320/kr.png" },
    { country: "الولايات المتحدة", image: "https://flagcdn.com/w320/us.png" },
    { country: "بريطانيا", image: "https://flagcdn.com/w320/gb.png" },
    { country: "فرنسا", image: "https://flagcdn.com/w320/fr.png" },
    { country: "المانيا", image: "https://flagcdn.com/w320/de.png" },
    { country: "اسبانيا", image: "https://flagcdn.com/w320/es.png" },
    { country: "ايطاليا", image: "https://flagcdn.com/w320/it.png" },
    { country: "تركيا", image: "https://flagcdn.com/w320/tr.png" },
    { country: "البرازيل", image: "https://flagcdn.com/w320/br.png" },
    { country: "الارجنتين", image: "https://flagcdn.com/w320/ar.png" },
    { country: "كندا", image: "https://flagcdn.com/w320/ca.png" },
    { country: "استراليا", image: "https://flagcdn.com/w320/au.png" },
    { country: "الصين", image: "https://flagcdn.com/w320/cn.png" },
    { country: "الهند", image: "https://flagcdn.com/w320/in.png" },
    { country: "روسيا", image: "https://flagcdn.com/w320/ru.png" },
    { country: "ايران", image: "https://flagcdn.com/w320/ir.png" },
    { country: "باكستان", image: "https://flagcdn.com/w320/pk.png" },
    { country: "اليونان", image: "https://flagcdn.com/w320/gr.png" },
    { country: "السويد", image: "https://flagcdn.com/w320/se.png" },
    { country: "النرويج", image: "https://flagcdn.com/w320/no.png" },
    { country: "سويسرا", image: "https://flagcdn.com/w320/ch.png" },
    { country: "هولندا", image: "https://flagcdn.com/w320/nl.png" },
    { country: "بلجيكا", image: "https://flagcdn.com/w320/be.png" },
    { country: "البرتغال", image: "https://flagcdn.com/w320/pt.png" },
    { country: "المكسيك", image: "https://flagcdn.com/w320/mx.png" },
    { country: "جنوب افريقيا", image: "https://flagcdn.com/w320/za.png" },
    { country: "فيتنام", image: "https://flagcdn.com/w320/vn.png" },
    { country: "اندونيسيا", image: "https://flagcdn.com/w320/id.png" },
    { country: "ماليزيا", image: "https://flagcdn.com/w320/my.png" },
    { country: "سنغافورة", image: "https://flagcdn.com/w320/sg.png" },
    { country: "نيوزيلندا", image: "https://flagcdn.com/w320/nz.png" },
    { country: "اوكرانيا", image: "https://flagcdn.com/w320/ua.png" },
    { country: "بولندا", image: "https://flagcdn.com/w320/pl.png" },
    { country: "الدنمارك", image: "https://flagcdn.com/w320/dk.png" },
    { country: "فنلندا", image: "https://flagcdn.com/w320/fi.png" },
    { country: "النمسا", image: "https://flagcdn.com/w320/at.png" },
    { country: "المجر", image: "https://flagcdn.com/w320/hu.png" },
    { country: "تشيلي", image: "https://flagcdn.com/w320/cl.png" }
];

const wordsList = [
    "برمجة", "حاسوب", "ديسكورد", "تطوير", "مهندس", 
    "ذكاء", "اصطناعي", "مشروع", "تحديث", "سرعة", 
    "تحدي", "معركة", "لاعب", "فوز", "بطولة", 
    "منزل", "طبيعة", "مستقبل", "جامعة", "ياباني", 
    "تكنولوجيا", "اتصال", "شبكات", "تطبيق", "نافذة", 
    "تصميم", "قاعدة", "بيانات", "خوارزمية", "سيرفر"
];

function scrambleWord(word) {
    let arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    let scrambled = arr.join("");
    if (scrambled === word) return scrambleWord(word);
    return scrambled;
}

// ================= نظام الأوامر والرسائل ================= //

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // 1. أمر قوانين السيرفر: !قوانين1 (خاص بالآدمنية فقط)
    if (message.content === "!قوانين1") {
        // التحقق مما إذا كان المستخدم يمتلك صلاحية إدارة الرسائل أو الإدارة
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply({ content: "❌ هذا الأمر مخصص للإداريين فقط!", ephemeral: true });
        }

        const rulesEmbed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📜 قوانين السيرفر الرسمية")
            .setDescription("يرجى الالتزام بالقوانين أدناه لتجنب العقوبات والاتحاد في بيئة منظمة:")
            .addFields(
                { name: "1️⃣ الاحترام المتبادل", value: "• يُمنع منعاً باتاً التلفظ بألفاظ نابية، أو السب، أو الإهانة بأي شكل من الأشكال تجاه أي عضو." },
                { name: "2️⃣ منع العنصرية والتمييز", value: "• يُمنع منعاً باتاً العنصرية أو التمييز ضد أي شخص بناءً على الديانة، المذهب، الجنسية، العرق، أو اللون." },
                { name: "3️⃣ منع الإزعاج والمضايقات", value: "• يُمنع التخريب في الرومات الصوتية وإرسال رسائل مزعجة أو متكررة." },
                { name: "4️⃣ حظر المحتوى غير اللائق", value: "• يُمنع نشر أو تداول أي صور أو مقاطع أو روابط تحتوي على محتوى جنسي أو دموي." },
                { name: "5️⃣ منع الإعلانات والروابط الخارجية", value: "• يُمنع نشر روابط سيرفرات أخرى أو الترويج دون إذن الإدارة." },
                { name: "6️⃣ الالتزام بالرومات المخصصة", value: "• يرجى وضع كل محتوى في مكانه الصحيح للحفاظ على تنظيم السيرفر." },
                { name: "7️⃣ الالتزام بتوجيهات الإدارة", value: "• قرارات الإدارة نهائية ويجب الالتزام بأوامر المشرفين." }
            )
            .setFooter({ text: "نظام حماية وإدارة السيرفر • شكراً لالتزامك" })
            .setTimestamp();

        await message.delete().catch(() => {});
        await message.channel.send({ embeds: [rulesEmbed] });
        return;
    }

    // 2. أمر التذاكر: !ticket (خاص بالآدمنية فقط)
    if (message.content === "!ticket") {
        // التحقق من صلاحيات الإدارة
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply({ content: "❌ هذا الأمر مخصص للإداريين فقط!", ephemeral: true });
        }

        const ticketEmbed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🎟️ نظام التذاكر والدعم الفني")
            .setDescription("يرجى قراءة القوانين جيداً قبل فتح تذكرة جديدة لتجنب المخالفة:")
            .addFields(
                { name: "📌 قوانين التكت", value: "• يمنع فتح تكت بدون سبب\n• الاحترام المتبادل مطلوب\n• يمنع سبام المنشن" }
            )
            .setFooter({ text: "نظام الحماية والدعم الفني • اضغط على الزر أدناه للفتح" });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("create_ticket")
                .setLabel("إنشاء تذكرة 🎫")
                .setStyle(ButtonStyle.Primary)
        );

        await message.channel.send({ embeds: [ticketEmbed], components: [row] });
        return;
    }

    // 3. لعبة كت: !كت (متاحة للجميع)
    if (message.content === "!كت") {
        const randomQ = cutQuestions[Math.floor(Math.random() * cutQuestions.length)];
        const cutEmbed = new EmbedBuilder()
            .setColor("#FF73FA")
            .setTitle("❓ لعبة كت (تخير بين أمرين)")
            .setDescription(`**${randomQ}**`)
            .setFooter({ text: `طلب بواسطة: ${message.author.username}` })
            .setTimestamp();

        await message.channel.send({ embeds: [cutEmbed] });
        return;
    }

    // 4. لعبة الأعلام: !علم (متاحة للجميع)
    if (message.content === "!علم") {
        const randomItem = flagsData[Math.floor(Math.random() * flagsData.length)];
        const flagEmbed = new EmbedBuilder()
            .setColor("#00AE86")
            .setTitle("🌍 تحدي تخمين الأعلام")
            .setDescription("ما هي الدولة التي يتبع لها هذا العلم الظاهر في الصورة؟")
            .setImage(randomItem.image)
            .setFooter({ text: "اكتب اسم الدولة في الشات بدون همزات للإجابة الصحيحة! (لديك 30 ثانية)" });

        await message.channel.send({ embeds: [flagEmbed] });

        const filter = (response) => response.content.trim() === randomItem.country && !response.author.bot;
        const collector = message.channel.createMessageCollector({ filter, time: 30000, max: 1 });

        collector.on("collect", (m) => {
            m.reply(`🎉 كفو **${m.author.username}**! الإجابة صحيحة، الدولة هي **${randomItem.country}**`);
        });

        collector.on("end", (collected) => {
            if (collected.size === 0) {
                message.channel.send(`⏰ انتهى الوقت! الإجابة الصحيحة هي: **${randomItem.country}**`);
            }
        });
        return;
    }

    // 5. لعبة تفكيك الكلمات: !تفكك (متاحة للجميع)
    if (message.content === "!تفكك") {
        const originalWord = wordsList[Math.floor(Math.random() * wordsList.length)];
        const scrambled = scrambleWord(originalWord);

        const unscrambleEmbed = new EmbedBuilder()
            .setColor("#FFA500")
            .setTitle("🧩 لعبة تفكيك وترتيب الكلمات")
            .setDescription(`رتب الحروف التالية لتكون كلمة صحيحة:\n\n# **\` ${scrambled.split("").join(" ")} \`**`)
            .setFooter({ text: "اكتب الكلمة الصحيحة في الشات بأسرع ما يمكن! (لديك 30 ثانية)" });

        await message.channel.send({ embeds: [unscrambleEmbed] });

        const filter = (response) => response.content.trim() === originalWord && !response.author.bot;
        const collector = message.channel.createMessageCollector({ filter, time: 30000, max: 1 });

        collector.on("collect", (m) => {
            m.reply(`🏆 مبروك **${m.author.username}**! لقد قمت بترتيب الكلمة بشكل صحيح: **${originalWord}**`);
        });

        collector.on("end", (collected) => {
            if (collected.size === 0) {
                message.channel.send(`⏰ انتهى الوقت! الكلمة الصحيحة كانت: **${originalWord}**`);
            }
        });
        return;
    }

    // 6. لعبة سرعة الكتابة: !اسرع (متاحة للجميع)
    if (message.content === "!اسرع") {
        const targetWord = wordsList[Math.floor(Math.random() * wordsList.length)];

        const speedEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("⚡ تحدي سرعة الكتابة")
            .setDescription(`اسرع شخص يكتب الكلمة التالية يفوز:\n\n# **\` ${targetWord} \`**`)
            .setFooter({ text: "اكتبها في الشات الان فورا!" });

        await message.channel.send({ embeds: [speedEmbed] });

        const filter = (response) => response.content.trim() === targetWord && !response.author.bot;
        const collector = message.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on("collect", (m) => {
            m.reply(`🚀 البطل **${m.author.username}** كان الاسرع وفاز بالتحدي!`);
        });

        collector.on("end", (collected) => {
            if (collected.size === 0) {
                message.channel.send(`⏰ انتهى الوقت ولم يكتب احد الكلمة (` + targetWord + `)!`);
            }
        });
        return;
    }
});

// ================= نظام التذاكر (الأزرار) ================= //

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "create_ticket") {
        const guild = interaction.guild;
        const member = interaction.member;

        const existingChannel = guild.channels.cache.find(
            (c) => c.name === `ticket-${member.user.username.toLowerCase()}`
        );
        if (existingChannel) {
            return interaction.reply({
                content: "لديك تذكرة مفتوحة بالفعل!",
                ephemeral: true,
            });
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

            await ticketChannel.send({
                content: `مرحباً ${member},\nتم فتح تذكرتك بنجاح. سيقوم احد الإداريين بالرد عليك قريباً.\nلإغلاق التذكرة اضغط على الزر أدناه.`,
                components: [closeRow],
            });

            await interaction.editReply({ content: `تم إنشاء تذكرتك بنجاح! توجه إلى هنا: ${ticketChannel}` });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: "حدث خطأ أثناء إنشاء التذكرة، تأكد من صلاحيات البوت." });
        }
    }

    if (interaction.customId === "close_ticket") {
        const channel = interaction.channel;
        await interaction.reply("جاري إغلاق التذكرة وحذف الغرفة...");
        setTimeout(async () => {
            await channel.delete().catch(() => {});
        }, 3000);
    }
});

client.login(token);
