const observers = [];

let backgroundAudio;
let saveTheDateSection, placeSection, programSection, dresscodeSection, flowersSection, giftsSection;
let communicationCover, communicationsSection;
let invite, inviteTapTarget, inviteUnlocked;
let slider, sliderMouseDown, sliderMouseUp, sliderTouchStart, sliderTouchEnd;
let outroSection;

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
document.addEventListener('DOMContentLoaded', onReloaded);
addEventListener('pageshow', () =>{
    requestAnimationFrame(() => {
        requestAnimationFrame(onReloaded);
    });
});

function collectContent() {
    invite = document.getElementById('invite');
    inviteTapTarget = document.querySelector('.tap-target');
    
    saveTheDateSection = document.getElementById('save-the-date');
    placeSection = document.getElementById('place');
    programSection = document.getElementById('program');
    dresscodeSection = document.getElementById('dresscode');
    slider = document.getElementById('dc-slider');

    flowersSection = document.getElementById('flowers');
    giftsSection = document.getElementById('gifts'); 
    
    communicationCover = document.getElementById('communications-cover');
    communicationsSection = document.getElementById('communications');
    
    outroSection = document.getElementById('outro');
    
    backgroundAudio = document.getElementById('backgroundAudio');
}

function scrollToTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
}

function resetContent() {
    if (saveTheDateSection){
        saveTheDateSection.classList.remove('fade-in-from-left');
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
        
        const programBg = programSection.querySelector('#program-bg');
        if (programBg) {
            programBg.classList.remove('fade-in');
            programBg.classList.add('hidden');
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
    
    if (flowersSection) {
        flowersSection.classList.remove('fade-in-from-right');
        flowersSection.classList.add('hidden');
    }
    
    if (giftsSection) {
        giftsSection.classList.remove('fade-in-from-left');
        giftsSection.classList.add('hidden');
    }
    
    if (communicationCover) {
        communicationCover.classList.remove('fade-in');
        communicationCover.classList.add('hidden');
    }
    
    if (communicationsSection) {
        communicationsSection.classList.remove('fade-in');
        communicationsSection.classList.add('hidden');

        const communications = document.getElementById('communications-container');
        const contacts = document.getElementById('contacts-container');

        communications.classList.remove('fade-in-from-left');
        communications.classList.add('hidden');

        contacts.classList.remove('fade-in-from-right');
        contacts.classList.add('hidden');
    }
    
    if (outroSection) {
        outroSection.classList.remove('fade-in');
        outroSection.classList.add('hidden');

        const outroBg = document.getElementById('outro-bg');
        if (outroBg) {
            outroBg.classList.remove('fade-in');
            outroBg.classList.add('hidden');
        }
    }
    
    
    scrollToTop();
    document.body.classList.add('disable-scroll');
    inviteUnlocked = false;
}

function unsubscribe(){
    if (slider) {
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
}

function onReloaded(){
    unsubscribe();
    collectContent();
    resetContent();

    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.transitionDelay = '200ms';
    document.documentElement.classList.remove('hidden');
    document.documentElement.classList.add('fade-in');
    
    setupSaveTheDateSection();
    setupPlaceSection();
    setupProgramSection();
    setupDresscodeSection();
    setupFlowersSection();
    setupGiftsSection();
    setupCommunicationsSection();
    setupOutroSection();
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    inviteTapTarget.addEventListener('mousedown', unlockInvite);
    inviteTapTarget.addEventListener('touchstart', unlockInvite);
}

function unlockInvite(){
    if (inviteUnlocked)    {
        return;
    }
    inviteUnlocked = true;
    document.documentElement.style.setProperty('background-color', `white`);
    const intro = document.getElementById('intro');
    intro.classList.remove("hidden");
    intro.classList.add("visible");

    // debug
    // invite.classList.add("hidden");
    // document.body.classList.remove('disable-scroll');
    // document.body.classList.add('enable-scroll');
    // return;
    // debug
    
    playBackgroundAudio();
    scrollToTop();
    
    setTimeout(() => {
        inviteTapTarget.classList.remove('initial');
        inviteTapTarget.classList.add('spread');
    }, 1800);

    setTimeout(() => {
        invite.classList.add("fade-out");
    }, 4000);

    setTimeout(() => {
        invite.classList.remove("fade-out");
        invite.classList.add("hidden");

        document.documentElement.classList.remove('disable-scroll');
        document.documentElement.classList.add('enable-scroll');
    }, 5000);
}

function playBackgroundAudio() {
    if (backgroundAudio && inviteUnlocked) {
        backgroundAudio.volume = 0.5;
        backgroundAudio.play().catch();
    }
}

function handleVisibilityChange() {
    if (inviteUnlocked) {
        if (document.hidden) {
            backgroundAudio.pause();
        } else {
            backgroundAudio.play().catch();
        }
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
                setTimeout(() => {
                    const programBg = document.getElementById('program-bg');
                    programBg.classList.add('fade-in');
                }, 600);
                
                const programItems = document.querySelectorAll('.program-item');
                if (programItems.length) {
                    for (let i = 0; i < programItems.length; i++) {
                        const item = programItems[i];
                        const delay = i * 600;
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
    let timer;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dresscodeSection.classList.remove('hidden');
                dresscodeSection.classList.add('fade-in');
                timer = setInterval(() => show(idx + 1), 10000);
                observer.unobserve(dresscodeSection);
            }
        });
    }, { threshold: 0.2 });
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

    let startX = 0;

    sliderMouseDown = e => startX = e.clientX;
    sliderMouseUp = e => {
        if (Math.abs(e.clientX - startX) > 40) {
            show(idx + 1);
            reset();
        }
    };
    
    slider.addEventListener('mousedown', sliderMouseDown);
    slider.addEventListener('mouseup', sliderMouseUp);

    sliderTouchStart = e => startX = e.touches[0].clientX;
    sliderTouchEnd = e => {
        if (Math.abs(e.changedTouches[0].clientX - startX) > 40) {
            show(idx + 1);
            reset();
        }
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

function setupFlowersSection() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                flowersSection.classList.add('fade-in-from-right');
                observer.unobserve(placeSection);
            }
        });
    }, { threshold: 0.4 });
    observer.observe(flowersSection);
    observers.push(observer);
}


function setupGiftsSection() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                giftsSection.classList.add('fade-in-from-left');
                observer.unobserve(giftsSection);
            }
        });
    }, { threshold: 0.4 });
    observer.observe(giftsSection);
    observers.push(observer);
}

function setupCommunicationsSection() {
    const coverObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                communicationCover.classList.remove('hidden');
                communicationCover.classList.add('fade-in');
                
                communicationsSection.classList.add('fade-in');
                communicationsSection.classList.remove('hidden');

                setTimeout(() =>                {
                    const communications = document.getElementById('communications-container');
                    communications.classList.remove('hidden');
                    communications.classList.add('fade-in-from-right');
                }, 1200)
                
                setTimeout(() => {
                    const contacts = document.getElementById('contacts-container');
                    contacts.classList.remove('hidden');
                    contacts.classList.add('fade-in-from-left');
                }, 2000)

                coverObserver.unobserve(communicationCover);
            }
        });
    }, { threshold: 0.4 });
    coverObserver.observe(communicationCover);
    observers.push(coverObserver);
}

function setupOutroSection() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                outroSection.classList.add('fade-in');
                setTimeout(() => {
                    const outroBg = document.getElementById('outro-bg');
                    outroBg.classList.add('fade-in');
                }, 200);
                observer.unobserve(outroSection);
            }
        });
    }, { threshold: 0.4 });
    observer.observe(outroSection);
    observers.push(observer);
}
