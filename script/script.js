const firstPokemonTitle = document.getElementById("first-pokemon-title");
const firstPokemonImg = document.getElementById("first-pokemon-img");
const firstPokemonStrenght = document.getElementById("first-pokemon-strenght");
const secondPokemonTitle = document.getElementById("second-pokemon-title");
const secondPokemonImg = document.getElementById("second-pokemon-img");
const secondPokemonStrenght = document.getElementById("second-pokemon-strenght");
const highScoreText = document.getElementById("high-score");
const score = document.getElementById("score");
const startScreen = document.getElementById("start-game");
const startBtn = document.getElementById("start-btn");
const gameComments = document.getElementById("game-comments");

highScoreText.textContent = JSON.parse(localStorage.getItem("high-score")) || 0;

//////////////////////////////
//  HIDE START GAME OVERLAY //
/////////////////////////////
(startBtn, startScreen).onclick = () => {
  startScreen.classList.remove("show-overlay");
  startScreen.classList.add("hide-overlay");
};

/////////////////////////
// GET RANDOM POKEMON //
///////////////////////
async function getRandomPokemon(pokeImg, pokeTitle, pokeStrenght) {
  try {
    let randomPokemon = Math.floor(Math.random() * 1024) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
    const data = await response.json();

    pokeImg.src = data.sprites.other.home.front_default;
    pokeStrenght.textContent = data.base_experience;
    const pokeName = data.name[0].toUpperCase() + data.name.slice(1);
    pokeTitle.textContent = pokeName.replaceAll("-", " ");
    console.log(pokeName, data.base_experience);
  } catch (err) {
    console.error(err);
  }
}
getRandomPokemon(firstPokemonImg, firstPokemonTitle, firstPokemonStrenght);
getRandomPokemon(secondPokemonImg, secondPokemonTitle, secondPokemonStrenght);

//////////////////
// SCORE COUNT //
////////////////
let scoreIncrease = 0;
function correctAnswerScore() {
  scoreIncrease++;
  score.textContent = scoreIncrease;
}

///////////////////////
// HIGH SCORE COUNT //
/////////////////////
function setHighScore() {
  let highScore = JSON.parse(localStorage.getItem("high-score")) || 0;
  if (Number(score.textContent) > highScore) {
    highScore = Number(score.textContent);
    localStorage.setItem("high-score", JSON.stringify(highScore));
    highScoreText.textContent = highScore;
  }
}

///////////////////////////////
// SWITCH POKEMON ON 5 WINS //
/////////////////////////////
let winFirstPoke = 0;
let winSecondPoke = 0;
function switchOnFiveWins(arg) {
  arg === 1 ? (winFirstPoke++, (winSecondPoke = 0)) : (winSecondPoke++, (winFirstPoke = 0));

  if (winFirstPoke === 5) {
    getRandomPokemon(firstPokemonImg, firstPokemonTitle, firstPokemonStrenght);
    firstPokemonStrenght.classList.remove("pokemon-strength-reveal");
    winFirstPoke = 0;
  } else if (winSecondPoke === 5) {
    getRandomPokemon(secondPokemonImg, secondPokemonTitle, secondPokemonStrenght);
    secondPokemonStrenght.classList.remove("pokemon-strength-reveal");
    winSecondPoke = 0;
  }
}

function afterWinSetTimeout(arg) {
  setTimeout(() => {
    arg === 1 ? firstPokemonStrenght.classList.remove("pokemon-strength-reveal") : secondPokemonStrenght.classList.remove("pokemon-strength-reveal");
    arg === 1 ? getRandomPokemon(firstPokemonImg, firstPokemonTitle, firstPokemonStrenght) : getRandomPokemon(secondPokemonImg, secondPokemonTitle, secondPokemonStrenght);
    correctAnswerScore();
    arg === 1 ? switchOnFiveWins() : switchOnFiveWins(1);
    arg === 1 ? secondPokemonImg.classList.remove("correct-answer") : firstPokemonImg.classList.remove("correct-answer");
    firstPokemonImg.classList.remove("disable-click");
    secondPokemonImg.classList.remove("disable-click");
    vsComment();
  }, 2000);
}

