var musicaAmbiente = new Audio("res/musica_ambiente.mp3");
musicaAmbiente.loop = true;


function reproducirMusica() {
    musicaAmbiente.play();
}

function pararMusica() {
    musicaAmbiente.pause();
}

