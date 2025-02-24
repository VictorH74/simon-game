const buttonColors = ["blue", "green", "red", "yellow"];

const defaultVolume = 0.3;

const blueBtnSoundPath = "sounds/blue.mp3";
const greenBtnSoundPath = "sounds/green.mp3";
const redBtnSoundPath = "sounds/red.mp3";
const yellowBtnSoundPath = "sounds/yellow.mp3";
const wrongSoundPath = "sounds/wrong.mp3";

const audios = [
  new Audio(blueBtnSoundPath),
  new Audio(greenBtnSoundPath),
  new Audio(redBtnSoundPath),
  new Audio(yellowBtnSoundPath),
  new Audio(wrongSoundPath),
];

for (const audio of audios) {
  audio.preload = "auto";
}

var buttonSequenceListMemory = [];
var currentPressedBtnIndex = 0;
var round = 1;
var buttonsListened = false;
var sequenceIndex = 0;
var interval;

// COMEÇAR JOGO
var title = $("#level-title");
var listerTitle = title.on("click", function () {
  startGame();
});

function resetGame() {
  currentPressedBtnIndex = 0;
  round = 1;
  buttonSequenceListMemory = [];
  sequenceIndex = 0;
  clearInterval(interval);
}

function playSoundByColor(buttonColor) {
  let sound;

  switch (buttonColor) {
    case "blue":
      sound = new Audio(blueBtnSoundPath);
      break;
    case "green":
      sound = new Audio(greenBtnSoundPath);
      break;
    case "red":
      sound = new Audio(redBtnSoundPath);
      break;
    case "yellow":
      sound = new Audio(yellowBtnSoundPath);
      break;
  }

  sound.volume = defaultVolume;
  sound.play();

  $(`#${buttonColor}`).addClass("pressed");
  setTimeout(() => {
    $(`#${buttonColor}`).removeClass("pressed");
  }, 300);
}

function playSequence() {
  playSoundByColor(buttonSequenceListMemory[sequenceIndex]);
  sequenceIndex++;

  if (sequenceIndex === buttonSequenceListMemory.length) finishSequence();
}

function getRandomButton() {
  let randomButtonNumber = Math.floor(Math.random() * 4);
  buttonSequenceListMemory.push(buttonColors[randomButtonNumber]);

  interval = setInterval(playSequence, 700);
}

function pressButton() {
  const rightButton =
    this.className.split(" ")[1] ===
    buttonSequenceListMemory[currentPressedBtnIndex];
  if (rightButton) {
    currentPressedBtnIndex += 1;
    const btnPressedColor = this.className.split(" ")[1];
    playSoundByColor(btnPressedColor);

    if (sequenceCompleted()) {
      currentPressedBtnIndex = 0;
      round += 1;
      $("#level-title").text(`Round ${round}`);

      startSequence();
    }
  } else {
    gameOver();
  }
}

function startSequence() {
  $(".btn").addClass("disabled");
  setTimeout(getRandomButton, 800);
}

function finishSequence() {
  $(".btn").removeClass("disabled");
  clearInterval(interval);
  sequenceIndex = 0;
}

function sequenceCompleted() {
  return currentPressedBtnIndex === buttonSequenceListMemory.length;
}

function gameOver() {
  resetGame();
  title.addClass("level-title-hr");
  title.text(`Clique aqui para reiniciar`);
  const wrongAudio = new Audio(wrongSoundPath);
  wrongAudio.volume = defaultVolume;
  wrongAudio.play();

  let body = $("body").addClass("game-over");
  setTimeout(() => {
    body.removeClass("game-over");
  }, 300);
}

// INICIAR FUNÇÕES PARA RODAR O JOGO
function startGame() {
  resetGame();
  title.text(`Round ${round}`);
  title.removeClass("level-title-hr");

  if (buttonsListened === false) {
    $(".btn").on("click", pressButton);
    buttonsListened = true;
  }
  setTimeout(getRandomButton, 700);
}
