const observers = [];

let backgroundAudio;
let saveTheDateSection, placeSection, programSection, dresscodeSection;
let invite, inviteTapTarget, inviteUnlocked;
let slider, sliderMouseDown, sliderMouseUp, sliderTouchStart, sliderTouchEnd;


document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

function collectContent() {
    saveTheDateSection = document.getElementById('save-the-date');
    placeSection = document.getElementById('place');
    programSection = document.getElementById('program');
    dresscodeSection = document.getElementById('dresscode');
    
    slider = document.getElementById('dc-slider');
    invite = document.getElementById('invite');
    inviteTapTarget = document.querySelector('.tap-target');

    backgroundAudio = document.getElementById('backgroundAudio');
}

function unlockInvite(){
    inviteUnlocked = true;
    playBackgroundAudio();
    setTimeout(() => {
        inviteTapTarget.classList.remove('initial');
        inviteTapTarget.classList.add('spread');
    }, 2400);
    
    setTimeout(() => {
        invite.classList.add("fade-out");
    }, 4000);
    
    setTimeout(() => {
        document.body.classList.remove('disable-scroll');
        document.body.classList.add('enable-scroll');
    }, 4800);
}

function resetContent() {
    if (saveTheDateSection){
        saveTheDateSection.classList.remove('fade-in');
        saveTheDateSection.classList.add('hidden');
    }
    
    if (placeSection){
        placeSection.classList.remove('fade-in');
        placeSection.classList.add('hidden');
    }
    
    if (programSection) {
        const programTitle = programSection.querySelector('#program-title');
        if (programTitle) {
            programTitle.classList.remove('fade-in');
            programTitle.classList.add('hidden');
        }

        const programItems = document.querySelectorAll('.program-item');
        if (programItems.length) {
            for (let i = 0; i < programItems.length; i++) {
                const item = programItems[i];
                item.classList.remove('fade-in-from-left');
                item.classList.add('hidden');
            }
        }
    }

    if (dresscodeSection){
        dresscodeSection.classList.remove('fade-in');
        dresscodeSection.classList.add('hidden');
    }
    
    window.scrollTo(0, 0);
    if (slider)    {
        slider.removeEventListener('mousedown', sliderMouseDown);
        slider.removeEventListener('mouseup', sliderMouseUp);
        slider.removeEventListener('touchstart', sliderTouchStart);
        slider.removeEventListener('touchend', sliderTouchEnd);
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (inviteTapTarget)    {
        inviteTapTarget.removeEventListener('mousedown', unlockInvite);
        inviteTapTarget.removeEventListener('touchstart', unlockInvite);
    }
    observers.forEach(o => o.disconnect());
    observers.length = 0;

    document.body.classList.add('disable-scroll');
    inviteUnlocked = false;
}

function onDOMContentLoaded(){
    collectContent();
    resetContent();

    setupSaveTheDateSection();
    setupPlaceSection();
    setupProgramSection();
    setupDresscodeSection();
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    inviteTapTarget.addEventListener('mousedown', unlockInvite);
    inviteTapTarget.addEventListener('touchstart', unlockInvite);
}

function playBackgroundAudio() {
    if (backgroundAudio && inviteUnlocked) {
        backgroundAudio.volume = 0.5;
        backgroundAudio.play();
    }
}

function handleVisibilityChange() {
    if (inviteUnlocked) {
        if (document.hidden) {
            backgroundAudio.pause();
        } else {
            backgroundAudio.play();
        }
        return;
    }
}

function setupSaveTheDateSection() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                saveTheDateSection.classList.add('fade-in-from-left');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    observer.observe(saveTheDateSection);
    observers.push(observer);
}

function setupPlaceSection() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                placeSection.classList.add('fade-in');
                observer.unobserve(placeSection);
            }
        });
    }, { threshold: 0.4 });
    observer.observe(placeSection);
    observers.push(observer);
}

function setupProgramSection() {
    const programTitle = document.getElementById('program-title');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                programTitle.classList.add('fade-in');
                
                const programItems = document.querySelectorAll('.program-item');
                if (programItems.length) {
                    for (let i = 0; i < programItems.length; i++) {
                        const item = programItems[i];
                        const delay = i * 400;
                        item.style.animationDelay = `${delay}ms`;
                        item.classList.add('fade-in-from-left');
                    }
                }

                observer.unobserve(programTitle);
            }
        });
    }, { threshold: 0.4 });
    observer.observe(programTitle);
    observers.push(observer);
}

function setupDresscodeSection() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dresscodeSection.classList.remove('hidden');
                dresscodeSection.classList.add('fade-in');
                observer.unobserve(dresscodeSection);
            }
        });
    }, { threshold: 0.4 });
    observer.observe(dresscodeSection);
    observers.push(observer);
    
    let spans = document.querySelectorAll('.dc-palette span');
    for (let i = 0; i < spans.length; i++){
        const el = spans[i];
        let angle;
        if (i % 2 === 0) {
            angle = 0 + 'deg';
        } else {
            angle = 180 + 'deg';
        }
        el.style.setProperty('--angle', angle);
    }

    const slides = Array.from(document.querySelectorAll('.dc-slide'));
    if (!slides.length) return;

    let idx = 0;

    let timer = setInterval(() => show(idx + 1), 10000);
    let startX = 0;

    sliderMouseDown = e => startX = e.clientX;
    sliderMouseUp = e => {
        if (Math.abs(e.clientX - startX) > 30) { show(idx + 1); reset(); }
    };
    slider.addEventListener('mousedown', sliderMouseDown);
    slider.addEventListener('mouseup', sliderMouseUp);

    sliderTouchStart = e => startX = e.touches[0].clientX;
    sliderTouchEnd = e => {
        if (Math.abs(e.changedTouches[0].clientX - startX) > 40) { show(idx + 1); reset(); }
    };
    slider.addEventListener('touchstart', sliderTouchStart, { passive:true });
    slider.addEventListener('touchend', sliderTouchEnd);

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