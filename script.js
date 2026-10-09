document.addEventListener("DOMContentLoaded", function () {

    // FEATURE 1: READ MORE / READ LESS
    const expandButtons = document.querySelectorAll(".expand-btn");

    expandButtons.forEach(function (button) {
        const content = button.nextElementSibling;

        if (!content) return;

        content.hidden = true;
        button.setAttribute("aria-expanded", "false");

        button.addEventListener("click", function () {
            const expanded =
                button.getAttribute("aria-expanded") === "true";

            content.hidden = expanded;
            button.setAttribute("aria-expanded", String(!expanded));

            button.textContent = expanded
                ? "Read More"
                : "Read Less";
        });
    });


    // FEATURE 2: PHOTO GALLERY VIEWER
    const photos = document.querySelectorAll(".photo-gallery img");

    if (photos.length > 0) {
        const viewer = document.createElement("div");

        viewer.id = "gallery-viewer";
        viewer.hidden = true;
        viewer.setAttribute("role", "dialog");
        viewer.setAttribute("aria-modal", "true");
        viewer.setAttribute("aria-label", "Photo gallery");

        viewer.innerHTML = `
            <button id="gallery-close" type="button"
                    aria-label="Close gallery">Close &times;</button>

            <button id="gallery-prev" type="button"
                    aria-label="Previous photo">❮</button>

            <figure>
                <img id="gallery-large" src="" alt="">
                <figcaption id="gallery-caption"></figcaption>
            </figure>

            <button id="gallery-next" type="button"
                    aria-label="Next photo">❯</button>
        `;

        document.body.appendChild(viewer);

        const largeImage = viewer.querySelector("#gallery-large");
        const caption = viewer.querySelector("#gallery-caption");
        const closeButton = viewer.querySelector("#gallery-close");
        const previousButton = viewer.querySelector("#gallery-prev");
        const nextButton = viewer.querySelector("#gallery-next");

        let currentIndex = 0;
        let previousFocus = null;

        function showPhoto(index) {
            currentIndex = (index + photos.length) % photos.length;

            const photo = photos[currentIndex];

            largeImage.src = photo.src;
            largeImage.alt = photo.alt || "Gallery photograph";
            caption.textContent =
                photo.closest("figure")?.querySelector("figcaption")
                    ?.textContent || photo.alt || "Gallery photograph";
        }

        function openViewer(index) {
            previousFocus = photos[index];
            showPhoto(index);
            viewer.hidden = false;
            closeButton.focus();
        }

        function closeViewer() {
            viewer.hidden = true;

            if (previousFocus) {
                previousFocus.focus();
            }
        }

        photos.forEach(function (photo, index) {
            photo.tabIndex = 0;

            photo.addEventListener("click", function () {
                openViewer(index);
            });

            photo.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openViewer(index);
                }
            });
        });

        closeButton.addEventListener("click", closeViewer);

        previousButton.addEventListener("click", function () {
            showPhoto(currentIndex - 1);
        });

        nextButton.addEventListener("click", function () {
            showPhoto(currentIndex + 1);
        });

        viewer.addEventListener("click", function (event) {
            if (event.target === viewer) {
                closeViewer();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (viewer.hidden) return;

            if (event.key === "Escape") {
                closeViewer();
            } else if (event.key === "ArrowRight") {
                showPhoto(currentIndex + 1);
            } else if (event.key === "ArrowLeft") {
                showPhoto(currentIndex - 1);
            }
        });
    }


    // FEATURE 3: LIGHT / DARK THEME SWITCH
    const themeButton = document.querySelector("#theme-toggle");

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;

        if (themeButton) {
            themeButton.textContent = theme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode";

            themeButton.setAttribute(
                "aria-pressed",
                String(theme === "dark")
            );
        }
    }

    applyTheme("light");

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            const currentTheme =
                document.documentElement.dataset.theme;

            applyTheme(currentTheme === "dark" ? "light" : "dark");
        });
    }


    // OPTIONAL: DEMONSTRATION CONTACT FORM
    // This form displays a message but does not send an email.
    const contactForm = document.querySelector("#contact-form");
    const formMessage = document.querySelector("#form-message");

    if (contactForm && formMessage) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            formMessage.textContent =
                "Thank you! The form works, but it does not send messages yet.";

            contactForm.reset();
        });
    }

});