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

    const img = document.querySelector('.cover-photo');
    const rect = img.getBoundingClientRect();

    // Клонируем ТОЛЬКО картинку
    const clone = img.cloneNode(true);
    clone.classList.add('cover-photo-zooming');
    clone.style.top = `${rect.top + window.scrollY}px`;
    clone.style.left = `${rect.left + window.scrollX}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;

    document.body.appendChild(clone);

    // Вычисляем целевые размеры
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const imageRatio = rect.width / rect.height;
    let targetWidth = vw;
    let targetHeight = vw / imageRatio;

    if (targetHeight < vh) {
        targetHeight = vh;
        targetWidth = vh * imageRatio;
    }

    const targetTop = (vh - targetHeight) / 2;
    const targetLeft = (vw - targetWidth) / 2;

    requestAnimationFrame(() => {
        clone.style.top = `${targetTop}px`;
        clone.style.left = `${targetLeft}px`;
        clone.style.width = `${targetWidth}px`;
        clone.style.height = `${targetHeight}px`;
    });

    // fade-out для рамки
    invitationSection.classList.add('fade-out');

    // Подготавливаем intro
    introSection.classList.remove('hidden');
    introSection.classList.remove('visible');
    introSection.style.position = 'absolute';
    introSection.style.zIndex = '10';

    // Через 800 мс — показываем intro и убираем клон
    setTimeout(() => {
        introSection.classList.add('visible');
        document.body.classList.add('allow-scroll');

        introSection.style.position = 'relative';
        introSection.style.zIndex = 'auto';

        invitationSection.classList.add('hidden');
        invitationSection.style.display = 'none';

        clone.style.opacity = '0';
        setTimeout(() => clone.remove(), 300);
    }, 800);

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
    // Убираем разрешение на скролл
    document.body.classList.remove('allow-scroll');

    // Сброс интро
    if (introSection) {
        introSection.classList.remove('visible');
        introSection.classList.add('hidden');
        introSection.style.position = 'absolute';
        introSection.style.zIndex = '10';
    }

    // Сброс полного приглашения
    if (fullInviteSection) {
        fullInviteSection.classList.remove('visible');
        fullInviteSection.classList.add('hidden');
    }

    // Показываем стартовую секцию
    if (invitationSection) {
        invitationSection.classList.remove('hidden', 'fade-out');
        invitationSection.style.display = '';
    }

    // Показываем фон интро, если он есть
    const introBackground = document.getElementById('introBackground');
    if (introBackground) {
        introBackground.classList.remove('hidden');
        introBackground.style.display = '';
    }

    // Удаляем клон обложки, если он остался в DOM
    const zoomedCover = document.querySelector('.cover-zooming');
    if (zoomedCover) {
        zoomedCover.remove();
    }

    // Возвращаем scroll вверх
    window.scrollTo(0, 0);
}