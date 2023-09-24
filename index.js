ll.registerPlugin('ChatToDiscord', 'Game chat plugin for LLBDS', [1, 0, 0], {
    Author: 'Alpha',
});

const configFile = new JsonConfigFile('./plugins/ChatToDiscord/config.json');
if(!configFile.get('config')){
    logger.info('Конфиг не был найден, создаю!');
    configFile.init('config', {
        lang: 'en',
        token: '',
        channelID: '',
        supportGlobalChat: true,
        filterBanWords: true
    });

    logger.info('Конфиг создан и лежит в ./plugins/ChatToDiscord/config.json, настрой его!');
}

const config = configFile.get('config');
const event = require('./events/messageCreate.js');
const lang = require(`./lang/${config.lang}.json`)

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.MessageContent,GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildIntegrations]});
client.login(config.token);
client.config = config;


const localize = (key, placeholders = {}) => {
    if (lang[key]) {
        let localizedString = lang[key];
        for (const placeholder in placeholders) {
            localizedString = localizedString.replace(`$${placeholder}`, placeholders[placeholder]);
        }
        return localizedString;
    } else {
        return key;
    }
}

/**
 * Event listener for the message creation event.
 * @event client
 * @type {function}
 * @param {...*} args - The arguments for the event.
*/
client.on(event.name, (...args) => event.execute(...args, client));

const channelID = config.channelID;
const supportGlobalChat = config.supportGlobalChat;
const filterBanWords = config.filterBanWords;

/**
 * Listen to the 'onChat' event.
 * @event onChat
 * @type {function}
 * @param {object} pl - The player object.
 * @param {string} msg - The chat message.
*/
mc.listen('onChat', ( pl, msg ) => {
    const channel = client.channels.cache.get(channelID);
    if(supportGlobalChat && -1 !== msg.indexOf('!')){
        const embed = new EmbedBuilder();
        if (pl.pos.dimid == 0) {
            embed.setColor('#0ee824');
        } else if (pl.pos.dimid == 2) {
            embed.setColor('#e820fa');
        } else if (pl.pos.dimid == 1) {
            embed.setColor('#fc0303');
        }
        /**
         * Construct and send an embed message.
         * @param {string} pl.realName - The real name of the player.
         * @param {string} msg - The filtered chat message.
        */
        embed.setDescription(`**${ pl.realName } > ${ createMessage(msg.replace('!', ''), filterBanWords) }**`);
        channel.send({ embeds: [embed] });
    } else {
        const embed = new EmbedBuilder();
        if (pl.pos.dimid == 0) {
            embed.setColor('#0ee824');
        } else if (pl.pos.dimid == 2) {
            embed.setColor('#e820fa');
        } else if (pl.pos.dimid == 1) {
            embed.setColor('#fc0303');
        }
        /**
         * Construct and send an embed message.
         * @param {string} pl.realName - The real name of the player.
         * @param {string} msg - The filtered chat message.
        */
        embed.setDescription(`**${ pl.realName } > ${ createMessage(msg, filterBanWords) }**`);
        channel.send({ embeds: [embed] });
    }
})


/**
 * Listen to the 'onJoin' event.
 * @event onJoin
 * @type {function}
 * @param {object} pl - The player object.
*/
mc.listen('onJoin', ( pl ) => {
    const channel = client.channels.cache.get(channelID);
    const embed = new EmbedBuilder();

    embed.setColor('#00bbff');

    /**
     * Construct and send an embed message for player join event.
     * @param {string} pl.realName - The real name of the player.
    */
    const message = localize('playerJoined', { name: pl.realName });
    embed.setDescription(`**${ message }**`);
    channel.send({ embeds: [embed] });
})

/**
 * Listen to the 'onLeft' event.
 * @event onLeft
 * @type {function}
 * @param {object} pl - The player object.
*/
mc.listen('onLeft', ( pl ) => {
    const channel = client.channels.cache.get(channelID);
    const embed = new EmbedBuilder();

    embed.setColor('#ffb300');

    /**
     * Construct and send an embed message for player leave event.
     * @param {string} pl.realName - The real name of the player.
    */

    const message = localize('playerLeft', { name: pl.realName });
    embed.setDescription(`**${ message }**`);
    channel.send({ embeds: [embed] });
})

