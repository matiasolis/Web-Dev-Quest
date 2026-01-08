# EL IMPOSTOR - Street Style Multiplayer Game

A bold, urban-inspired multiplayer game website with a street culture aesthetic featuring graffiti-style design elements, bold typography, and real-time multiplayer functionality.

## Features

- **Street-Style Design**: Bold colors (black, red, neon green), graffiti-inspired typography, and urban textures
- **Multiplayer Rooms**: Create or join rooms with password protection
- **Real-Time Gameplay**: Synchronized word display with 10-second rounds
- **Admin Controls**: Room creator can start games when minimum 4 players are ready
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Scroll-triggered animations, parallax effects, and interactive hover states

## Game Rules

1. **Create or Join a Room**: Enter your name and either create a new room or join with a 6-digit room code
2. **Room Password**: The room creator receives a 4-digit password (displayed on screen)
3. **Minimum Players**: At least 4 players are required to start a game
4. **Gameplay**: 
   - All players receive the same word, except one player gets "IMPOSTOR"
   - Each round lasts 10 seconds
   - Players must remember their word (or act normal if impostor)
   - After 10 seconds, the round ends and results are shown

## Files Structure

```
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Client-side multiplayer functionality
├── server.js       # Node.js server with Socket.IO
├── package.json    # Node.js dependencies
└── README.md       # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

The server will run on port 3000 by default. You can change this by setting the `PORT` environment variable.

## How to Play

1. **Create a Room**:
   - Enter your name
   - Click "CREATE"
   - Share the 6-digit room code and 4-digit password with friends

2. **Join a Room**:
   - Enter your name
   - Enter the 6-digit room code
   - Click "JOIN"

3. **Start the Game**:
   - Wait for at least 4 players to join
   - Room admin clicks "START GAME"
   - All players see their word (or "IMPOSTOR") for 10 seconds
   - Round ends automatically after 10 seconds
   - Admin can start next round or return to lobby

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-black: #000000;
    --accent-red: #ff0000;
    --accent-neon: #00ff41;
    /* ... */
}
```

### Game Words
Edit the word list in `server.js`:
```javascript
const words = [
    'PIZZA', 'BANANA', 'COMPUTER', // Add your own words
    // ...
];
```

### Server Port
Change the port in `server.js` or set environment variable:
```bash
PORT=8080 npm start
```

### Fonts
The site uses Google Fonts:
- **Bebas Neue** - For headings and logo
- **Oswald** - For navigation and accents
- **Roboto Condensed** - For body text

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

Free to use and modify for your projects.

---

**Keep it real. No cap.**
