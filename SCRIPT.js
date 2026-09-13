const emblem = document.getElementById("emblem");
const diamond = document.querySelector(".diamond");

const enterBtn = document.getElementById("enterBtn");
const message = document.getElementById("message");

const particles = document.querySelector(".particles");
const intro = document.querySelector(".intro");


/* =========================================
   CREATE FLOATING PARTICLES
========================================= */

for (let i = 0; i < 70; i++) {

    const particle = document.createElement("span");

    particle.className = "particle";

    particle.style.left =
        Math.random() * 100 + "%";

    particle.style.top =
        Math.random() * 100 + "%";

    particle.style.animationDuration =
        (5 + Math.random() * 8) + "s";

    particle.style.animationDelay =
        Math.random() * 8 + "s";

    const size =
        1 + Math.random() * 2;

    particle.style.width =
        size + "px";

    particle.style.height =
        size + "px";

    particles.appendChild(particle);
}


/* =========================================
   DIAMOND CLICK
========================================= */

diamond.addEventListener("click", () => {

    message.textContent =
        "You found the way in.";

    message.style.color =
        "rgba(255, 190, 210, .9)";

    createBurst();
});


/* =========================================
   PARTICLE BURST
========================================= */

function createBurst() {

    for (let i = 0; i < 35; i++) {

        const particle =
            document.createElement("span");

        particle.className = "particle";

        particle.style.left = "50%";
        particle.style.top = "43%";

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            100 + Math.random() * 230;

        const x =
            Math.cos(angle) * distance;

        const y =
            Math.sin(angle) * distance;

        particle.animate(

            [
                {
                    transform:
                        "translate(0,0) scale(0)",

                    opacity: 1
                },

                {
                    transform:
                        `translate(${x}px, ${y}px) scale(1)`,

                    opacity: 0
                }
            ],

            {
                duration:
                    900 + Math.random() * 700,

                easing:
                    "cubic-bezier(.15,.8,.2,1)"
            }
        );

        particles.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1700);
    }
}


/* =========================================
   ENTER WORLD
========================================= */

enterBtn.addEventListener("click", () => {

    message.textContent =
        "opening your little world...";

    enterBtn.style.pointerEvents =
        "none";

    emblem.classList.add("opening");

    intro.classList.add("fade");

    createBurst();

    setTimeout(() => {

        window.location.href =
            "pages/photos.html";

    }, 1000);
});