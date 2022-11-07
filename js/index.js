const audio = new Audio();

const player = document.querySelector('.player');
const trackCard = document.querySelectorAll('.track');
const pauseBtnt = document.querySelector('.player__controller-pause');
const stopBtnt = document.querySelector('.player__controller-stop');
 
const playMusic = event => {
    const trackActive = event.currentTarget;

    trackCard.forEach(track => {
        track.classList.remove('track_active-activeColor');
    });
    trackActive.classList.add('track_active-activeColor');

    audio.src = trackActive.dataset.track;
    audio.play();
    pauseBtnt.classList.remove('player__icon_play');
    pauseBtnt.classList.add('player__icon_pause');
    player.classList.add('player_active');

    trackCard.forEach(track => {
        track.classList.remove('track_active');
    });

    trackActive.classList.add('track_active');
}

trackCard.forEach(track => {
    track.addEventListener('click', playMusic)
})



pauseBtnt.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        pauseBtnt.classList.remove('player__icon_play');
        pauseBtnt.classList.add('player__icon_pause');
    } else {
        audio.pause();
        pauseBtnt.classList.remove('player__icon_pause');
        pauseBtnt.classList.add('player__icon_play');
    }
});

stopBtnt.addEventListener('click', () => {
    audio.pause();
    pauseBtnt.classList.add('player__icon_play');
    player.classList.remove('player_active');

    trackCard.forEach(track => {
        track.classList.remove('track_active');
    });

});
