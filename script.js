let coverLink, introSection, fullInviteSection, main, backgroundAudio;
let placeSection;

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
window.addEventListener('resize', updateVh);
window.addEventListener('orientationchange', updateVh);
updateVh();

function onDOMContentLoaded(){
    main = document.querySelector('.main');
    introSection = document.getElementById('intro');
    fullInviteSection = document.getElementById('full-invite');
    backgroundAudio = document.getElementById('introAudio');
    coverLink = document.getElementById('coverLink');
    placeSection = document.getElementById('place');
    
    resetToInitialState();
    updateVh();
    
    setupSaveTheDate();
    
    coverLink.addEventListener('click', handleCoverClick);
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

function handleCoverClick(event) {
    event.preventDefault();
    playBackgroundAudio();
    animateCover(400);
    setTimeout(animateFullInvite, 600);
    setTimeout(() => {document.body.classList.add('allow-scroll');}, 1200);
}

function animateFullInvite() {
    fullInviteSection.classList.remove('hidden');
    fullInviteSection.classList.add('visible');

    placeSection.classList.remove('hidden');
    placeSection.classList.add('visible');
}

function animateCover(timeout) {
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
    main.classList.add('fade-out');

    setTimeout(() => {
        introSection.classList.remove('hidden');
        introSection.classList.add('visible');
        console.log(introSection.classList);
        introSection.style.position = 'relative';
        introSection.style.zIndex = 'auto';

        main.classList.add('hidden');
        main.style.display = 'none';

        clone.style.opacity = '0';
        const introBackground = document.getElementById('introBackground');
        introBackground.classList.add('hidden');
    }, timeout);
}

function playBackgroundAudio() {
    if (backgroundAudio) {
        backgroundAudio.volume = 0.5;
        backgroundAudio.play().catch(e => {
            console.warn("Автовоспроизведение не разрешено:", e);
        });
    }
}

function handleVisibilityChange() {
    if (document.hidden) {
        backgroundAudio.pause();
    } else {
        backgroundAudio.play().catch(() => {});
    }
}

function setupSaveTheDate() {
    const saveTheDate = document.querySelector('.save-the-date');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                saveTheDate.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    observer.observe(saveTheDate);
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
    
    if (placeSection)    {
        placeSection.classList.remove('visible');
        placeSection.classList.add('hidden');
    }

    // Показываем стартовую секцию
    if (main) {
        main.classList.remove('hidden', 'fade-out');
        main.style.display = '';
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

    coverLink.removeEventListener('click', handleCoverClick);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
}

function updateVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}