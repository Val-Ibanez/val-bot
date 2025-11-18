# Val Bot

A Node.js chatbot for Slack built with the Slack Bolt framework.

## Features

- Responds to messages and mentions
- Supports slash commands
- Easy to extend with custom functionality
- Socket Mode enabled for development

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Slack workspace where you can install apps

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Val-Ibanez/val-bot.git
cd val-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app (e.g., "Val Bot") and select your workspace
4. Enable Socket Mode:
   - Go to "Socket Mode" in the left sidebar
   - Toggle "Enable Socket Mode"
   - Generate an App-Level Token with `connections:write` scope
5. Add Bot Token Scopes:
   - Go to "OAuth & Permissions"
   - Add the following Bot Token Scopes:
     - `app_mentions:read`
     - `chat:write`
     - `commands`
   - Install the app to your workspace
6. Get your tokens:
   - Bot Token: Found in "OAuth & Permissions" (starts with `xoxb-`)
   - App Token: Found in "Basic Information" under "App-Level Tokens" (starts with `xapp-`)
   - Signing Secret: Found in "Basic Information" under "App Credentials"

### 4. Configure environment variables

Copy the example environment file and add your tokens:

```bash
cp .env.example .env
```

Edit `.env` and add your Slack credentials:

```
SLACK_BOT_TOKEN=xoxb-your-token-here
SLACK_APP_TOKEN=xapp-your-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
PORT=3000
```

### 5. Run the bot

```bash
npm start
```

You should see: `⚡️ Val Bot is running!`

## Usage

Once the bot is running and installed in your Slack workspace:

- **Say hello**: Type `hello` in any channel where the bot is present
- **Get help**: Type `help` to see available commands
- **Mention the bot**: `@ValBot` to get the bot's attention
- **Use slash commands**: `/ping` to check if the bot is responsive

## Project Structure

```
val-bot/
├── src/
│   └── bot.js          # Main bot logic
├── index.js            # Entry point
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## Extending the Bot

To add new commands or features, edit `src/bot.js`. Examples:

### Add a new message handler

```javascript
app.message('goodbye', async ({ say }) => {
  await say('Goodbye! 👋');
});
```

### Add a new slash command

```javascript
app.command('/echo', async ({ command, ack, respond }) => {
  await ack();
  await respond(`You said: ${command.text}`);
});
```

## Troubleshooting

- **Bot doesn't respond**: Make sure the bot is invited to the channel (`/invite @ValBot`)
- **Connection errors**: Verify your tokens in the `.env` file
- **Port already in use**: Change the `PORT` in your `.env` file

## License

ISC
