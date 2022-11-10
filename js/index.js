const API_URL = 'http://localhost:3024/';

let dataMusic = [];

let playlist = [];

const favoriteList = localStorage.getItem('favorite') ? JSON.parse(localStorage.getItem('favorite')) : []

const audio = new Audio();

const catalogContainer = document.querySelector('.catalog__container');
const headerLogo = document.querySelector('.header__logo');
const favoriteBtn = document.querySelector('.header__favorite_btn');

const player = document.querySelector('.player');
const trackCard = document.getElementsByClassName('track');
const pauseBtnt = document.querySelector('.player__controller-pause');
const stopBtnt = document.querySelector('.player__controller-stop');
const prevBtn = document.querySelector('.player__controller-prev');
const nextBtn = document.querySelector('.player__controller-next');
const likeBtn = document.querySelector('.player__controller-like');
const muteBtn = document.querySelector('.player__icon_mute');
const playerProgressInput = document.querySelector('.player__progress-input');
const activeTrackTitle = document.querySelector('.track-info_title');
const activeTrackArtist = document.querySelector('.track-info_artist');

const playerTimePassed = document.querySelector('.player__time-passed');
const playerTimeTotal = document.querySelector('.player__time-total');
const playerVolumeInput = document.querySelector('.player__volume-input');

const search = document.querySelector('.search');
const message = document.querySelector('.tracksList-hidden');
const messageArr = [];

const catalogAddBtn = document.createElement('button');
catalogAddBtn.classList.add('catalog__btn-add');
catalogAddBtn.innerHTML = `
    <span>Увидеть все</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
    </svg>
`;


const pausePlayer = () => {
    const trackActive = document.querySelector('.track_active');

    if (audio.paused) {
        audio.play();
        pauseBtnt.classList.remove('player__icon_play');
        // pauseBtnt.classList.add('player__icon_pause');
        trackActive.classList.remove('track_pause');
        // trackActive.classList.add('track_active');
    } else {
        audio.pause();
        // pauseBtnt.classList.remove('player__icon_pause');
        pauseBtnt.classList.add('player__icon_play');
        // trackActive.classList.remove('track_active');
        trackActive.classList.add('track_pause');
    }
}

 
const playMusic = event => {
    const trackActive = event.currentTarget;
    
    if (trackActive.classList.contains('track_active')) {
        pausePlayer();
        return
    }

    for(let i = 0; i < trackCard.length; i++) {
        trackCard[i].classList.remove('track_active-activeColor');
    };
    trackActive.classList.add('track_active-activeColor');

    let i = 0;

    const id = trackActive.dataset.idTrack;
    const index = favoriteList.indexOf(id);
    if (index !== -1) {
        likeBtn.classList.add('player__icon_like_active')
      } else {
        likeBtn.classList.remove('player__icon_like_active')
      }

    const track = playlist.find((item, index) => {
        i = index 
        return id === item.id
});

    audio.src = `${API_URL}${track.mp3}`;

    activeTrackTitle.innerHTML = track.track;
    activeTrackArtist.innerHTML = track.artist;

    audio.play();
    pauseBtnt.classList.remove('player__icon_play');
    pauseBtnt.classList.add('player__icon_pause');
    player.classList.add('player_active');
    player.dataset.idTrack = id;

    const prevTrack = i === 0 ? playlist.length - 1 : i - 1;
    const nextTrack = i + 1 === playlist.length ?  0 : i + 1;

    likeBtn.dataset.idTrack = id;

    prevBtn.dataset.idTrack = playlist[prevTrack].id;
    nextBtn.dataset.idTrack = playlist[nextTrack].id;

    for(let i = 0; i < trackCard.length; i++) {
        if (id === trackCard[i].dataset.idTrack) {
            trackCard[i].classList.add('track_active');
        } else {
            trackCard[i].classList.remove('track_active');
        }
    };
}

const addHandlerTrack = () => {
    for(let i = 0; i < trackCard.length; i++) {
        trackCard[i].addEventListener('click', playMusic)
    }
    
}

pauseBtnt.addEventListener('click', pausePlayer);

stopBtnt.addEventListener('click', () => {
    audio.src = '';
    pauseBtnt.classList.add('player__icon_play');
    player.classList.remove('player_active');

    document.querySelector('.track_active').classList.remove('track_active-activeColor');
    document.querySelector('.track_active').classList.remove('track_active');
});

