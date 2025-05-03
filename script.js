const coverLink = document.getElementById('coverLink');
const introSection = document.getElementById('intro');
const fullInviteSection = document.getElementById('full-invite');
const invitationSection = document.querySelector('.invitation'); // <main class="invitation">

if (coverLink && introSection && fullInviteSection && invitationSection) {
    coverLink.addEventListener('click', (event) => {
        event.preventDefault();

        // 1. Добавляем fade-out к .invitation
        invitationSection.classList.add('fade-out');

        // 2. Через 500мс скрываем полностью
        setTimeout(() => {
            invitationSection.classList.add('hidden');

            // Показываем hero с анимацией
            introSection.classList.remove('hidden');
            introSection.classList.remove('hidden');

            setTimeout(() => {
                introSection.classList.add('visible');
            }, 50);
        }, 500);

        // 3. Показываем следующий блок позже
        setTimeout(() => {
            fullInviteSection.classList.remove('hidden');
        }, 1300);
    });
}