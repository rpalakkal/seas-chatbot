import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import 'dotenv/config';
import { PrismaClient } from '@prisma/client'
import { createSuiKeypair, getSuiBalance, suiTransfer } from './sui';
import { createUser } from './user';

const bot = new Telegraf(process.env.BOT_TOKEN)
const prisma = new PrismaClient();

bot.on(message('text'), async (ctx) => {

  const tgUsername = ctx.message.from.username;
  if (!tgUsername) {
    await ctx.reply('Please set a username in your Telegram account settings');
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      tgUsername
    }
  });

  console.log(user);

  if (!user) {
    const newUser = await createUser(tgUsername);
    await prisma.user.create({
      data: newUser
    });
  }

  const text = ctx.message.text;

  if (text.includes("/start")) {
    //todo: add start message
    return;
  }

  if (text.includes("balance")) {
    const balance = await getSuiBalance(user);
    await ctx.reply(`Your current SUI balance is: ${balance}`);
    return;
  }

  const matchedUsernames = text.match(/@(\w+)/g);
  const usernames = matchedUsernames ? matchedUsernames.map(u => u.slice(1)) : [];

  if (usernames.length === 0) {
    await ctx.reply('Please mention a user');
    return;
  }

  let toUser = await prisma.user.findUnique({
    where: {
      tgUsername: usernames[0]
    }
  });

  if (!toUser) {
    const newUser = await createUser(usernames[0]);
    await prisma.user.create({
      data: newUser
    });
    toUser = newUser;
  }

  const numberInText = text.match(/\d+(\.\d+)?/g);
  if (!numberInText) {
    await ctx.reply('Please specify an amount to transfer');
    return;
  }
  console.log(numberInText[0]);
  const amount = parseFloat(numberInText[0]);
  console.log(amount);
  await suiTransfer(user, toUser, amount);

  // Using context shortcut
  await ctx.reply(`Succesfully sent ${amount} SUI to @${toUser.tgUsername}`);
})
bot.launch()

// Enable graceful stop
process.once('SIGINT', async () => {
  await prisma.$disconnect()
  bot.stop('SIGINT');

})
process.once('SIGTERM', async () => {
  await prisma.$disconnect()
  bot.stop('SIGTERM')
})