let coverLink, introSection, fullInviteSection, main, backgroundAudio;
let placeSection;
let programSection;

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
window.addEventListener('orientationchange', updateVh);
updateVh();

function onDOMContentLoaded(){
    main = document.querySelector('.main');
    introSection = document.getElementById('intro');
    fullInviteSection = document.getElementById('full-invite');
    backgroundAudio = document.getElementById('introAudio');
    coverLink = document.getElementById('coverLink');
    placeSection = document.getElementById('place');
    programSection = document.getElementById('program');
    
    resetToInitialState();
    updateVh();
    
    setupSaveTheDateSection();
    setupPlaceSection();
    setupProgramSection();
    setupCards();
    
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

    programSection.classList.remove('hidden');
    programSection.classList.add('visible');
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

function setupSaveTheDateSection() {
    const saveTheDate = document.querySelector('.save-the-date');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                saveTheDate.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(saveTheDate);
}

function setupPlaceSection() {
    const placeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                placeSection.classList.add('animate-in');
                placeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    placeObserver.observe(placeSection);
}

function setupProgramSection() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                programSection.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    observer.observe(programSection);

    const programItems = document.querySelectorAll('.program-item');
    if (programItems.length) {
        const itemObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting){
                        entry.target.style.transitionDelay = `${150}ms`;
                        entry.target.classList.add('animate-in');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        programItems.forEach(item => itemObserver.observe(item));
    }
}

function setupCards() {
    const slides = Array.from(document.querySelectorAll('.dc-slide'));
    if (!slides.length) return;

    let idx = 0;

    let timer = setInterval(() => show(idx + 1), 10000);
    
    const slider = document.querySelector('.dc-slider');
    let startX = 0;

    slider.addEventListener('mousedown', e => startX = e.clientX);
    slider.addEventListener('mouseup',   e => {
        if (Math.abs(e.clientX - startX) > 30) { show(idx + 1); reset(); }
    });

    slider.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive:true });
    slider.addEventListener('touchend',   e => {
        if (Math.abs(e.changedTouches[0].clientX - startX) > 40) { show(idx + 1); reset(); }
    });

    function show(n) {
        slides.forEach(slide => slide.classList.remove('current', 'left'));
        slides[idx].classList.add('left');
        idx = (n + slides.length) % slides.length;
        slides[idx].classList.add('current');
    }

    function reset() {
        clearInterval(timer);
        timer = setInterval(() => show(idx + 1), 6000);
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
    
    if (placeSection)    {
        placeSection.classList.remove('visible');
        placeSection.classList.add('hidden');
    }
    
    if (programSection)    {
        programSection.classList.remove('visible');
        programSection.classList.add('hidden');
    }

    const programItems = document.querySelectorAll('.program-item');
    if (programItems.length) {
        programItems.forEach(item => {
            item.classList.remove('animate-in');
        });
    }

    if (main) {
        main.classList.remove('hidden', 'fade-out');
        main.style.display = '';
    }

    const introBackground = document.getElementById('introBackground');
    if (introBackground) {
        introBackground.classList.remove('hidden');
        introBackground.style.display = '';
    }

    const zoomedCover = document.querySelector('.cover-zooming');
    if (zoomedCover) {
        zoomedCover.remove();
    }

    window.scrollTo(0, 0);

    coverLink.removeEventListener('click', handleCoverClick);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
}

function updateVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}