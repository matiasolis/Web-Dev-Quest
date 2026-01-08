// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations (AOS - Animate On Scroll)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Navbar background on scroll
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
        nav.style.boxShadow = '0 4px 20px rgba(255, 0, 0, 0.5)';
    } else {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        nav.style.boxShadow = '0 4px 20px rgba(255, 0, 0, 0.3)';
    }
    
    lastScroll = currentScroll;
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            // Here you would normally send the data to a server
            alert('MESSAGE SENT! We\'ll get back to you soon.');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const graffitiBg = document.querySelector('.graffiti-bg');
    
    if (hero && heroContent && graffitiBg) {
        const rate = scrolled * 0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
        graffitiBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add active class to nav link based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const navHeight = nav.offsetHeight;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - navHeight - 50;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Gallery item click effect
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Add a pulse effect
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = '';
        }, 200);
    });
});

// Add random rotation to gallery items on load
galleryItems.forEach((item, index) => {
    const randomRotation = (Math.random() - 0.5) * 2; // -1 to 1 degrees
    item.style.transform = `rotate(${randomRotation}deg)`;
    item.style.transition = 'transform 0.3s ease';
    
    item.addEventListener('mouseenter', () => {
        item.style.transform = `rotate(0deg) scale(1.05)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = `rotate(${randomRotation}deg)`;
    });
});

// Typing effect for hero title (optional enhancement)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const titleLines = heroTitle.querySelectorAll('.title-line');
    
    titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.animation = `fadeInUp 0.8s ease forwards ${index * 0.3}s`;
    });
}

// Add CSS animation for fadeInUp
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Cursor trail effect (optional street-style enhancement)
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    // Create a subtle trail effect
    if (Math.random() > 0.7) { // Only create trail occasionally for performance
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.width = '4px';
        trail.style.height = '4px';
        trail.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9999';
        trail.style.transition = 'opacity 0.5s ease';
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 500);
        }, 100);
    }
});

// Console message (street style)
console.log('%c EL IMPOSTOR ', 'background: #ff0000; color: #000; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c STREET STYLE ', 'background: #00ff41; color: #000; font-size: 16px; font-weight: bold; padding: 5px;');
console.log('%c Keep it real. No cap. ', 'color: #fff; font-size: 12px;');

// ========== MULTIPLAYER IMPOSTOR GAME ==========
let socket = null;
let currentRoom = null;
let playerId = null;
let playerName = null;
let isAdmin = false;
let gameTimer = null;
let currentWord = '';
let isImpostor = false;

// DOM Elements
const roomSelection = document.getElementById('roomSelection');
const roomLobby = document.getElementById('roomLobby');
const gamePlayArea = document.getElementById('gamePlayArea');
const roundResult = document.getElementById('roundResult');

const createPlayerName = document.getElementById('createPlayerName');
const createRoomBtn = document.getElementById('createRoomBtn');
const joinPlayerName = document.getElementById('joinPlayerName');
const roomCodeInput = document.getElementById('roomCodeInput');
const joinRoomBtn = document.getElementById('joinRoomBtn');

const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const roomPasswordDisplay = document.getElementById('roomPasswordDisplay');
const playerCount = document.getElementById('playerCount');
const lobbyPlayersList = document.getElementById('lobbyPlayersList');
const startGameBtn = document.getElementById('startGameBtn');
const leaveRoomBtn = document.getElementById('leaveRoomBtn');
const lobbyStatus = document.getElementById('lobbyStatus');

const timerText = document.getElementById('timerText');
const timerProgress = document.getElementById('timerProgress');
const gameWord = document.getElementById('gameWord');
const gameInstruction = document.getElementById('gameInstruction');

const resultWord = document.getElementById('resultWord');
const impostorName = document.getElementById('impostorName');
const resultImpostor = document.getElementById('resultImpostor');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const backToLobbyBtn = document.getElementById('backToLobbyBtn');

// Initialize Socket.IO connection
function initSocket() {
    // Try to connect to local server, fallback to CDN if needed
    try {
        socket = io();
    } catch (e) {
        console.error('Socket.IO not available. Make sure the server is running.');
        alert('CONNECTION ERROR: Please start the server first!');
    }
    
    if (socket) {
        setupSocketListeners();
    }
}

// Setup Socket.IO event listeners
function setupSocketListeners() {
    socket.on('connect', () => {
        console.log('Connected to server');
        playerId = socket.id;
    });

    socket.on('roomCreated', (data) => {
        currentRoom = data.roomCode;
        isAdmin = true;
        showLobby(data);
    });

    socket.on('roomJoined', (data) => {
        currentRoom = data.roomCode;
        isAdmin = data.isAdmin;
        showLobby(data);
    });

    socket.on('roomError', (error) => {
        alert(error.message);
    });

    socket.on('playerJoined', (data) => {
        updateLobby(data);
    });

    socket.on('playerLeft', (data) => {
        updateLobby(data);
    });

    socket.on('gameStarted', (data) => {
        startRound(data);
    });

    socket.on('wordUpdate', (data) => {
        updateWord(data);
    });

    socket.on('roundEnded', (data) => {
        endRound(data);
    });

    socket.on('disconnect', () => {
        alert('DISCONNECTED FROM SERVER');
        resetToRoomSelection();
    });
}

// Create room
function createRoom() {
    const name = createPlayerName.value.trim().toUpperCase();
    if (!name) {
        alert('ENTER YOUR NAME!');
        return;
    }
    playerName = name;
    socket.emit('createRoom', { playerName: name });
}

// Join room
function joinRoom() {
    const name = joinPlayerName.value.trim().toUpperCase();
    const code = roomCodeInput.value.trim().toUpperCase();
    
    if (!name) {
        alert('ENTER YOUR NAME!');
        return;
    }
    if (!code || code.length !== 6) {
        alert('ENTER VALID 6-DIGIT ROOM CODE!');
        return;
    }
    
    playerName = name;
    socket.emit('joinRoom', { roomCode: code, playerName: name });
}

// Show lobby
function showLobby(data) {
    roomSelection.style.display = 'none';
    roomLobby.style.display = 'block';
    roundResult.style.display = 'none';
    gamePlayArea.style.display = 'none';
    
    roomCodeDisplay.textContent = data.roomCode;
    roomPasswordDisplay.textContent = data.password;
    updateLobby(data);
}

// Update lobby
function updateLobby(data) {
    playerCount.textContent = data.players.length;
    lobbyPlayersList.innerHTML = '';
    
    data.players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.className = 'lobby-player-item' + (player.isAdmin ? ' admin' : '');
        playerItem.innerHTML = `
            <div class="lobby-player-name">${player.name}</div>
        `;
        lobbyPlayersList.appendChild(playerItem);
    });
    
    // Update start button
    if (isAdmin) {
        if (data.players.length >= 4) {
            startGameBtn.disabled = false;
            lobbyStatus.className = 'lobby-status ready';
            lobbyStatus.querySelector('p').textContent = 'READY TO START!';
        } else {
            startGameBtn.disabled = true;
            lobbyStatus.className = 'lobby-status';
            lobbyStatus.querySelector('p').textContent = `WAITING FOR PLAYERS... (${4 - data.players.length} MORE NEEDED)`;
        }
    } else {
        startGameBtn.style.display = 'none';
        lobbyStatus.className = 'lobby-status';
        lobbyStatus.querySelector('p').textContent = 'WAITING FOR ADMIN TO START...';
    }
}

// Start game (admin only)
function startGame() {
    if (!isAdmin) return;
    socket.emit('startGame');
}

// Leave room
function leaveRoom() {
    socket.emit('leaveRoom');
    resetToRoomSelection();
}

// Reset to room selection
function resetToRoomSelection() {
    roomSelection.style.display = 'block';
    roomLobby.style.display = 'none';
    gamePlayArea.style.display = 'none';
    roundResult.style.display = 'none';
    currentRoom = null;
    isAdmin = false;
    playerName = null;
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

// Start round
function startRound(data) {
    roomLobby.style.display = 'none';
    gamePlayArea.style.display = 'block';
    roundResult.style.display = 'none';
    
    currentWord = data.word;
    isImpostor = data.isImpostor;
    
    // Display word
    if (isImpostor) {
        gameWord.textContent = 'IMPOSTOR';
        gameWord.classList.add('impostor');
        gameInstruction.textContent = 'YOU ARE THE IMPOSTOR! ACT NORMAL!';
    } else {
        gameWord.textContent = currentWord;
        gameWord.classList.remove('impostor');
        gameInstruction.textContent = 'REMEMBER THIS WORD!';
    }
    
    // Start timer
    startTimer(10);
}

// Start timer
function startTimer(seconds) {
    let timeLeft = seconds;
    const circumference = 2 * Math.PI * 45;
    const totalDash = circumference;
    
    timerText.textContent = timeLeft;
    
    if (gameTimer) clearInterval(gameTimer);
    
    gameTimer = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        
        const progress = (seconds - timeLeft) / seconds;
        const offset = totalDash * (1 - progress);
        timerProgress.style.strokeDashoffset = offset;
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            timerText.textContent = '0';
            timerProgress.style.strokeDashoffset = totalDash;
        }
    }, 1000);
}

// Update word (for synchronization)
function updateWord(data) {
    if (data.isImpostor) {
        gameWord.textContent = 'IMPOSTOR';
        gameWord.classList.add('impostor');
    } else {
        gameWord.textContent = data.word;
        gameWord.classList.remove('impostor');
    }
}

// End round
function endRound(data) {
    gamePlayArea.style.display = 'none';
    roundResult.style.display = 'block';
    
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    resultWord.textContent = data.word;
    
    if (data.impostor) {
        resultImpostor.style.display = 'block';
        impostorName.textContent = data.impostor;
    } else {
        resultImpostor.style.display = 'none';
    }
}

// Next round
function nextRound() {
    if (isAdmin) {
        socket.emit('nextRound');
    }
}

// Back to lobby
function backToLobby() {
    roundResult.style.display = 'none';
    roomLobby.style.display = 'block';
    socket.emit('backToLobby');
}

// Event listeners
if (createRoomBtn) {
    createRoomBtn.addEventListener('click', createRoom);
}

if (createPlayerName) {
    createPlayerName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createRoom();
    });
}

if (joinRoomBtn) {
    joinRoomBtn.addEventListener('click', joinRoom);
}

if (joinPlayerName) {
    joinPlayerName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinRoom();
    });
}

if (roomCodeInput) {
    roomCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinRoom();
    });
}

if (startGameBtn) {
    startGameBtn.addEventListener('click', startGame);
}

if (leaveRoomBtn) {
    leaveRoomBtn.addEventListener('click', leaveRoom);
}

if (nextRoundBtn) {
    nextRoundBtn.addEventListener('click', nextRound);
}

if (backToLobbyBtn) {
    backToLobbyBtn.addEventListener('click', backToLobby);
}

// Initialize socket when page loads
if (typeof io !== 'undefined') {
    initSocket();
} else {
    // Socket.IO will be loaded from server
    window.addEventListener('load', () => {
        setTimeout(initSocket, 1000);
    });
}
