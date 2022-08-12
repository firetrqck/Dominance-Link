const { WebhookClient } = require('discord.js');
const db = require('better-sqlite3')('matrix.db');
const {
  nameToUUID,
} = require('../../helper/utils');
const messageToImage = require('../../helper/messageToImage');
const config = require('../../config.json');

const logWebhook = new WebhookClient({ url: config.keys.logWebhookUrl });
const gcWebhook = new WebhookClient({ url: config.keys.gcWebhookUrl });
global.messageCache = [];
global.guildOnline = [];

module.exports = {
  async execute(client, message, messagePosition) {
    if (messagePosition !== 'chat') return;
    let msg = message.toString();
    if (msg.trim() === '') return;
    // Limbo Check
    if (msg.indexOf('"server"') !== -1) {
      const parsedMessage = JSON.parse(msg);
      if (parsedMessage.server !== 'limbo') {
        await bot.chat('\u00a7');
      } else {
        return;
      }
    }
    const rawMsg = message.toMotd();
    await logWebhook.send({ content: msg, username: 'Matrix Link', avatarURL: config.guild.icon });
    if (messageCache.length >= 20) messageCache.shift();
    messageCache.push(msg);

    // Guild Chat
    if (msg.indexOf('Offline Members:') !== -1) {
      let includes = 0;
      for (let i = messageCache.length - 1; i >= 0; i -= 1) {
        if (messageCache[i].includes('Guild Name:') || messageCache[i].includes('Total Members:') || messageCache[i].includes('Online Members:') || messageCache[i].includes('Offline Members:')
        ) includes += 1;
        if (includes === 4) {
          guildOnline = messageCache.splice(i);
          break;
        }
      }
    } else if (msg.indexOf('Online Members:') !== -1) {
      [, onlineMembers] = msg.split('Online Members: ');
    } else if (msg.indexOf('cannot say the same message') !== -1) {
      await gcWebhook.send({
        username: 'Matrix',
        avatarURL: config.guild.icon,
        files: [messageToImage(
          '§6-------------------------------------------------------------§r §cYou cannot say the same message twice!§6-------------------------------------------------------------',
        )],
      });
    } else if (msg.indexOf('left the guild!') !== -1 || msg.indexOf('was promoted') !== -1 || msg.indexOf('was kicked') !== -1) {
      await gcWebhook.send({
        username: 'Matrix',
        avatarURL: config.guild.icon,
        files: [messageToImage(
          `§b-------------------------------------------------------------§r ${rawMsg} §b-------------------------------------------------------------`,
        )],
      });
    } else if (msg.indexOf('joined the guild!') !== -1) {
      const name = msg.substring(msg.search(/ (.*?) joined/g) + 1, msg.lastIndexOf(' joined'));
      await bot.chat(`/gc Welcome to Matrix, ${name}! Join our discord using /g discord to learn more about our roles and rules. Our current GEXP requirement is 150k per week.`);
      await gcWebhook.send({
        username: 'Matrix',
        avatarURL: config.guild.icon,
        files: [messageToImage(
          `§b-------------------------------------------------------------§r ${rawMsg} §b-------------------------------------------------------------`,
        )],
      });
    } else if (msg.indexOf('Guild >') !== -1) {
      await gcWebhook.send({
        username: 'Matrix',
        avatarURL: config.guild.icon,
        files: [messageToImage(rawMsg)],
      });
      let [, name] = msg.replace(/Guild > |:/g, '').split(' ');
      let uuid = await nameToUUID(name);
      if (uuid == null) {
        [name] = msg.replace(/Guild > |:/g, '').split(' ');
        uuid = await nameToUUID(name);
      }
      db.prepare('INSERT OR IGNORE INTO guildMembers (uuid, messages) VALUES (?, ?)').run(uuid, 0);
      db.prepare('UPDATE guildMembers SET messages = messages + 1 WHERE uuid = (?)').run(uuid);

      // Dad joke
      msg = msg.split(' ');
      for (let i = 0; i < msg.length; i += 1) {
        if ((msg[i].toLowerCase() === 'im' || msg[i].toLowerCase() === "i'm") && name !== 'MatrixLink') {
          // eslint-disable-next-line no-await-in-loop
          await bot.chat(`/gc Hi ${msg[i + 1]}, im dad`);
        }
      }
    }
  },
};
