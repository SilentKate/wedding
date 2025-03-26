const coverLink = document.getElementById('coverLink');
const heroSection = document.getElementById('hero');
const invitationSection = document.getElementById('full-invite');
const introSection = document.querySelector('.invitation'); // <main class="invitation">

if (coverLink && heroSection && invitationSection && introSection) {
    coverLink.addEventListener('click', (event) => {
        event.preventDefault();

        // 1. Добавляем fade-out к .invitation
        introSection.classList.add('fade-out');

        // 2. Через 500мс скрываем полностью
        setTimeout(() => {
            introSection.classList.add('hidden');

            // Показываем hero с анимацией
            heroSection.classList.remove('hidden');
            heroSection.classList.remove('hidden');

            setTimeout(() => {
                heroSection.classList.add('visible');
            }, 50);
        }, 500);

        // 3. Показываем следующий блок позже
        setTimeout(() => {
            invitationSection.classList.remove('hidden');
        }, 1300);
    });
}