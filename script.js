let coverLink, introSection, fullInviteSection, invitationSection, music;

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
    
function onDOMContentLoaded(){
    coverLink = document.getElementById('coverLink');
    introSection = document.getElementById('intro');
    fullInviteSection = document.getElementById('full-invite');
    invitationSection = document.querySelector('.invitation');
    music = document.getElementById('introAudio');
    
    resetToInitialState();

    if (coverLink && introSection && fullInviteSection && invitationSection) {
        coverLink.addEventListener('click', handleCoverClick);
    }

    if (music) {
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }
}

function handleCoverClick(event) {
    event.preventDefault();

    invitationSection.classList.add('fade-out');

    setTimeout(() => {
        invitationSection.classList.add('hidden');
        invitationSection.style.display = 'none';

        introSection.classList.remove('hidden');
        setTimeout(() => {
            introSection.classList.add('visible');

            // Убираем абсолютное позиционирование
            introSection.style.position = 'relative';
            introSection.style.zIndex = 'auto';

            document.body.classList.add('allow-scroll');
        }, 50);
    }, 500);

    setTimeout(() => {
        fullInviteSection.classList.remove('hidden');
        fullInviteSection.classList.add('visible');
        const introBackground = document.getElementById('introBackground');
        if (introBackground) {
            introBackground.classList.add('hidden');
        }
    }, 1300);

    if (music) {
        music.volume = 0.5;
        music.play().catch(e => {
            console.warn("Автовоспроизведение не разрешено:", e);
        });
    }
}

function handleVisibilityChange() {
    if (document.hidden) {
        music.pause();
    } else {
        music.play().catch(() => {});
    }
}

function resetToInitialState() {
    document.body.classList.remove('allow-scroll');

    if (introSection) {
        introSection.classList.remove('visible');
        introSection.classList.add('hidden');
        introSection.style.position = 'absolute';
        introSection.style.zIndex = '10';
    }

    if (fullInviteSection) {
        fullInviteSection.classList.remove('visible');
        fullInviteSection.classList.add('hidden');
    }

    if (invitationSection) {
        invitationSection.classList.remove('fade-out');
        invitationSection.classList.remove('hidden');
        invitationSection.style.display = ''; // ← чтобы снова стало видно
    }

    // сбросить scroll
    window.scrollTo(0, 0);
}