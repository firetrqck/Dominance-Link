import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  TextChannel
} from 'discord.js';
import config from '../config.json' assert { type: 'json' };
import { bullet } from '../helper/constants.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.on('ready', async () => {
  console.log(`[DISCORD] Logged in as ${client.user!.tag}`);
  const rolesEmbed = new EmbedBuilder()
    .setColor(config.colors.discordGray)
    .setAuthor({ name: 'Roles Info', iconURL: config.guild.icon })
    .addFields(
      {
        name: '<a:economy:1006182871314219169> Economy Roles',
        value:
          `${bullet} <@&800074267944681512>\n${bullet} <@&488352639671599125>\n` +
          `${bullet} <@&488352623884500992>\n${bullet} <@&488352607807733791>\n` +
          `${bullet} <@&1028890537979297853>\n${bullet} <@&488352576568557568>\n` +
          `${bullet} <@&488352546579152907>\n${bullet} <@&488352526110818304>\n` +
          `${bullet} <@&488352505953255440>\n${bullet} <@&488352481634418710>\n` +
          `${bullet} <@&488352447819939861>\n${bullet} <@&488352345613271070>\n` +
          `${bullet} <@&477063574309830667>\n${bullet} <@&465226964677165056>\n` +
          `${bullet} <@&1028900715189514350>\n${bullet} <@&349212066164244480>\n` +
          `${bullet} <@&348946342707462144>\n${bullet} <@&348938634227089411>`,
        inline: true
      },
      {
        name: '<a:talking:1004962079154896967> Discord Activity Roles',
        value:
          `${bullet} <@&755123430256279633>\n${bullet} <@&932285657903161374>\n` +
          `${bullet} <@&919688791361466368>\n${bullet} <@&932284834791960628>\n` +
          `${bullet} <@&755122545488822534>\n${bullet} <@&755123236114792468>`,
        inline: true
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true
      },
      {
        name: '<:staff:1006186955941347419> Guild Member Roles',
        value:
          `${bullet} <@&1005725104430395452>\n${bullet} <@&1031566725432492133>\n` +
          `${bullet} <@&950083054326677514>\n${bullet} <@&1031926129822539786>`,
        inline: true
      }
    );

  const notificationsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('notifications')
      .setLabel('Notifications')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('a:anotif:999683838357807235'),
    new ButtonBuilder()
      .setCustomId('polls')
      .setLabel('Polls')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(':poll:1039179935966842940'),
    new ButtonBuilder()
      .setCustomId('qotd')
      .setLabel('QOTD')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('a:aquestion:999684566220558507'),
    new ButtonBuilder()
      .setCustomId('events')
      .setLabel('Events')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('a:confetti:999682055099134102'),
    new ButtonBuilder()
      .setCustomId('bot_updates')
      .setLabel('Bot Updates')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('a:discordbot:1002234067372220425')
  );

  const notificationsEmbed = new EmbedBuilder()
    .setColor(config.colors.discordGray)
    .setAuthor({
      name: 'Notification Roles',
      iconURL: 'https://cdn.discordapp.com/attachments/986281342457237624/1005133447712473108/notification-bell_1.png'
    })
    .setDescription('Use the buttons below to select notification pings');

  const gamemodesRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('bedwars')
      .setLabel('Bedwars')
      .setStyle(ButtonStyle.Success)
      .setEmoji(':bedwars:1006049483383115867'),
    new ButtonBuilder()
      .setCustomId('duels')
      .setLabel('Duels')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(':duels:1006051301534212147'),
    new ButtonBuilder()
      .setCustomId('skyblock')
      .setLabel('Skyblock')
      .setStyle(ButtonStyle.Success)
      .setEmoji(':skyblock:1006051295695745065'),
    new ButtonBuilder()
      .setCustomId('skywars')
      .setLabel('Skywars')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji(':skywars:1006052635062829066')
  );

  const gamemodesEmbed = new EmbedBuilder()
    .setColor(config.colors.discordGray)
    .setAuthor({
      name: 'Gamemode Roles',
      iconURL: 'https://cdn.discordapp.com/attachments/986281342457237624/1006054852381651034/DdNypQdN_400x400.png'
    })
    .setDescription('Use the buttons below to select what gamemodes you like to play\nThese roles can be mentioned!');

  const channel = client.channels.cache.get('1039170240623427584') as TextChannel;
  await channel.send({ embeds: [rolesEmbed] });
  await channel.send({
    components: [notificationsRow],
    embeds: [notificationsEmbed]
  });
  await channel.send({
    components: [gamemodesRow],
    embeds: [gamemodesEmbed]
  });
});

client.login(config.keys.discordBotToken);