/**
 * Listen to the 'onPlayerDie' event.
 * @event onPlayerDie
 * @type {function}
 * @param {object} pl - The player object.
 * @param {object|null} en - The entity that caused the player's death (optional).
*/
mc.listen('onPlayerDie', (pl, en) => {
    const channel = client.channels.cache.get(channelID);
    const embed = new EmbedBuilder();

    if (pl.pos.dimid == 0) {
        embed.setColor('#0ee824');
    } else if (pl.pos.dimid == 2) {
        embed.setColor('#e820fa');
    } else if (pl.pos.dimid == 1) {
        embed.setColor('#fc0303');
    }

    /**
     * Construct and send an embed message for player death event.
     * @param {string} pl.realName - The real name of the player.
     * @param {object} en - The entity that caused the player's death (optional).
     * @param {string} en.name - The name of the entity.
     */
    if (en) {
        const message = localize('playerDieFrom', { name: pl.realName, entity: en.name });
        embed.setDescription(`**${ message }**`);
        channel.send({ embeds: [embed] });
    } else {
        const message = localize('playerDie', { name: pl.realName });
        embed.setDescription(`**${ message }**`);
        channel.send({ embeds: [embed] });
    }
})

/**
 * Listen to the 'onBedEnter' event.
 * @event onBedEnter
 * @type {function}
 * @param {object} pl - The player object.
*/
mc.listen('onBedEnter', (pl) => {
    const channel = client.channels.cache.get(channelID);
    const embed = new EmbedBuilder();

    if (pl.pos.dimid === 0) {
        embed.setColor('#0ee824');
    } else if (pl.pos.dimid === 2) {
        embed.setColor('#e820fa');
    } else if (pl.pos.dimid === 1) {
        embed.setColor('#fc0303');
    }

    const message = localize('bedEnter', { name: pl.realName });
    embed.setDescription(`**${ message }**`);

    channel.send({ embeds: [embed] });
});

/**
 * Listen to the 'onServerStarted' event.
 * @event onServerStarted
 * @type {function}
*/
mc.listen('onServerStarted', () => {
    setTimeout(() => {
        const channel = client.channels.cache.get(channelID);
        const embed = new EmbedBuilder();
    
        embed.setColor('#9d00ff');
    
        const message = localize('serverStarted', { name: pl.realName });
        embed.setDescription(`**${ message }**`);
        channel.send({ embeds: [ embed ] });
    }, 10000);
})

/**
 * Exported function to send messages to a Discord channel.
 * @function send
 * @param {string|Snowflake} id - The ID of the channel or the channel object.
 * @param {string} color - The color of the embed.
 * @param {string} descr - The description for the embed.
 * @param {string} content - The content of the message.
*/
const send = (id, color, descr, content) => {
  const channel = client.channels.cache.get(id) || channelID;

  const embed = new EmbedBuilder();
  embed.setColor(color);
  embed.setDescription(descr);

  channel.send({
    content: content,
    embeds: [ embed ],
  });
}

// Export the send function for external use.
ll.export(send, 'discord', 'send');

