/* ==============================================================
   BIRTHDAY SURPRISE — main script
   Chapters run in this order, each one revealing the next:

     1. Password        (#lockPage)
     2. Intro            (#introPage)
     3. Hero / Story      (#storyPage)
     4. Amma               (#momSection)
     5. Dad                  (#dadSection)
     6. Childhood              (#childhoodScene)
     7. Mama / Uncle            (#uncleSection)
     8. Family                    (#familySection)
     9. Me                          (Me section — see part 2 below)
================================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================
     AUDIO FILE ERROR DEBUGGING
  =========================================================== */

  document.querySelectorAll("audio").forEach((el) => {
    el.addEventListener("error", () => {
      const src = el.currentSrc || el.querySelector("source")?.src || "(no source found)";
      console.error(
        "🔇 AUDIO FAILED TO LOAD — id:",
        el.id || "(no id)",
        "| src:",
        src,
        "| error code:",
        el.error ? el.error.code : "unknown"
      );
    });
  });

  /* ==========================================================
     CHAPTER 1 — PASSWORD
  =========================================================== */

  const PASSWORD = "1509";
  let chances = 3;

  window.checkPassword = function () {
    const value = document.getElementById("pass").value;

    if (value === PASSWORD) {
      document.getElementById("lockPage").classList.add("hidden");
      document.getElementById("introPage").classList.remove("hidden");
    } else {
      chances--;

      if (chances > 0) {
        document.getElementById("attempt").innerHTML =
          "❌ Incorrect Password<br><br>💙 " + chances + " attempt(s) remaining.";
      } else {
        document.getElementById("attempt").innerHTML =
          "🔒 Oh no...<br><br>The birthday surprise has been locked.";
        document.getElementById("unlockBtn").disabled = true;
      }
    }
  };

  /* ==========================================================
     FLOATING HEARTS (password / intro pages)
  =========================================================== */

  const hearts = document.getElementById("hearts");
  for (let i = 0; i < 40; i++) {
    const heart = document.createElement("span");
    heart.innerHTML = "💙";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (15 + Math.random() * 20) + "px";
    heart.style.animationDuration = (6 + Math.random() * 8) + "s";
    heart.style.animationDelay = Math.random() * 6 + "s";
    hearts.appendChild(heart);
  }

  /* ==========================================================
     SHARED AUDIO HELPERS
  =========================================================== */

  function fadeInAudio(audio, targetVolume = 0.5, duration = 3000) {
    if (!audio) return;
    audio.volume = 0;
    audio.play().catch((err) => {
      console.warn("Audio play() was blocked or failed for", audio.id, err);
    });
    const steps = 30;
    const stepTime = duration / steps;
    const increment = targetVolume / steps;
    let current = 0;
    const fade = setInterval(() => {
      current++;
      audio.volume = Math.min(targetVolume, increment * current);
      if (current >= steps) clearInterval(fade);
    }, stepTime);
  }

  function fadeOutAudio(audio, step = 0.03, interval = 80) {
    if (!audio) return;
    const fadeOut = setInterval(() => {
      if (audio.volume > step) {
        audio.volume -= step;
      } else {
        audio.pause();
        audio.currentTime = 0;
        clearInterval(fadeOut);
      }
    }, interval);
  }

  function fadeVolumeTo(audio, targetVolume = 0.5, duration = 3000) {
    if (!audio) return null;
    const steps = 30;
    const stepTime = duration / steps;
    const startVolume = audio.volume;
    const diff = targetVolume - startVolume;
    let current = 0;
    const fade = setInterval(() => {
      current++;
      audio.volume = Math.max(0, Math.min(1, startVolume + diff * (current / steps)));
      if (current >= steps) clearInterval(fade);
    }, stepTime);
    return fade;
  }

  function stopAudio(audio) {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  function stopAllAudioExcept(except = []) {
    document.querySelectorAll("audio").forEach((el) => {
      if (except.includes(el)) return;
      el.pause();
      el.currentTime = 0;
    });
  }

  function playContinueSound(audio) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = 0.6;
    const playPromise = audio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch((err) => {
        console.warn("Continue-chime play() was blocked or failed for", audio.id, err);
      });
    }
  }

  function revealChapter(section) {
    if (!section) return;
    section.classList.remove("hidden");
    section.classList.remove("chapter-fade");
    void section.offsetWidth;
    section.classList.add("chapter-fade");
  }

  /* ==========================================================
     CHAPTER 3 — HERO / STORY INTRODUCTION
  =========================================================== */

  const introPage = document.getElementById("introPage");
  const storyPage = document.getElementById("storyPage");
  const openBook = document.getElementById("openBook");
  const beginBtn = document.getElementById("beginBtn");

  const introOpenSound = document.getElementById("introOpenSound");
  const storyMusic = document.getElementById("storyMusic");
  const storyBeginSound = document.getElementById("storyBeginSound");

  const storyLines = [
    document.getElementById("storyLine1"),
    document.getElementById("storyLine2"),
    document.getElementById("storyLine3"),
    document.getElementById("storyLine4"),
    document.getElementById("storyLine5")
  ];

  let storyMusicFadeTimer = null;

  openBook.addEventListener("click", () => {
    playContinueSound(introOpenSound);

    introPage.classList.add("hidden");
    storyPage.classList.remove("hidden");

    storyMusic.volume = 0;
    storyMusic.play().catch((err) => {
      console.warn("storyMusic play() was blocked or failed:", err);
    });

    setTimeout(() => {
      storyLines[0].classList.add("visible");
      clearInterval(storyMusicFadeTimer);
      storyMusicFadeTimer = fadeVolumeTo(storyMusic, 0.45, 3500);
    }, 2000);

    setTimeout(() => storyLines[1].classList.add("visible"), 0);
    setTimeout(() => storyLines[2].classList.add("visible"), 5000);
    setTimeout(() => storyLines[3].classList.add("visible"), 5600);
    setTimeout(() => storyLines[4].classList.add("visible"), 0);
    setTimeout(() => beginBtn.classList.add("visible"), 8300);
  });

  beginBtn.addEventListener("click", () => {
    clearInterval(storyMusicFadeTimer);
    storyMusicFadeTimer = null;

    stopAllAudioExcept([storyBeginSound]);

    storyMusic.muted = true;
    storyMusic.src = "";
    storyMusic.load();

    storyPage.classList.add("hidden");
    startMomChapter();

    storyBeginSound.currentTime = 0;
    storyBeginSound.volume = 0;
    storyBeginSound.play().catch((err) => {
      console.warn("storyBeginSound (heartbeat) play() was blocked or failed:", err);
    });

    setTimeout(() => {
      fadeVolumeTo(storyBeginSound, 0.5, 2500);
    }, 250);
  });

  /* ==========================================================
     GENERIC DUST FIELD (reused by the Childhood scene)
  =========================================================== */

  function spawnAmbientDust(container, count, sizeRange, extraClass) {
    for (let i = 0; i < count; i++) {
      const mote = document.createElement("span");
      mote.className = "mote drift" + (extraClass ? " " + extraClass : "");
      const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      mote.style.width = size + "px";
      mote.style.height = size + "px";
      mote.style.left = Math.random() * 100 + "%";
      mote.style.top = Math.random() * 100 + "%";
      mote.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
      mote.style.setProperty("--dy", (-40 - Math.random() * 60) + "px");
      mote.style.animationDuration = (8 + Math.random() * 10) + "s";
      mote.style.animationDelay = (Math.random() * 8) + "s";
      container.appendChild(mote);
    }
  }

  /* =====================================================
     CHAPTER 4 — MOM SECTION
  ===================================================== */

  const momSection = document.getElementById("momSection");
  const momIntro = document.getElementById("momIntro");
  const momHeartButton = document.getElementById("momHeartButton");
  const momMusic = document.getElementById("momMusic");
  const momContinue = document.getElementById("momContinue");
  const momImage = document.getElementById("momImage");
  const momImageBack = document.getElementById("momImageBack");
  const momPage = document.getElementById("momPage");
  const momCursorDust = document.getElementById("momCursorDust");
  const momDiaSound = document.getElementById("momDiaSound");

  const CURTAIN_OPEN_MS = 5200;
  const MOM_SPIN_MS = 1300;
  const MOM_DIA_FALLBACK_MS = 6000;
  const MOM_DUST_SAFETY_CAP_MS = 20000;
  const MOM_ZOOM_DELAY_MS = 5000;

  function startMomChapter() {
    revealChapter(momSection);
  }

  let momDustActive = false;
  let momDustMoveHandler = null;
  let momDustSafetyTimer = null;

  function startMomCursorDust() {
    if (!momCursorDust || !momPage) return;
    momDustActive = true;

    momDustMoveHandler = function (e) {
      if (!momDustActive) return;
      const rect = momPage.getBoundingClientRect();
      const dot = document.createElement("span");
      dot.className = "mom-dust-dot";
      dot.style.left = (e.clientX - rect.left) + "px";
      dot.style.top = (e.clientY - rect.top) + "px";
      momCursorDust.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove());
    };

    momPage.addEventListener("mousemove", momDustMoveHandler);

    clearTimeout(momDustSafetyTimer);
    momDustSafetyTimer = setTimeout(stopMomCursorDust, MOM_DUST_SAFETY_CAP_MS);
  }

  function stopMomCursorDust() {
    momDustActive = false;
    clearTimeout(momDustSafetyTimer);
    momDustSafetyTimer = null;

    if (momDustMoveHandler && momPage) {
      momPage.removeEventListener("mousemove", momDustMoveHandler);
      momDustMoveHandler = null;
    }
    if (momCursorDust) momCursorDust.innerHTML = "";
  }

  function getAudioDurationMs(audio) {
    return new Promise((resolve) => {
      let settled = false;
      const finish = (ms) => {
        if (settled) return;
        settled = true;
        resolve(ms);
      };

      if (audio.readyState >= 1 && isFinite(audio.duration) && audio.duration > 0) {
        finish(audio.duration * 1000);
        return;
      }

      const onMeta = () => {
        audio.removeEventListener("loadedmetadata", onMeta);
        finish(isFinite(audio.duration) && audio.duration > 0 ? audio.duration * 1000 : null);
      };
      audio.addEventListener("loadedmetadata", onMeta);

      setTimeout(() => {
        audio.removeEventListener("loadedmetadata", onMeta);
        finish(null);
      }, 4000);
    });
  }

  let momZoomTimer = null;

  function revealMomPhoto() {
    if (!momImage) return;

    clearTimeout(momZoomTimer);

    momImage.classList.remove("spin-in", "faded-out");
    if (momImageBack) momImageBack.classList.remove("visible");
    void momImage.offsetWidth;
    momImage.classList.add("spin-in");

    setTimeout(() => {
      momContinue.classList.add("visible");
    }, MOM_SPIN_MS);

    momZoomTimer = setTimeout(() => {
      momImage.classList.add("faded-out");
      if (momImageBack) momImageBack.classList.add("visible");
    }, MOM_SPIN_MS + MOM_ZOOM_DELAY_MS);
  }

  let momDiaHandled = false;
  let momDiaFallbackTimer = null;

  function handleMomDiaEnded() {
    if (momDiaHandled) return;
    momDiaHandled = true;
    clearTimeout(momDiaFallbackTimer);

    stopMomCursorDust();
    revealMomPhoto();
    fadeInAudio(momMusic, 0.6, 1800);
  }

  let momClicked = false;

  momHeartButton.addEventListener("click", function () {

    if (momClicked) return;
    momClicked = true;

    momIntro.classList.add("heart-touched");
    momIntro.classList.add("opening");

    stopAllAudioExcept([]);

    console.assert(
      storyBeginSound.paused && storyBeginSound.currentTime === 0,
      "Heartbeat sound did not fully stop when the heart was touched."
    );

    setTimeout(function () {
      momIntro.style.display = "none";

      startMomCursorDust();

      momDiaSound.currentTime = 0;
      momDiaSound.volume = 0.75;
      const playPromise = momDiaSound.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch((err) => {
          console.warn("momDiaSound play() was blocked or failed:", err);
        });
      }

      momDiaSound.addEventListener("ended", handleMomDiaEnded, { once: true });

      getAudioDurationMs(momDiaSound).then((durationMs) => {
        const fallbackDelay = durationMs ? durationMs + 300 : MOM_DIA_FALLBACK_MS;
        momDiaFallbackTimer = setTimeout(handleMomDiaEnded, fallbackDelay);
      });
    }, CURTAIN_OPEN_MS);

  });

  momContinue.addEventListener("click", function () {

    stopAudio(momMusic);
    stopMomCursorDust();
    clearTimeout(momZoomTimer);

    momSection.classList.add("hidden");
    startDadChapter();

  });

  /* =====================================================
     CHAPTER 5 — DAD CINEMATIC
  ===================================================== */

  const dadSection = document.getElementById("dadSection");
  const dadCameraArea = document.getElementById("dadCameraArea");
  const dadCamera = document.getElementById("dadCamera");
  const dadCameraHint = document.getElementById("dadCameraHint");
  const dadIntroText = document.getElementById("dadIntroText");
  const dadPhotoContainer = document.getElementById("dadPhotoContainer");
  const dadPhoto = document.getElementById("dadPhoto");
  const dadPhotoHint = document.getElementById("dadPhotoHint");
  const dadFullscreen = document.getElementById("dadFullscreen");
  const dadContinue = document.getElementById("dadContinue");
  const cameraShutter = document.getElementById("cameraShutter");
  const dadMusic = document.getElementById("dadMusic");

  dadPhoto.style.pointerEvents = "none";
  dadPhotoHint.style.opacity = "0";

  function startDadChapter() {
    revealChapter(dadSection);
  }

  dadCameraArea.addEventListener("click", function () {

    if (dadSection.classList.contains("camera-clicked")) return;

    dadSection.classList.add("camera-clicked");
    dadCamera.style.animation = "none";

    cameraShutter.currentTime = 0;
    cameraShutter.play().catch(function (error) {
      console.log("Camera shutter audio could not play:", error);
    });

    if (dadIntroText) dadIntroText.style.opacity = "0";

    dadCameraHint.style.opacity = "0";
    dadCameraHint.style.visibility = "hidden";
    dadCameraHint.style.pointerEvents = "none";

    dadSection.classList.add("camera-clicked");

    setTimeout(function () {

      dadCameraArea.style.display = "none";
      dadCameraHint.style.display = "none";
      dadSection.classList.add("photo-coming");

      setTimeout(function () {

        setTimeout(function () {

          dadMusic.currentTime = 0;
          dadMusic.play().catch(function (error) {
            console.log("Dad music could not play:", error);
          });

          dadSection.classList.add("developing");

          setTimeout(function () {
            dadSection.classList.add("photo-ready");
            dadPhoto.style.pointerEvents = "auto";
            dadPhotoHint.style.opacity = "1";
            dadPhotoHint.style.visibility = "visible";
          }, 5000);

        }, 2000);

      }, 1700);

    }, 1000);

  });

  dadPhoto.addEventListener("click", function () {

    if (!dadSection.classList.contains("photo-ready")) return;

    dadPhotoHint.style.opacity = "0";
    dadPhotoHint.style.visibility = "hidden";
    dadPhoto.style.pointerEvents = "none";

    dadSection.classList.add("fullscreen-open");

  });

  dadContinue.addEventListener("click", function () {

    dadMusic.pause();
    dadMusic.currentTime = 0;

    dadSection.classList.add("hidden");

    startChildhoodScene();

  });

  /* ==========================================================
     CHAPTER 6 — CHILDHOOD SCENE — "The Memory Box"
  =========================================================== */

  const childhoodScene = document.getElementById("childhoodScene");
  const chDustField = document.getElementById("chDust");
  const memoryBox = document.getElementById("memoryBox");
  const boxHint = document.getElementById("boxHint");
  const polaroidField = document.getElementById("polaroidField");
  const polaroidBackdrop = document.getElementById("polaroidBackdrop");
  const childhoodContinue = document.getElementById("childhoodContinue");
  const lightBridge = document.getElementById("lightBridge");

  const childhoodContinueSound = document.getElementById("childhoodContinueSound");
  const childhoodPopSound = document.getElementById("childhoodPopSound");
  const childhoodCircleSound = document.getElementById("childhoodCircleSound");

  const MEMORIES = [
    { img: "child1.jpeg", caption: "The home where curiosity first bloomed." },
    { img: "child 2.jpeg", caption: "A boy who noticed everything." },
    { img: "child 3.jpeg", caption: "Some afternoons felt endless, in the best way." },
    { img: "child 4.jpeg", caption: "Laughter that never needed a reason." },
    { img: "child 5.jpeg", caption: "Every scraped knee came with a story." },
    { img: "child 6.jpeg", caption: "The world was smaller then, and softer." },
    { img: "child 7.jpeg", caption: "Wonder was the only language he knew." },
    { img: "child 8.jpeg", caption: "Small moments, quietly becoming memory." }
  ];

  let childhoodStarted = false;
  let boxOpened = false;

  let activeSlot = null;

  function startChildhoodScene() {
    revealChapter(childhoodScene);

    if (childhoodStarted) return;
    childhoodStarted = true;

    spawnAmbientDust(chDustField, 48, [2, 6]);

    setTimeout(() => convergeDustIntoBox(), 900);

    setTimeout(() => {
      memoryBox.classList.add("formed");
    }, 900 + 2600);
  }

  function convergeDustIntoBox() {
    const count = 26;
    for (let i = 0; i < count; i++) {
      const mote = document.createElement("span");
      mote.className = "mote converge";
      const size = 3 + Math.random() * 4;
      mote.style.width = size + "px";
      mote.style.height = size + "px";

      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 220;
      const startX = Math.cos(angle) * dist;
      const startY = Math.sin(angle) * dist;

      mote.style.left = "calc(50% + " + startX + "px)";
      mote.style.top = "calc(50% + " + startY + "px)";

      mote.style.setProperty("--cx", (-startX) + "px");
      mote.style.setProperty("--cy", (-startY) + "px");
      mote.style.animationDelay = (Math.random() * 0.6) + "s";

      chDustField.appendChild(mote);
    }
  }

  memoryBox.addEventListener("click", openMemoryBox);
  memoryBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMemoryBox();
    }
  });

  function openMemoryBox() {
    if (boxOpened) return;
    boxOpened = true;
    memoryBox.classList.add("opened");
    boxHint.textContent = "";

    setTimeout(emitPolaroids, 650);
  }

  function getCardSize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w <= 640) return { w: 158, h: 192 };
    if (h <= 820) return { w: 190, h: 230 };
    return { w: 230, h: 280 };
  }

  function emitPolaroids() {
    playContinueSound(childhoodPopSound);

    const boxRect = memoryBox.getBoundingClientRect();
    const boxCenterX = boxRect.left + boxRect.width / 2;
    const boxCenterY = boxRect.top + boxRect.height / 2;
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const originX = boxCenterX - viewportCenterX;
    const originY = boxCenterY - viewportCenterY;

    MEMORIES.forEach((memory, i) => {
      const slot = document.createElement("div");
      slot.className = "polaroid-slot";
      slot.style.transform =
        "translate(" + originX + "px," + originY + "px) rotate(0deg) scale(.15)";

      const card = document.createElement("div");
      card.className = "polaroid-card";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Memory " + (i + 1) + ", click to bring to center");

      const front = document.createElement("div");
      front.className = "polaroid-face polaroid-front";
      const frame = document.createElement("div");
      frame.className = "frame";
      const img = document.createElement("img");
      img.src = memory.img;
      img.alt = "Childhood memory";
      img.onerror = function () { this.style.display = "none"; };
      frame.appendChild(img);
      front.appendChild(frame);

      const back = document.createElement("div");
      back.className = "polaroid-face polaroid-back";
      const caption = document.createElement("p");
      caption.textContent = memory.caption;
      back.appendChild(caption);

      card.appendChild(front);
      card.appendChild(back);
      slot.appendChild(card);
      polaroidField.appendChild(slot);

      setTimeout(() => {
        const scatterAngle = Math.random() * Math.PI * 2;
        const scatterDist = 40 + Math.random() * 70;
        const landX = originX + Math.cos(scatterAngle) * scatterDist;
        const landY = originY + Math.sin(scatterAngle) * scatterDist;
        const rot = (Math.random() * 30 - 15);

        slot.classList.add("landed");
        slot.style.transform =
          "translate(" + landX + "px," + landY + "px) rotate(" + rot + "deg) scale(1)";
      }, i * 220);

      const settleDelay = MEMORIES.length * 220 + 700;
      setTimeout(() => arrangeInCircle(slot, i, MEMORIES.length), settleDelay);

      card.addEventListener("click", () => selectPhoto(slot, card));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectPhoto(slot, card);
        }
      });
    });

    const settleDelay = MEMORIES.length * 220 + 700;
    setTimeout(() => {
      stopAudio(childhoodPopSound);
      playContinueSound(childhoodCircleSound);
    }, settleDelay);

    setTimeout(() => {
      memoryBox.classList.add("dissolved");
    }, settleDelay + 500);

    setTimeout(() => {
      childhoodContinue.classList.remove("hidden");
      childhoodContinue.classList.add("visible");
    }, settleDelay + 1800);
  }

  function arrangeInCircle(slot, index, total) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const { w: cardW, h: cardH } = getCardSize();

    const gap = 30;
    let radiusX = (total * (cardW + gap)) / (2 * Math.PI);
    radiusX = Math.max(170, Math.min(radiusX, w * 0.42));

    const verticalBudget = (h / 2) - cardH / 2 - 86;
    const radiusY = Math.max(110, Math.min(radiusX * 0.72, verticalBudget));

    const jitter = (Math.random() * 12 - 6);
    const angle = (index / total) * Math.PI * 2 + (Math.random() * 0.14 - 0.07);
    const x = Math.cos(angle) * (radiusX + jitter);
    const y = Math.sin(angle) * (radiusY + jitter);
    const rot = Math.random() * 16 - 8;

    slot.dataset.tx = x;
    slot.dataset.ty = y;
    slot.dataset.rot = rot;
    slot.style.transform =
      "translate(" + x + "px," + y + "px) rotate(" + rot + "deg) scale(1)";
  }

  function selectPhoto(slot, card) {
    if (!boxOpened) return;

    if (activeSlot === slot) {
      slot.classList.remove("centered");
      slot.style.zIndex = "";
      restoreSlotPosition(slot);
      activeSlot = null;
      polaroidBackdrop.classList.remove("active");
      return;
    }

    if (activeSlot) return;

    slot.classList.add("centered");
    slot.style.zIndex = "50";
    slot.style.transform = "translate(0px,0px) rotate(0deg) scale(1.4)";
    activeSlot = slot;
    polaroidBackdrop.classList.add("active");
  }

  polaroidBackdrop.addEventListener("click", () => {
    if (!activeSlot) return;
    activeSlot.classList.remove("centered");
    activeSlot.style.zIndex = "";
    restoreSlotPosition(activeSlot);
    activeSlot = null;
    polaroidBackdrop.classList.remove("active");
  });

  function restoreSlotPosition(slot) {
    const x = slot.dataset.tx || 0;
    const y = slot.dataset.ty || 0;
    const rot = slot.dataset.rot || 0;
    slot.style.transform =
      "translate(" + x + "px," + y + "px) rotate(" + rot + "deg) scale(1)";
  }

  childhoodContinue.addEventListener("click", () => {
    playContinueSound(childhoodContinueSound);
    collapseChildhoodScene();
  });

  function collapseChildhoodScene() {
    childhoodContinue.classList.remove("visible");
    polaroidBackdrop.classList.remove("active");

    if (activeSlot) {
      activeSlot.classList.remove("centered");
      activeSlot.style.zIndex = "";
      activeSlot = null;
    }

    memoryBox.classList.remove("dissolved");

    const slots = Array.from(polaroidField.querySelectorAll(".polaroid-slot"));
    const boxRect = memoryBox.getBoundingClientRect();
    const boxCenterX = boxRect.left + boxRect.width / 2;
    const boxCenterY = boxRect.top + boxRect.height / 2;
    const originX = boxCenterX - window.innerWidth / 2;
    const originY = boxCenterY - window.innerHeight / 2;

    setTimeout(() => {
      slots.forEach((slot, i) => {
        setTimeout(() => {
          slot.style.zIndex = "";
          slot.style.opacity = "0";
          slot.style.transform =
            "translate(" + originX + "px," + originY + "px) rotate(0deg) scale(.15)";
        }, i * 120);
      });
    }, 400);

    const totalCollapse = 400 + slots.length * 120 + 1000;

    setTimeout(() => {
      memoryBox.classList.remove("opened");
    }, totalCollapse);

    setTimeout(() => {
      memoryBox.classList.remove("formed");
      lightBridge.classList.add("active");
    }, totalCollapse + 900);

    /* Go to Mama / Uncle (tractor) section */
    setTimeout(() => {
      childhoodScene.classList.add("hidden");
      startUncleChapter();
    }, totalCollapse + 900 + 500);

    setTimeout(() => {
      lightBridge.classList.remove("active");
    }, totalCollapse + 900 + 1600);
  }

  /* ==========================================================
     CHAPTER 7 — MAMA / UNCLE — "The Tractor"
  =========================================================== */

  const uncleSection = document.getElementById("uncleSection");
  const tractorScene = document.getElementById("tractorScene");
  const clickText = document.getElementById("clickText");
  const mamaSection = document.getElementById("mamaSection");
  const mamaMusic = document.getElementById("mamaMusic");
  const flipCard = document.getElementById("flipCard");
  const particles = document.getElementById("particles");
  const uncleContinue = document.getElementById("uncleContinue");

  const tractorSound = document.getElementById("tractorSound");
  if (tractorSound) tractorSound.loop = true;

  if (mamaMusic) mamaMusic.volume = 0.8;

  function showMusicFallback() {
    if (document.getElementById("musicFallbackBtn")) return;

    const btn = document.createElement("button");
    btn.id = "musicFallbackBtn";
    btn.textContent = "♥ Tap to play music";
    btn.style.position = "fixed";
    btn.style.bottom = "30px";
    btn.style.left = "50%";
    btn.style.transform = "translateX(-50%)";
    btn.style.padding = "12px 24px";
    btn.style.borderRadius = "30px";
    btn.style.border = "none";
    btn.style.background = "rgba(180, 30, 30, 0.9)";
    btn.style.color = "#fff";
    btn.style.fontSize = "16px";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "9999";

    btn.addEventListener("click", function () {
      mamaMusic.play()
        .then(function () { btn.remove(); })
        .catch(function (error) { console.log("Manual play error:", error); });
    });

    document.body.appendChild(btn);
  }

  function startUncleChapter() {
    revealChapter(uncleSection);
  }

  let tractorStarted = false;

  if (tractorScene) {
    tractorScene.addEventListener("click", function () {

      if (tractorStarted) return;
      tractorStarted = true;

      if (clickText) clickText.style.opacity = "0";

      if (mamaMusic) {
        mamaMusic.play()
          .then(function () {
            mamaMusic.pause();
            mamaMusic.currentTime = 0;
          })
          .catch(function (error) {
            console.log("Priming error:", error);
          });
      }

      stopAllAudioExcept([]);
      if (tractorSound) {
        tractorSound.currentTime = 0;
        tractorSound.play().catch(function (error) {
          console.log("Audio error:", error);
        });
      }

      tractorScene.classList.add("go");

      setTimeout(function () {

        stopAudio(tractorSound);

        tractorScene.style.display = "none";

        mamaSection.classList.add("show");
        mamaSection.style.display = "flex";

        if (mamaMusic) {
          mamaMusic.currentTime = 0;
          mamaMusic.play().catch(function (error) {
            console.log("Music error:", error);
            showMusicFallback();
          });
        }

        createParticles();

        setTimeout(function () {
          if (uncleContinue) uncleContinue.classList.add("visible");
        }, 4000);

      }, 8000);

    });
  }

  if (flipCard) {
    flipCard.addEventListener("click", function () {
      flipCard.classList.toggle("flipped");
    });
  }

  function createParticles() {
    if (!particles) return;
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDuration = (4 + Math.random() * 5) + "s";
      particle.style.animationDelay = Math.random() * 5 + "s";
      particles.appendChild(particle);
    }
  }

  function stopMamaParticles() {
    if (particles) particles.innerHTML = "";
  }

  /* ==========================================================
     CHAPTER 8 — FAMILY ALBUM CAROUSEL
  =========================================================== */

  const familySection = document.getElementById("familySection");

  const people = [
    { image: "dhanupapa.png", name: "Dhanukutty👼", song: "vayadi.mp3" },
    { image: "sithappa.png", name: "Chithappa😍", song: "sithappa song.mp3" },
    { image: "Dhana mam.png", name: "Dhana ma💕", song: "mam song.mp3" },
    { image: "dharun.jpeg", name: "Macha💀", song: "dharun.mp3" },
    { image: "selva.png", name: "Selvaa🫂", song: "selva song.mp3" },
    { image: "mamafam.jpeg", name: "Kudumbam❤️", song: "mamafam.mp3" },
    { image: "family.jpeg", name: "My familyy💓", song: "family song.mp3" },
    { image: "swathi.jpeg", name: "Thangachi❤️", song: "thangachisong.mp3" },
    { image: "clggang.jpeg", name: "Nanbargal", song: "clgsong.mp3" },
    { image: "school friend.jpeg", name: "Palli kalam", song: "gang song.mp3" },

  ];

  const leftCard = document.getElementById("leftCard");
  const centerCard = document.getElementById("centerCard");
  const rightCard = document.getElementById("rightCard");

  const leftImg = document.getElementById("leftImg");
  const centerImg = document.getElementById("centerImg");
  const rightImg = document.getElementById("rightImg");

  const leftName = document.getElementById("leftName");
  const centerName = document.getElementById("centerName");
  const rightName = document.getElementById("rightName");

  const nextButton = document.getElementById("next");
  const previousButton = document.getElementById("previous");

  const song = document.getElementById("song");

  const falling = document.getElementById("falling");

  let current = 0;
  let busy = false;
  let autoTimer = null;
  let extraTrainMoves = 2;

  const EXTRA_MOVES = 2;
  const MOVE_DURATION = 800;

  people.forEach(person => {
    const image = new Image();
    image.src = person.image;
  });

  if (song) {
    song.volume = 0.6;
    song.preload = "auto";
  }

  function getPerson(index) {
    return people[(index + people.length) % people.length];
  }

  function loadPhotos() {
    const left = getPerson(current - 1);
    const center = getPerson(current);
    const right = getPerson(current + 1);

    leftImg.src = left.image;
    leftImg.alt = left.name;
    leftName.textContent = left.name;

    centerImg.src = center.image;
    centerImg.alt = center.name;
    centerName.textContent = center.name;

    rightImg.src = right.image;
    rightImg.alt = right.name;
    rightName.textContent = right.name;
  }

  function playCurrentSong() {
    const currentPerson = people[current];
    if (!currentPerson || !song) return;

    song.pause();
    song.currentTime = 0;
    song.src = currentPerson.song;
    song.load();

    song.play().catch(() => {});
  }

  function resetCards() {
    leftCard.style.transition = "none";
    centerCard.style.transition = "none";
    rightCard.style.transition = "none";

    leftCard.className = "polaroid side-left";
    centerCard.className = "polaroid main";
    rightCard.className = "polaroid side-right";

    void leftCard.offsetWidth;

    leftCard.style.transition = "";
    centerCard.style.transition = "";
    rightCard.style.transition = "";
  }

  function nextPhoto() {
    if (busy) return;
    busy = true;

    centerCard.className = "polaroid move-left";
    rightCard.className = "polaroid move-center";
    leftCard.className = "polaroid move-left-out";

    setTimeout(() => {

      current++;

      if (current < people.length) {
        loadPhotos();
        resetCards();
        playCurrentSong();
        busy = false;
        return;
      }

      current = people.length - 1;

      clearInterval(autoTimer);
      if (song) fadeOutAudio(song, 0.03, 70);

      finishFamilySequence();
      busy = false;

    }, MOVE_DURATION);
  }

  function previousPhoto() {
    if (busy) return;
    busy = true;

    centerCard.className = "polaroid move-right-out";
    leftCard.className = "polaroid move-center";
    rightCard.className = "polaroid move-right-out";

    setTimeout(() => {

      current--;
      if (current < 0) current = people.length - 1;

      loadPhotos();
      resetCards();
      playCurrentSong();

      busy = false;

    }, MOVE_DURATION);
  }

  function startTrain() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      nextPhoto();
    }, 7000);
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      nextPhoto();
      startTrain();
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      previousPhoto();
      startTrain();
    });
  }

  function createFamilyParticle() {
    if (!falling) return;

    const particle = document.createElement("span");
    particle.className = "particle";

    const shapes = ["♡", "✦", "✧", "⋆", "◇"];
    particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];

    particle.style.left = Math.random() * 100 + "%";
    particle.style.fontSize = (7 + Math.random() * 8) + "px";
    particle.style.animationDuration = (7 + Math.random() * 5) + "s";

    falling.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 13000);
  }

  let familyParticleTimer = null;

  function resetFamilyCarousel() {
    clearInterval(autoTimer);
    clearInterval(familyParticleTimer);

    current = 0;
    busy = false;

    if (nextButton) nextButton.disabled = false;
    if (previousButton) previousButton.disabled = false;

    const familyContinue = document.getElementById("familyContinue");
    if (familyContinue) {
      familyContinue.classList.remove("visible");
      familyContinue.classList.add("hidden");
    }

    if (falling) falling.innerHTML = "";
  }

  function startFamilyChapter() {
    resetFamilyCarousel();

    revealChapter(familySection);

    loadPhotos();
    resetCards();
    playCurrentSong();
    startTrain();

    familyParticleTimer = setInterval(createFamilyParticle, 500);
  }

  function finishFamilySequence() {
    clearInterval(autoTimer);
    clearInterval(familyParticleTimer);

    if (nextButton) nextButton.disabled = true;
    if (previousButton) previousButton.disabled = true;

    const familyContinue = document.getElementById("familyContinue");
    if (familyContinue) {
      familyContinue.classList.remove("hidden");
      familyContinue.classList.add("visible");
    }
  }

  if (uncleContinue) {
    uncleContinue.addEventListener("click", function () {
      fadeOutAudio(mamaMusic);

      stopMamaParticles();

      uncleSection.classList.add("hidden");
      startFamilyChapter();
    });
  }

  /* ==========================================================
     FAMILY -> ME SECTION TRANSITION
  =========================================================== */

  const familyMeTransition = document.getElementById("familyMeTransition");
  const pinkParticles = document.getElementById("pinkParticles");
  const familyContinue = document.getElementById("familyContinue");

  
  const transitionArrow = document.getElementById("transitionArrow");

  let familyMeTransitionTriggered = false;

  function triggerFamilyToMeTransition() {
    if (familyMeTransitionTriggered) return;
    familyMeTransitionTriggered = true;

    clearInterval(autoTimer);
    if (familyParticleTimer) clearInterval(familyParticleTimer);
    if (song) fadeOutAudio(song, 0.03, 70);

    if (familyMeTransition) {
      familyMeTransition.classList.remove("hidden");
      void familyMeTransition.offsetWidth;
      familyMeTransition.classList.add("active");
    }

    spawnPinkTransitionParticles();

    setTimeout(function () {
      if (familySection) familySection.classList.add("hidden");
      if (typeof window.startMeSection === "function") {
        window.startMeSection();
      }
    }, 1500);
  }

  function spawnPinkTransitionParticles() {
    if (!pinkParticles || pinkParticles.children.length > 0) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("span");
      p.className = "pink-mote";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.animationDuration = (4 + Math.random() * 6) + "s";
      p.style.animationDelay = (Math.random() * 3) + "s";
      pinkParticles.appendChild(p);
    }
  }

  if (familyContinue) {
    familyContinue.addEventListener("click", function () {
      triggerFamilyToMeTransition();
    });
  }

  if (transitionArrow) {
    transitionArrow.addEventListener("click", function () {
      if (familyMeTransition) {
        familyMeTransition.classList.remove("active");
      }
      if (familySection) familySection.classList.add("hidden");
      if (typeof window.startMeSection === "function") {
        window.startMeSection();
      }
    });
  }

});

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const transitionOverlay =
        document.getElementById("transitionOverlay");

    const bgMusic =
        document.getElementById("bgMusic");

    /* NEW — dedicated audio for the 5-photo memory scene. Starts
       the moment the photo section begins (bgMusic is stopped at
       the same moment) and is stopped again once the video scene
       starts, so the two tracks never overlap. */
    const photoMusic =
        document.getElementById("photoMusic");

    /* NEW — dedicated audio for the letter scene's "PLAY MY SONG"
       button. Plays on loop for as long as the letter page is
       open and is explicitly stopped the moment "TURN THE PAGE"
       is clicked. */
    const letterMusic =
        document.getElementById("letterMusic");

    const introScene =
        document.getElementById("introScene");

    const gameScene =
        document.getElementById("gameScene");

    const photoScene =
        document.getElementById("photoScene");

    const photoArrange =
        document.getElementById("photoArrange");

    const videoScene =
        document.getElementById("videoScene");

    const letterScene =
        document.getElementById("letterScene");

    const finalScene =
        document.getElementById("finalScene");

    const enterIntro =
        document.getElementById("enterIntro");


    const signalCards =
        document.querySelectorAll(".signal-card");

    const gameSuccess =
        document.getElementById("gameSuccess");

    const continueToPhotos =
        document.getElementById("continueToPhotos");

    const memoryPhoto =
        document.getElementById("memoryPhoto");

    const photoCard =
        document.getElementById("photoCard");

    const photoCounter =
        document.getElementById("photoCounter");

    const photoHint =
        document.getElementById("photoHint");

    const heartFlow =
        document.getElementById("heartFlow");


    /* SECOND GAME */

    const unlockLights =
        document.querySelectorAll(".unlock-light");


    /* VIDEO */

    const mainVideo =
        document.getElementById("mainVideo");

    const continueToLetter =
        document.getElementById("continueToLetter");


    /* LETTER */

    const playSong =
        document.getElementById("playSong");

    const turnPage =
        document.getElementById("turnPage");


    /* FINAL */

    const fireworks =
        document.getElementById("fireworks");

    const birthdayMessage =
        document.getElementById("birthdayMessage");

    const voiceIndicator =
        document.getElementById("voiceIndicator");

    const myVoice =
        document.getElementById("myVoice");


    /* =====================================================
       DATA
    ===================================================== */

    /* The 5 photos for the memory scene. If any of these fail to
       load, loadPhoto()'s onerror handler below will log exactly
       which path 404'd — check the browser console and correct
       the filenames here to match your actual uploaded files. */
    const photoList = [
        "me 1.jpeg",
        "me 2.jpeg",
        "me 3.jpeg",
        "me 4.jpeg",
        "me 5.jpeg"
    ];

    let currentPhoto = 0;

    let photoFocused = false;

    let musicStarted = false;

    let songPlaying = false;

    let firstGameSolved = false;

    let secondGameSolved = false;

    let finalStarted = false;

    let heartInterval = null;


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    function hideAllScenes() {

        const scenes = [
            introScene,
            gameScene,
            photoScene,
            photoArrange,
            videoScene,
            letterScene,
            finalScene
        ];

        scenes.forEach(scene => {

            if (!scene) return;

            scene.classList.remove("active");

        });
    }


    function showScene(scene) {

        if (!scene) return;

        hideAllScenes();

        scene.classList.add("active");

        window.scrollTo(0, 0);
    }


    /* =====================================================
       TRANSITION
    ===================================================== */

    function playTransition(
        type = "dark",
        callback = null
    ) {

        if (!transitionOverlay) {

            if (callback) callback();

            return;
        }

        transitionOverlay.classList.remove(
            "dark-transition",
            "paper-transition",
            "active"
        );

        void transitionOverlay.offsetWidth;

        transitionOverlay.classList.add("active");

        if (type === "paper") {

            transitionOverlay.classList.add(
                "paper-transition"
            );

        } else {

            transitionOverlay.classList.add(
                "dark-transition"
            );
        }


        setTimeout(() => {

            if (callback) {
                callback();
            }

        }, 450);


        setTimeout(() => {

            transitionOverlay.classList.remove(
                "active",
                "dark-transition",
                "paper-transition"
            );

        }, 1000);
    }


    /* =====================================================
       START BACKGROUND MUSIC (ME intro song)
    ===================================================== */

    function startBackgroundMusic() {

        if (!bgMusic) return;

        if (musicStarted) return;

        musicStarted = true;

        bgMusic.volume = 0.55;

        const promise = bgMusic.play();

        if (promise) {

            promise.catch(() => {

                musicStarted = false;

            });

        }
    }

    function stopBackgroundMusic() {

        if (!bgMusic) return;

        bgMusic.pause();

    }


    /* =====================================================
       PHOTO SECTION MUSIC (separate track — NEW)
    ===================================================== */

    function startPhotoMusic() {

        if (!photoMusic) return;

        photoMusic.currentTime = 0;
        photoMusic.volume = 0.6;

        const promise = photoMusic.play();

        if (promise) {
            promise.catch(() => {
                /* Browser may block autoplay; a later tap unlocks it. */
            });
        }
    }

    function stopPhotoMusic() {

        if (!photoMusic) return;

        photoMusic.pause();

    }


    /* =====================================================
       LETTER SCENE MUSIC (separate track — NEW)
    ===================================================== */

    function startLetterMusic() {

        if (!letterMusic) return;

        letterMusic.volume = 0.72;

        const promise = letterMusic.play();

        if (promise) {
            promise
                .then(() => {
                    songPlaying = true;
                    if (playSong) {
                        playSong.innerHTML =
                            '<span class="song-icon">Ⅱ</span>' +
                            '<span>PAUSE MY SONG</span>';
                    }
                })
                .catch(() => {});
        }
    }

    function stopLetterMusic() {

        if (!letterMusic) return;

        letterMusic.pause();

        songPlaying = false;

        if (playSong) {
            playSong.innerHTML =
                '<span class="song-icon">♫</span>' +
                '<span>PLAY MY SONG</span>';
        }
    }


    /* =====================================================
       INTRO
    ===================================================== */

    function openIntroGame() {

        startBackgroundMusic();

        playTransition("dark", () => {

            showScene(gameScene);

        });
    }


    if (enterIntro) {

        enterIntro.addEventListener(
            "click",
            openIntroGame
        );
    }


    /* =====================================================
       FIRST GAME
    ===================================================== */

    let correctSignal =
        Math.floor(Math.random() * 3) + 1;


    function solveFirstGame(card) {

        if (firstGameSolved) return;

        const selected =
            Number(card.dataset.signal);


        /* WRONG */

        if (selected !== correctSignal) {

            card.classList.remove("wrong");

            void card.offsetWidth;

            card.classList.add("wrong");

            setTimeout(() => {

                card.classList.remove("wrong");

            }, 500);

            return;
        }


        /* CORRECT */

        firstGameSolved = true;

        card.classList.add("correct");

        signalCards.forEach(otherCard => {

            if (otherCard !== card) {

                otherCard.style.opacity = "0.22";
                otherCard.style.pointerEvents = "none";

            }

        });


        setTimeout(() => {

            if (gameSuccess) {

                gameSuccess.classList.add("visible");

            }

        }, 550);
    }


    signalCards.forEach(card => {

        card.addEventListener(
            "click",
            () => solveFirstGame(card)
        );

    });


    /* =====================================================
       CONTINUE TO PHOTOS
       — stops the ME intro song and starts the dedicated
         photo-section song right as the photo scene opens.
    ===================================================== */

    if (continueToPhotos) {

        continueToPhotos.addEventListener(
            "click",
            () => {

                playTransition("paper", () => {

                    showScene(photoScene);

                    currentPhoto = 0;

                    photoFocused = false;

                    loadPhoto(0);

                    startHeartFlow();

                    stopBackgroundMusic();

                    startPhotoMusic();

                });

            }
        );
    }


    /* =====================================================
       PHOTO SECTION
       5 PHOTOS
       CLICK → FOCUS
       CLICK AGAIN → NEXT
    ===================================================== */

    function loadPhoto(index) {

        if (!memoryPhoto) return;

        if (index < 0) index = 0;

        if (index >= photoList.length) {

            finishPhotoSection();

            return;
        }

        currentPhoto = index;

        photoFocused = false;

        memoryPhoto.style.opacity = "0";

        memoryPhoto.style.transform =
            "scale(.96)";

        setTimeout(() => {

            memoryPhoto.src =
                photoList[index];

            memoryPhoto.onload = () => {

                memoryPhoto.style.transition =
                    "opacity .65s ease, transform .65s ease";

                memoryPhoto.style.opacity = "1";

                memoryPhoto.style.transform =
                    "scale(1)";

            };

            /* NEW — if the file 404s (or otherwise fails to load)
               this logs exactly which path failed, and reveals the
               broken-image icon instead of leaving the photo
               invisible forever with no way to tell why. */
            memoryPhoto.onerror = () => {

                console.error(
                    "🖼️ ME PHOTO FAILED TO LOAD:",
                    photoList[index]
                );

                memoryPhoto.style.transition =
                    "opacity .3s ease";

                memoryPhoto.style.opacity = "1";

            };

        }, 120);


        if (photoCounter) {

            photoCounter.textContent =
                `0${index + 1} / 05`;

        }


        if (photoHint) {

            photoHint.textContent =
                "CLICK THE MEMORY";

        }


        if (photoCard) {

            photoCard.classList.remove(
                "photo-focused"
            );

        }
    }


    function focusCurrentPhoto() {

        photoFocused = true;

        if (photoCard) {

            photoCard.classList.add(
                "photo-focused"
            );

            photoCard.style.transform =
                "rotate(0deg) scale(1.04)";

            photoCard.style.boxShadow =
                "0 40px 90px rgba(55,25,20,.35)";
        }


        if (photoHint) {

            photoHint.textContent =
                currentPhoto === photoList.length - 1
                    ? "CLICK AGAIN TO CONTINUE"
                    : "CLICK AGAIN FOR THE NEXT MEMORY";
        }
    }


    function nextPhoto() {

        if (photoCard) {

            photoCard.style.transform =
                "rotate(1deg) scale(.94)";

            photoCard.style.opacity = "0";
        }


        setTimeout(() => {

            currentPhoto++;

            if (
                currentPhoto >=
                photoList.length
            ) {

                finishPhotoSection();

                return;
            }

            loadPhoto(currentPhoto);

            if (photoCard) {

                setTimeout(() => {

                    photoCard.style.opacity =
                        "1";

                }, 80);

            }

        }, 350);
    }


    function handlePhotoClick() {

        if (!photoFocused) {

            focusCurrentPhoto();

        } else {

            nextPhoto();

        }
    }


    if (photoCard) {

        photoCard.addEventListener(
            "click",
            handlePhotoClick
        );
    }


    /* =====================================================
       HEART FLOW
    ===================================================== */

    function createHeart() {

        if (!heartFlow) return;

        const heart =
            document.createElement("span");

        heart.className = "flow-heart";

        heart.textContent =
            Math.random() > .5
                ? "♥"
                : "♡";


        const size =
            13 + Math.random() * 18;

        const left =
            Math.random() * 100;

        const duration =
            6 + Math.random() * 6;


        heart.style.left =
            `${left}%`;

        heart.style.fontSize =
            `${size}px`;

        heart.style.animationDuration =
            `${duration}s`;

        heart.style.opacity =
            `${.25 + Math.random() * .35}`;


        heartFlow.appendChild(heart);


        setTimeout(() => {

            heart.remove();

        }, duration * 1000 + 500);
    }


    function startHeartFlow() {

        stopHeartFlow();

        for (let i = 0; i < 10; i++) {

            setTimeout(
                createHeart,
                i * 250
            );
        }

        heartInterval =
            setInterval(
                createHeart,
                650
            );
    }


    function stopHeartFlow() {

        if (heartInterval) {

            clearInterval(heartInterval);

            heartInterval = null;

        }
    }


    /* =====================================================
       PHOTO → ARRANGEMENT
    ===================================================== */

    function finishPhotoSection() {

        stopHeartFlow();

        playTransition("paper", () => {

            showScene(photoArrange);

            prepareSecondGame();

        });
    }


    /* =====================================================
       SECOND GAME
    ===================================================== */

    let correctLight = 1;


    function prepareSecondGame() {

        secondGameSolved = false;

        correctLight =
            Math.floor(Math.random() * 3) + 1;


        unlockLights.forEach(light => {

            light.classList.remove(
                "wrong",
                "correct"
            );

            light.style.pointerEvents =
                "auto";

            light.style.opacity = "1";

        });

    }


    function solveSecondGame(light) {

        if (secondGameSolved) return;

        const selected =
            Number(light.dataset.light);


        if (selected !== correctLight) {

            light.classList.remove("wrong");

            void light.offsetWidth;

            light.classList.add("wrong");

            setTimeout(() => {

                light.classList.remove("wrong");

            }, 500);

            return;
        }


        secondGameSolved = true;

        light.classList.add("correct");


        unlockLights.forEach(other => {

            if (other !== light) {

                other.style.opacity =
                    "0.2";

                other.style.pointerEvents =
                    "none";

            }

        });


        setTimeout(() => {

            openVideo();

        }, 850);
    }


    unlockLights.forEach(light => {

        light.addEventListener(
            "click",
            () => solveSecondGame(light)
        );

    });


    /* =====================================================
       VIDEO
       — stops the photo-section song here too, so nothing
         from an earlier scene bleeds into the video.
    ===================================================== */

    function openVideo() {

        playTransition("dark", () => {

            showScene(videoScene);

            stopBackgroundMusic();

            stopPhotoMusic();

            if (mainVideo) {

                mainVideo.currentTime = 0;

                const playPromise =
                    mainVideo.play();

                if (playPromise) {

                    playPromise.catch(() => {});

                }
            }

        });
    }


    if (continueToLetter) {

        continueToLetter.addEventListener(
            "click",
            openLetter
        );
    }


    /* =====================================================
       VIDEO → LETTER
    ===================================================== */

    function openLetter() {

        if (mainVideo) {

            mainVideo.pause();

        }


        playTransition("paper", () => {

            showScene(letterScene);

            prepareLetter();

        });
    }


    /* =====================================================
       LETTER
    ===================================================== */

    let letterPrepared = false;


    function prepareLetter() {

        if (letterPrepared) return;

        letterPrepared = true;


        /*
         * Give the page time to settle before
         * enabling the final button.
         */

        if (turnPage) {

            turnPage.style.opacity = "0";

            turnPage.style.pointerEvents =
                "none";


            setTimeout(() => {

                turnPage.style.transition =
                    "opacity .7s ease";

                turnPage.style.opacity = "1";

                turnPage.style.pointerEvents =
                    "auto";

            }, 800);
        }
    }


    /* =====================================================
       SONG — now plays the dedicated letterMusic track
       instead of reusing bgMusic (which by this point in the
       flow has already been stopped and replaced twice).
    ===================================================== */

    function toggleSong() {

        if (!letterMusic) return;


        if (songPlaying) {

            stopLetterMusic();

            return;
        }


        startLetterMusic();

    }


    if (playSong) {

        playSong.addEventListener(
            "click",
            toggleSong
        );

    }


    /* =====================================================
       SONG ENDED
       (letterMusic loops, so "ended" won't normally fire —
       kept here as a safety net in case loop is ever removed)
    ===================================================== */

    if (letterMusic) {

        letterMusic.addEventListener(
            "ended",
            () => {

                songPlaying = false;

                if (playSong) {

                    playSong.innerHTML =
                        '<span class="song-icon">♫</span>' +
                        '<span>PLAY MY SONG</span>';

                }

            }
        );

    }


    /* =====================================================
       LETTER → FINAL
       — the letter song must keep playing for as long as this
         page is open, and stop the instant "TURN THE PAGE" is
         clicked, right before the final scene begins.
    ===================================================== */

    if (turnPage) {

        turnPage.addEventListener(
            "click",
            () => {

                if (finalStarted) return;

                finalStarted = true;

                stopLetterMusic();

                if (bgMusic) {

                    bgMusic.pause();

                }

                playTransition("dark", () => {

                    showScene(finalScene);

                    startFinalSequence();

                });

            }
        );

    }
    function startFinalSequence() {

        if (birthdayMessage) {

            birthdayMessage.classList.remove(
                "visible"
            );

        }

        if (voiceIndicator) {

            voiceIndicator.classList.remove(
                "visible"
            );

        }


        createFinalFireworks();

    }


    /* =====================================================
       FIREWORK / CRACKER SYSTEM
       ===================================================== */

    let crackerAudioNodes = [];


    function createCrackerSound() {

        /*
         * Synthetic sound created with Web Audio.
         * No external audio file needed.
         */

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) return;


        const ctx =
            new AudioContext();


        const now =
            ctx.currentTime;


        /* noise */

        const buffer =
            ctx.createBuffer(
                1,
                ctx.sampleRate * .18,
                ctx.sampleRate
            );


        const data =
            buffer.getChannelData(0);


        for (
            let i = 0;
            i < data.length;
            i++
        ) {
            const decay =
                1 - i / data.length;
            data[i] =
                (Math.random() * 2 - 1)
                * decay
                * decay;

        }


        const noise =
            ctx.createBufferSource();

        noise.buffer = buffer;


        const filter =
            ctx.createBiquadFilter();

        filter.type =
            "highpass";

        filter.frequency.value =
            900;


        const gain =
            ctx.createGain();

        gain.gain.setValueAtTime(
            .0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            .55,
            now + .008
        );

        gain.gain.exponentialRampToValueAtTime(
            .0001,
            now + .18
        );


        noise
            .connect(filter)
            .connect(gain)
            .connect(ctx.destination);


        noise.start(now);

        noise.stop(now + .2);


        crackerAudioNodes.push({
            ctx,
            noise,
            gain
        });


        setTimeout(() => {

            try {

                ctx.close();

            } catch (error) {}

        }, 500);

    }


    function createBurst(x, y, scale = 1) {

        if (!fireworks) return;


        const burst =
            document.createElement("div");

        burst.className =
            "firework explode";


        burst.style.left =
            `${x}%`;

        burst.style.top =
            `${y}%`;

        burst.style.transform =
            `translate(-50%, -50%) scale(${scale})`;


        fireworks.appendChild(burst);


        /*
         * Add many individual particles
         * to make the burst less flat.
         */

        const particleCount = 30;


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const particle =
                document.createElement("span");


            particle.style.position =
                "absolute";

            particle.style.left =
                "50%";

            particle.style.top =
                "50%";

            particle.style.width =
                "2px";

            particle.style.height =
                `${45 + Math.random() * 100}px`;

            particle.style.transformOrigin =
                "0 0";

            particle.style.background =
                "linear-gradient(to bottom, rgba(255,255,255,.95), rgba(255,130,170,.15), transparent)";
            particle.style.boxShadow =
                "0 0 6px rgba(255,190,210,.8)";

            particle.style.opacity =
                "0";


            const angle =
                (360 / particleCount) * i
                + (Math.random() * 8 - 4);


            const distance =
                .75 + Math.random() * .65;


            particle.animate(

                [
                    {
                        opacity: 0,

                        transform:
                            `rotate(${angle}deg) scaleY(.05)`
                    },

                    {
                        opacity: 1,

                        transform:
                            `rotate(${angle}deg) scaleY(${distance})`
                    },

                    {
                        opacity: .7,

                        transform:
                            `rotate(${angle}deg) scaleY(${distance * 1.1})`
                    },

                    {
                        opacity: 0,

                        transform:
                            `rotate(${angle}deg) scaleY(${distance * 1.25})`
                    }
                ],

                {
                    duration:
                        1000 + Math.random() * 500,

                    easing:
                        "cubic-bezier(.12,.75,.25,1)",

                    fill: "forwards"
                }

            );


            burst.appendChild(particle);

        }


        createCrackerSound();


        setTimeout(() => {

            burst.remove();

        }, 1800);

    }


    /* =====================================================
       FINAL FIREWORK TIMELINE
       ===================================================== */

    function createFinalFireworks() {

        /*
         * CENTER FIRST
         */

        setTimeout(() => {

            createBurst(
                50,
                43,
                1.1
            );

        }, 250);


        /*
         * LEFT
         */

        setTimeout(() => {

            createBurst(
                27,
                31,
                .75
            );

        }, 1050);


        /*
         * RIGHT
         */

        setTimeout(() => {

            createBurst(
                73,
                31,
                .82
            );

        }, 1750);
        /*
         * LOWER LEFT
         */

        setTimeout(() => {

            createBurst(
                38,
                58,
                .6
            );

        }, 2450);


        /*
         * LOWER RIGHT
         */

        setTimeout(() => {

            createBurst(
                62,
                58,
                .65
            );

        }, 3000);


        /*
         * BIG CENTER FINALE
         */

        setTimeout(() => {

            createBurst(
                50,
                40,
                1.35
            );

        }, 3500);


        /*
         * Stop cracker sounds BEFORE
         * birthday message appears.
         */

        setTimeout(() => {

            stopAllCrackerSounds();

        }, 4250);


        /*
         * HAPPY BIRTHDAY appears
         */

        setTimeout(() => {

            showBirthdayMessage();

        }, 4400);


        /*
         * Voice starts AFTER crackers.
         */

        setTimeout(() => {

            playBirthdayVoice();

        }, 5200);

    }


    /* =====================================================
       STOP CRACKER AUDIO
    ===================================================== */

    function stopAllCrackerSounds() {

        crackerAudioNodes.forEach(item => {

            try {

                item.gain.gain.cancelScheduledValues(
                    item.ctx.currentTime
                );

                item.gain.gain.setValueAtTime(
                    .0001,
                    item.ctx.currentTime
                );

                item.noise.stop();

            } catch (error) {}

        });


        crackerAudioNodes = [];

    }


    /* =====================================================
       BIRTHDAY MESSAGE
    ===================================================== */

    function showBirthdayMessage() {

        if (!birthdayMessage) return;

        birthdayMessage.classList.add(
            "visible"
        );

    }


    /* =====================================================
       FINAL VOICE
    ===================================================== */

    function playBirthdayVoice() {

        if (!myVoice) return;


        if (voiceIndicator) {

            voiceIndicator.classList.add(
                "visible"
            );

        }


        myVoice.currentTime = 0;

        myVoice.volume = 1;


        const promise =
            myVoice.play();


        if (promise) {

            promise.catch(() => {

                /*
                 * Browser may block audio if
                 * user interaction was lost.
                 */

            });

        }


        myVoice.addEventListener(
            "ended",
            () => {

                if (voiceIndicator) {

                    voiceIndicator.classList.remove(
                        "visible"
                    );

                }

            },
            { once: true }
        );

    }


    /* =====================================================
       IMAGE PRELOAD
    ===================================================== */

    function preloadImages() {

        photoList.forEach(src => {

            const image =
                new Image();

            /* NEW — logs exactly which of the 5 photo paths fails
               to load, so broken filenames are easy to spot in the
               console instead of just showing up as blank. */
            image.onerror = () => {
                console.error("🖼️ ME PHOTO PRELOAD FAILED:", src);
            };

            image.src = src;

        });


        [
            "assets/me2.jpg",
            "assets/me4.jpg"
        ].forEach(src => {

            const image =
                new Image();

            image.src = src;

        });

    }


    /* =====================================================
       VIDEO PRELOAD
    ===================================================== */

    function preloadVideo() {

        if (!mainVideo) return;

        mainVideo.preload =
            "metadata";

    }


    /* =====================================================
       AUDIO PRELOAD
    ===================================================== */

    function preloadAudio() {

        if (bgMusic) {

            bgMusic.preload =
                "auto";

        }

        if (photoMusic) {

            photoMusic.preload =
                "auto";

        }

        if (letterMusic) {

            letterMusic.preload =
                "auto";

        }

        if (myVoice) {

            myVoice.preload =
                "auto";

        }

    }


    /* =====================================================
       KEYBOARD SUPPORT
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Enter on intro
             */

            if (
                event.key === "Enter" &&
                introScene &&
                introScene.classList.contains("active")
            ) {

                openIntroGame();

            }


            /*
             * Escape pauses media
             */

            if (event.key === "Escape") {

                if (mainVideo) {

                    mainVideo.pause();

                }

                if (bgMusic) {

                    bgMusic.pause();

                }

                if (photoMusic) {

                    photoMusic.pause();

                }

                if (letterMusic) {

                    letterMusic.pause();

                }

                if (myVoice) {

                    myVoice.pause();

                }

            }

        }
    ); document.addEventListener(
        "contextmenu",
        event => {
                if (
                event.target &&
                event.target.tagName === "VIDEO"
            ) {
                return;
            }
            event.preventDefault();
        }
    );
   document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.visibilityState ===
                "hidden"
            ) {
                if (mainVideo) {

                    mainVideo.pause();

                }
            }
        }
    );
    preloadImages();
    preloadVideo();
    preloadAudio();
    hideAllScenes();
    window.startMeSection = function () {
        showScene(introScene);
    };
});