///////////////////////////
// CLICK\CHOOSE POKEMON //
/////////////////////////
function chosePokemon(num) {
  if (num === 1) {
    if (Number(firstPokemonStrenght.textContent) >= Number(secondPokemonStrenght.textContent)) {
      winOutcome(true);
      afterWinSetTimeout(2);
    } else {
      afterLossComment(true);
    }
  } else if (num === 2) {
    if (Number(secondPokemonStrenght.textContent) >= Number(firstPokemonStrenght.textContent)) {
      winOutcome();
      afterWinSetTimeout(1);
    } else {
      afterLossComment();
    }
  }
}

////////////////////
// GAME COMMENTS //
//////////////////
function vsComment() {
  let roundComment = document.createElement("li");
  setTimeout(() => {
    roundComment.textContent = `${firstPokemonTitle.textContent} vs ${secondPokemonTitle.textContent}`;
  }, 500);
  gameComments.append(roundComment);
}
vsComment();

function winOutcome(arg) {
  firstPokemonStrenght.classList.add("pokemon-strength-reveal");
  secondPokemonStrenght.classList.add("pokemon-strength-reveal");

  arg ? firstPokemonImg.classList.add("correct-answer") : secondPokemonImg.classList.add("correct-answer");
  firstPokemonImg.classList.add("disable-click");
  secondPokemonImg.classList.add("disable-click");

  let winnerComment = document.createElement("li");
  let winPokemon = document.createElement("span");
  winPokemon.classList.add("win-round");
  let lossPokemon = document.createElement("span");
  lossPokemon.classList.add("loss-round");

  arg
    ? ((winPokemon.textContent = `${firstPokemonTitle.textContent} (${firstPokemonStrenght.textContent})`),
      (lossPokemon.textContent = `${secondPokemonTitle.textContent} (${secondPokemonStrenght.textContent})`))
    : ((lossPokemon.textContent = `${firstPokemonTitle.textContent} (${firstPokemonStrenght.textContent})`),
      (winPokemon.textContent = `${secondPokemonTitle.textContent} (${secondPokemonStrenght.textContent})`));

  arg ? winnerComment.append(winPokemon, " vs ", lossPokemon) : winnerComment.append(lossPokemon, " vs ", winPokemon);
  gameComments.append(winnerComment);
}

//////////////////////////
// COMMENTS AFTER LOSS //
////////////////////////
function afterLossComment(arg) {
  firstPokemonStrenght.classList.add("pokemon-strength-reveal");
  secondPokemonStrenght.classList.add("pokemon-strength-reveal");
  arg
    ? (firstPokemonImg.classList.add("incorrect-answer", "disable-click"), secondPokemonImg.classList.add("disable-click"))
    : (secondPokemonImg.classList.add("incorrect-answer", "disable-click"), firstPokemonImg.classList.add("disable-click"));
  setTimeout(() => {
    setHighScore();
    score.textContent = 0;
    scoreIncrease = 0;
    startScreen.classList.remove("hide-overlay");
    startScreen.classList.add("show-overlay");
    getRandomPokemon(firstPokemonImg, firstPokemonTitle, firstPokemonStrenght);
    getRandomPokemon(secondPokemonImg, secondPokemonTitle, secondPokemonStrenght);
    firstPokemonStrenght.classList.remove("pokemon-strength-reveal");
    secondPokemonStrenght.classList.remove("pokemon-strength-reveal");
    arg ? firstPokemonImg.classList.remove("incorrect-answer") : secondPokemonImg.classList.remove("incorrect-answer");
    firstPokemonImg.classList.remove("disable-click");
    secondPokemonImg.classList.remove("disable-click");

    gameComments.textContent = "";
    vsComment();
  }, 2000);
}