/**
 * Filter out banned words from a message.
 *
 * @function createMessage
 * @param {string} msg - The original message.
 * @param {boolean} clearBW - Boolean indicating whether to filter.
 * @returns {string} The filtered message, or the original message if `clearBW` is `false`.
*/
const createMessage = (msg, clearBW) => {
    if (clearBW === false) {
        return msg; // Return the original message without filtering.
    }

    const banWords = [
        'пидар',
        'пидр',
        'пидарас',
        'пидор',
        'pidar',
        'pidor',
        'п$дар',
        'пидораска',
        'пидорасы',
        'пидорастизм',
        'пидорасия',
        'пидораси',
        'пидорасы',
        'пидорасов',
        'pidaru',
        'пидари',
        'ПИДАРЫ',
        'ПИДОРАСЫ',
        'ПиДаР',
        'пидарь',
        'пидорасыы',
        'пид0р',
        'ПиДоР',
        'пИдОр',
        'Пидор',
        'PIdor',
        'PIDOР',
        'П_идарас',
        'п-и-д-о-р',
        'п-и-д-а-р-ы',
        'п~и~д~а~р',
        'pidors',
        'p$дари',
        'п$%ар',
        'пидар-пидар',
        'пидарасэ',
        'пидорасе',
        'пидорасу',
        'пэдорас',
        'пидоор',
        'пидооор',
        'пидаар',
        'пидааар',
        'пидарасуу',
        'пидорасі',
        'пидорас',
        'пидары-пидоры',
        'пидор-пидар',
        'пидоры-пидары',
        'п!идар',
        'п!и!д!а!р',
        'пидарс',
        'пидорс',
        'пиидар',
        'пииидар',
        'пиииидар',
        'пиииидар',
        'пиииидор',
        'пииидор',
        'пиидор',
        'п_и_д_о_р',
        'п_и_д_а_р',
        'п-и-д-а-р',
        'п-и-д-о-р',
        'пидорские',
        'ПИДОР.',
        'ПИДАР.',
        'ПИДОРАСИ',
        'пuдор',
        'пидоp',
        'пидoр',
        'пидaр',
        'пидop',
        'пидap',
        'пидоr',
        'пидаr',
        'пидar',
        'пидor',
        'faggot',
        'фаггот',
        'фагготс',
        'faggots',
        'fAgOtt',
        'f4ggot',
        'гомик',
        'гомо',
        'гомосеки',
        'гомомики',
        'гомосука',
        'гомомикє',
        'гомомо',
        'п%дар',
        'п$д%р',
        'пидорасня',
        'пидорасне',
        'негр',
        'негры',
        'негрс',
        'нэгрс',
        'негро',
        'негра',
        'неегр',
        'нєгр',
        'нигер',
        'нигёр',
        'нигерсы',
        'нигеры',
        'нигёры',
        'нигорасы',
        'nigger',
        'naga',
        'нига',
        'нага',
        'нигерс',
        'снигерс',
        'снайгерс',
        'niggers',
        'nigg$r',
        'нигор',
        'нигєрс',
        'n$ggers',
        'n$ger',
        'n$gers',
        'nігер',
        'найгер',
        'найгерс',
        'нигєрс',
        'нигэрс',
        'нигэр',
        'нигеры',
        'нигёры',
        'найгэрс',
        'хохол',
        'хач',
        'жид',
        'жидовники',
        'жидыы',
        'жиди',
        'жидов',
        'жида',
        'еврей',
        'евреи',
        'жидов',
        'жиды',
        'хохлы',
        'xoxoл',
        'хохлинка',
        'хохлинки',
        'жиды',
        'даун',
        'дауны',
        'даунерия',
        'ДАУНЫ',
        'даунские',
        'ДА_УН',
        'Д_А_У_Н',
        'Д!А!У!Н',
        'дayн',
        'дayH',
        'дayn',
        'Д!А!У!Н!С!К!И!Е',
        'д_а_у_н',
        'д_А_у_н',
        'д_аун',
        'Д_а_У_н',
        'Д!А!У!Н',
        'Д!А!У!Н!Ы',
        'аутист',
        'аутисты',
        'дебил',
        'дебилы',
        'дэбик',
        'дебилиус',
        'дебикус',
        'дебила',
        'дебилусы',
        'дэбик',
        'дэбил',
        'дэбилиус',
        'retard',
        'virgin',
        'simp',
        'incel',
        'девственник',
        'девственницы',
        'девственники',
        'девственница',
        'симп',
        'инцел',
        'cunt',
        'пизда',
        'куколд',
        'куколды',
        'белый',
        'белые',
        'натурал',
        'натуралы',
        'гетеросексуал',
        'гетеросексуалы'
    ];

    const banRegex = new RegExp('(?<![a-zA-Zа-яА-Я])(' + banWords.join('|') + ')(?![a-zA-Zа-яА-Я])', 'g'); //Filter regex.
    msg = msg.replace(banRegex, 'ОПАСНО'); //Return filtered message.

    return msg;
}
// Export the createMessage function for external use.
ll.export(createMessage, 'discord', 'createMessage');