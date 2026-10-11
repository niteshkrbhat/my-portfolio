/* Home hero: intro video playback, sound and play/pause controls. */
const fg         = document.getElementById('videoFg');
const bg         = document.getElementById('videoBg');
const btnMute    = document.getElementById('btnMute');
const btnPlay    = document.getElementById('btnPlay');
const soundBadge = document.getElementById('soundBadge');
const timecodeEl = document.getElementById('timecode');

const MAX_AUTO_LOOPS = 3;
let loopsDone  = 0;
let afterLimit = false;
let playOnce   = false;

/* bg always stays muted — enforce it */
bg.muted = true;

/* Sync bg position to fg (visual only, no audio) */
fg.addEventListener('timeupdate', () => {
    if (Math.abs(bg.currentTime - fg.currentTime) > 0.3) {
        bg.currentTime = fg.currentTime;
    }
    const t   = fg.currentTime;
    const h   = Math.floor(t / 3600);
    const m   = Math.floor((t % 3600) / 60);
    const s   = Math.floor(t % 60);
    const fr  = Math.floor((t % 1) * 24);
    const pad = n => String(Math.floor(n)).padStart(2, '0');
    timecodeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(fr)}`;
});

/* Handle each fg video end */
fg.addEventListener('ended', () => {
    if (!afterLimit) {
        loopsDone++;
        if (loopsDone < MAX_AUTO_LOOPS) {
            fg.currentTime = 0;
            bg.currentTime = 0;
            fg.play().catch(() => {});
        } else {
            afterLimit     = true;
            playOnce       = false;
            fg.currentTime = 0;
            bg.currentTime = 0;
            bg.pause();
            syncPlayUI();
        }
    } else if (playOnce) {
        playOnce       = false;
        fg.currentTime = 0;
        bg.currentTime = 0;
        bg.pause();
        syncPlayUI();
    }
});

/* Auto-start with audio — unless the visitor asked for reduced motion:
   then both videos stay paused until the play button is pressed */
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
    bg.removeAttribute('autoplay');
    bg.pause();
    fg.muted = true;
    soundBadge.classList.add('hidden');
} else {
    fg.muted = false;
    fg.play().then(() => {
        soundBadge.classList.add('hidden');
        syncMuteUI();
    }).catch(() => {
        fg.muted = true;
        fg.play().catch(() => {});
        syncMuteUI();
        setTimeout(() => {
            soundBadge.style.transition = 'opacity 1s';
            soundBadge.classList.add('hidden');
        }, 6000);
    });
}

/* Mute / Unmute (fg only — bg is always muted) */
function syncMuteUI() {
    const muted = fg.muted;
    document.getElementById('iconMuted').classList.toggle('is-off', !muted);
    document.getElementById('iconUnmuted').classList.toggle('is-off', muted);
    btnMute.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video');
    btnMute.title = muted ? 'Unmute video' : 'Mute video';
    if (!muted) soundBadge.classList.add('hidden');
}

btnMute.addEventListener('click', () => {
    fg.muted = !fg.muted;
    syncMuteUI();
});

soundBadge.addEventListener('click', () => {
    fg.muted = false;
    syncMuteUI();
});

/* Play / Pause */
function syncPlayUI() {
    const playing = !fg.paused;
    document.getElementById('iconPause').classList.toggle('is-off', !playing);
    document.getElementById('iconPlay').classList.toggle('is-off', playing);
    btnPlay.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
}

btnPlay.addEventListener('click', () => {
    if (fg.paused) {
        if (afterLimit) {
            playOnce       = true;
            fg.currentTime = 0;
            bg.currentTime = 0;
        }
        fg.play().catch(() => {});
        bg.play().catch(() => {});
    } else {
        fg.pause();
        bg.pause();
        if (afterLimit) playOnce = false;
    }
    syncPlayUI();
});

fg.addEventListener('play',  syncPlayUI);
fg.addEventListener('pause', syncPlayUI);

/* Initial UI state */
syncMuteUI();
syncPlayUI();
