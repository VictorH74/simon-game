
const buttons = ['blue', 'green', 'red', 'yellow'];

const defaultVolume = 0.3;

// Audios
const blueAudio = new Audio("sounds/blue.mp3");
blueAudio.volume = defaultVolume;
const greenAudio = new Audio("sounds/green.mp3");
greenAudio.volume = defaultVolume;
const redAudio = new Audio("sounds/red.mp3");
redAudio.volume = defaultVolume;
const yellowAudio = new Audio("sounds/yellow.mp3");
yellowAudio.volume = defaultVolume;
const wrongAudio = new Audio("sounds/wrong.mp3");
wrongAudio.volume = defaultVolume;

const audios = {
    "blue": blueAudio,
    "green": greenAudio,
    "red": redAudio,
    "yellow": yellowAudio
}

var buttonsMemory = [];
var index = 0;
var round = 1;
var buttonsListened = false;
var indexSequence = 0
var interval;

// COMEÇAR JOGO
var title = $("#level-title")
var listerTitle = title.on('click', function(){
    start();
});


// RESETAR VARIAVEIS
function reset(){
    index = 0;
    round = 1;
    buttonsMemory = [];
    indexSequence = 0
    clearInterval(interval);
}

// TOCAR SOM E ALTERAR COR DO BOTÃO SELECIONADO *Bug se o mesmo botão for clicado 2 vezes muito rapido*
function playSound(buttonColor){
    audios[buttonColor].play();

    $(`#${buttonColor}`).addClass("pressed");
    setTimeout(()=>{ $(`#${buttonColor}`).removeClass("pressed");}, 300);
}


function playSequence(){
    playSound(buttonsMemory[indexSequence]);
    indexSequence++;

    if(indexSequence === buttonsMemory.length){clearInterval(interval); indexSequence = 0}
}

// ESCOLHER POSIÇÃO ALEATÓRIA DO ARRAY DE CORES PARA ARMAZENAR NO ARRAY 'buttonsMemory'
function randomButton(){

    let currentButtonNumber = Math.floor(Math.random() * 4);
    buttonsMemory.push(buttons[currentButtonNumber]);

    interval = setInterval(playSequence, 700);
}

// VERIFICAR POSIÇÃO DO BOTÃO SELECIONADO COM A SEQUÊNCIA DE CORES DE BOTÕES NO ARRAY 'buttonsMemory'
function btnPressed(){
    if(this.className.split(' ')[1] === buttonsMemory[index]){
        // JOGADOR ACERTOU A ORDEM
        index += 1;
        let btnPressed = this.className.split(' ')[1];
        playSound(btnPressed);
        if(index === buttonsMemory.length){
            index = 0;
            round += 1;
            $('#level-title').text(`Round ${round}`);
            setTimeout(randomButton, 800);
        } 
    }else{
        // JOGADOR PERDEU
        reset();
        title.addClass("level-title-hr");
        title.text(`Clique aqui para reiniciar`);
        wrongAudio.play();

        let body = $("body").addClass("game-over");
        setTimeout(() => {
            body.removeClass("game-over");
        }, 300);
    }
}

// INICIAR FUNÇÕES PARA RODAR O JOGO
function start(){
    reset();
    title.text(`Round ${round}`);
    title.removeClass("level-title-hr");

    if(buttonsListened === false){
        $('.btn').on('click', btnPressed);
        buttonsListened = true;
    }
    setTimeout(randomButton, 700);
}
