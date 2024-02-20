const { Client, GatewayIntentBits, Partials } = require('discord.js')
const dotenv = require('dotenv')
dotenv.config();
const DB = require('./helpers/connect-db.js')
const addUser = require('./models/userJoin.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on("ready", () => {
  console.log("Chat bot is running");
});

// detect user join chanel
client.on("guildMemberAdd", async (member) => {

  const timeStamp = member.joinedTimestamp
  const timeJoin = new Date(timeStamp).toISOString()
    await DB.query(addUser(member.user.id, member.user.username, member.user.discriminator, timeJoin))
});

// Log in to the Discord client using your bot token
client.login(
  process.env.DISCORD_TOKEN
);
