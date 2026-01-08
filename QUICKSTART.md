# Quick Start Guide

## Step 1: Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

This will install:
- Express (web server)
- Socket.IO (real-time communication)

## Step 2: Start the Server

Run:

```bash
npm start
```

You should see:
```
Server running on http://localhost:3000
```

## Step 3: Open the Game

Open your web browser and go to:
```
http://localhost:3000
```

## Step 4: Play!

1. **To Create a Room:**
   - Enter your name
   - Click "CREATE"
   - You'll get a 6-digit room code and 4-digit password
   - Share these with your friends

2. **To Join a Room:**
   - Enter your name
   - Enter the 6-digit room code
   - Click "JOIN"

3. **To Start:**
   - Wait for at least 4 players
   - Room admin clicks "START GAME"
   - Everyone sees their word for 10 seconds
   - Round ends automatically

## Troubleshooting

**Port already in use?**
- Change the port in `server.js` or use: `PORT=3001 npm start`

**Can't connect?**
- Make sure the server is running
- Check that you're using `http://localhost:3000` (not file://)

**Players can't join?**
- Make sure all players are on the same network (or use your public IP)
- Check firewall settings

## Development Mode

For auto-reload during development:

```bash
npm run dev
```

---

**Have fun! Keep it real. No cap.**
