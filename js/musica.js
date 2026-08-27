    const musica = document.getElementById("musica");
    const playBtn = document.getElementById("playBtn");

    playBtn.addEventListener("click", () => {
        if (musica.paused) {
            musica.play();
            playBtn.textContent = "❚❚";
        } else {
            musica.pause();
            playBtn.textContent = "▶";
        }
    });

    musica.addEventListener("ended", () => {
        playBtn.textContent = "▶";
    });

