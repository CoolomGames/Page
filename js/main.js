// Variables globals pel reproductor de YouTube
let player;
let currentIndex = 0;
const trailerTitleEl = document.getElementById('trailerTitle');

// Inicialització del reproductor de YouTube
function onYouTubeIframeAPIReady() {
    trailerTitleEl.textContent = trailers[currentIndex].title;
    
    player = new YT.Player('trailerIframe', {
        height: '100%',
        width: '100%',
        videoId: trailers[currentIndex].id,
        playerVars: { 
            'autoplay': 1,
            'mute': 1,
            'controls': 1,
            'rel': 0,
            'showinfo': 0,
            'loop': 1,
            'playlist': trailers[currentIndex].id,
            'modestbranding': 1,
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

// Funcions del reproductor
function onPlayerReady(event) {
    event.target.playVideo();
    event.target.setPlaybackQuality('hd720');
}

function onPlayerError(event) {
    console.error('Error del reproductor:', event.data);
    currentIndex = (currentIndex + 1) % trailers.length;
    player.loadVideoById(trailers[currentIndex].id);
    trailerTitleEl.textContent = trailers[currentIndex].title;
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        currentIndex = (currentIndex + 1) % trailers.length;
        player.loadVideoById({
            videoId: trailers[currentIndex].id,
            startSeconds: 0,
            suggestedQuality: 'hd720'
        });
        trailerTitleEl.textContent = trailers[currentIndex].title;
    }
}

// Funció per reproduir un tràiler específic
function playGame(trailerId) {
    const game = games.find(g => g.trailerId === trailerId);
    if (game) {
        player.loadVideoById(trailerId);
        trailerTitleEl.textContent = game.title;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Generació de la galeria de jocs
const gamesGallery = document.getElementById('gamesGallery');
games.forEach((game, i) => {
    const gameDiv = document.createElement('div');
    gameDiv.classList.add('game-item');
    
    gameDiv.innerHTML = `
        <a href="${game.link}" target="_blank" rel="noopener noreferrer">
            <img src="${game.img}" alt="${game.title}" loading="${i === 0 ? 'eager' : 'lazy'}"/>
        </a>
        <div class="game-title" onclick="playGame('${game.trailerId}')">${game.title}</div>
    `;
    
    gamesGallery.appendChild(gameDiv);
});

// Generació de la secció de l'equip
const teamWrapper = document.getElementById('teamWrapper');
teamMembers.forEach((member, i) => {
    const memberDiv = document.createElement('div');
    memberDiv.classList.add('team-member');
    memberDiv.innerHTML = `
        <a href="${member.link}" target="_blank" rel="noopener noreferrer">
            <img src="${member.img}" alt="${member.name}" class="team-photo" loading="lazy"/>
            <div class="team-info">
                <h3>${member.name}</h3>
                <p>${member.description}</p>
            </div>
        </a>
    `;
    teamWrapper.appendChild(memberDiv);
});

// Control del menú burger
const burgerMenu = document.querySelector('.burger-menu');
const navLinks = document.querySelector('.nav-links');

burgerMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
});

// Tancament del menú quan es fa clic a fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav') && !e.target.closest('.burger-menu')) {
        navLinks.classList.remove('active');
    }
});

// Navegació suau pels enllaços
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.classList.remove('active');
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerOffset = 90;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Gestió del formulari de contacte
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        contactForm.reset();
        alert('Missatge Enviat!');
    });
}