const createCard = (data) => {
    const card = document.createElement('div');
    card.style.cursor = 'pointer';
    card.classList.add('catalog__tem', 'track');
    if (player.dataset.idTrack === data.id) {
        card.classList.add('track_active');
        if (audio.paused) {
            card.classList.add('track_pause');
        }
    }
    card.dataset.idTrack = data.id;

    card.innerHTML = `
        <div class="track__img-wrap">
            <img 
                class="track__poster" 
                src="${API_URL}${data.poster}" 
                alt="${data.artist} ${data.track}"
                width="180"
                height="180">
        </div>
        <div class="track__info">
            <p class="track_title">${data.track}</p>
            <p class="track_artist">${data.artist}</p>
        </div>
    `
    return card;
}

const renderCatalog = (dataList = null) => {
    // message.classList.remove('tracksList-hidden-show');


    if (dataList) {
        playlist = [...dataList];
        catalogContainer.textContent = '';
        const listCards = playlist.map(createCard);
        catalogContainer.append(...listCards);
        addHandlerTrack();
    } else {
        catalogContainer.textContent = '';
        message.style.display = 'block';
        catalogContainer.style.gridTemplateColumns = 'auto';
        catalogContainer.append(message);
    }
}


const checkCount = (i = 1) => {
    trackCard[0];
    if (catalogContainer.clientHeight > trackCard[0].clientHeight * 3) {
        trackCard[trackCard.length - i].style.display = 'none';
        checkCount(i + 1);
    } else if(i !== 1)    {
        catalogContainer.append(catalogAddBtn);
    }
}


const updateTime = () => {
    const duration = audio.duration;
    const currentTime = audio.currentTime;
    const progress = (currentTime / duration) * playerProgressInput.max;
    playerProgressInput.value = progress ? progress : 0;

    const  minutesPassed = Math.floor(currentTime / 60) || '0';
    const  secondsPassed = Math.floor(currentTime % 60) || '0';

    const  minutesDuration = Math.floor(duration / 60) || '0';
    const  secondsDuration = Math.floor(duration % 60) || '0';

    playerTimePassed.textContent = `${minutesPassed}:${secondsPassed < 10 ? '0' + secondsPassed : secondsPassed}`
    playerTimeTotal.textContent = `${minutesDuration}:${secondsDuration < 10 ? '0'+ secondsDuration : secondsDuration}`

}


const init = async () => {
    audio.volume = localStorage.getItem('volume') || 1;
    player.volume = audio.volume * 100;


    dataMusic = await fetch(`${API_URL}api/music`).then((data) => data.json());


    renderCatalog(dataMusic);
    checkCount();

    catalogAddBtn.addEventListener('click', () => {
        [...trackCard].forEach(track => {
            track.style.display = '';
            catalogAddBtn.remove();
        })
    });

    prevBtn.addEventListener('click', playMusic);
    nextBtn.addEventListener('click', playMusic);
    audio.addEventListener('timeupdate', updateTime);

    audio.addEventListener('ended', () => {
        nextBtn.dispatchEvent(new Event('click', {bubbles: true}))
    })   

    playerProgressInput.addEventListener('change', () => {
        const progress = playerProgressInput.value;
        audio.currentTime = (progress / playerProgressInput.max) * audio.duration;
    });

    favoriteBtn.addEventListener('click', () => {
        const data = dataMusic.filter((item) => favoriteList.includes(item.id));
        renderCatalog(data);
        checkCount();
    })

    headerLogo.addEventListener('click', () => {
        renderCatalog(dataMusic);
        checkCount();
    })

    likeBtn.addEventListener('click', () => {
      const index = favoriteList.indexOf(likeBtn.dataset.idTrack);
      
      if (index === -1) {
        favoriteList.push(likeBtn.dataset.idTrack);
        likeBtn.classList.add('player__icon_like_active')
      } else {
        favoriteList.splice(index, 1);
        likeBtn.classList.remove('player__icon_like_active')
      }

      localStorage.setItem('favorite', JSON.stringify(favoriteList));
    });

    playerVolumeInput.addEventListener('input', ()=> {
        const value = playerVolumeInput.value;
        audio.volume = value / 100;
        
    })

    muteBtn.addEventListener('click', ()=> {
        if (audio.volume) {
            localStorage.setItem('volume', audio.volume)
            audio.volume = 0;
            playerProgressInput.value = 0;
            muteBtn.classList.add('player__icon_mute-off');
        } else {
            audio.volume = localStorage.getItem('volume');
            playerProgressInput.value = audio.volume * 100;
            muteBtn.classList.remove('player__icon_mute-off');
        }
    })

    search.addEventListener('submit', async (event) => {
        event.preventDefault();

        playlist = await fetch(`${API_URL}api/music?search=${search.search.value}`).then((data) => data.json());

        if (playlist.length) {
            renderCatalog(playlist);
            checkCount();
        } else {
            // message.classList.add ('tracksList-hidden-show');
            renderCatalog();
        }

        
    })
}

init();


