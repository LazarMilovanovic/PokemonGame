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

//////////////////////////////
//  HIDE START GAME OVERLAY //
/////////////////////////////
startBtn.onclick = () => (startScreen.style.visibility = "hidden");

highScoreText.textContent = JSON.parse(localStorage.getItem("high-score")) || 0;

////////////////////////
// GET FIRST POKEMON //
//////////////////////
async function getFirstRandomPokemon() {
  try {
    let randomPokemon = Math.floor(Math.random() * 1024) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
    const data = await response.json();
    console.log("First Pokemon", data.base_experience); //For testing purpose
    firstPokemonTitle.textContent = data.name[0].toUpperCase() + data.name.slice(1);
    firstPokemonImg.src = data.sprites.other.home.front_default;
    firstPokemonStrenght.textContent = data.base_experience;
  } catch (err) {
    console.error(err);
  }
}
getFirstRandomPokemon();

/////////////////////////
// GET SECOND POKEMON //
///////////////////////
async function getSecondRandomPokemon() {
  try {
    let randomPokemon = Math.floor(Math.random() * 1024) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
    const data = await response.json();
    console.log("Second Pokemon", data.base_experience); //For testing purpose
    secondPokemonTitle.textContent = data.name[0].toUpperCase() + data.name.slice(1);
    secondPokemonImg.src = data.sprites.other.home.front_default;
    secondPokemonStrenght.textContent = data.base_experience;
  } catch (err) {
    console.error(err);
  }
}
getSecondRandomPokemon();

//////////////////
// SCORE COUNT //
////////////////
let scoreIncrease = 0;
function scoreCorrectAnswer() {
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

////////////////////////////////////
// SWITCH FIRST POKEMON ON 5 WINS //
///////////////////////////////////
let winCountFirstPoke = 0;
function winCountFirstPokemon() {
  winCountFirstPoke++;
  console.log("First pokemon wins in a row", winCountFirstPoke); //For testing purpose
  if (winCountFirstPoke === 5) {
    getFirstRandomPokemon();
    winCountFirstPoke = 0;
    firstPokemonStrenght.classList.remove("pokemon-strenght-reveal");
    console.log("Changed first pokemon"); //For testing purpose
  }
}

//////////////////////////////////////
// SWITCH SECOND POKEMON ON 5 WINS //
////////////////////////////////////
let winCountSecondPoke = 0;
function winCountSecondPokemon() {
  winCountSecondPoke++;
  console.log("Second pokemon wins in a row", winCountSecondPoke); //For testing purpose
  if (winCountSecondPoke === 5) {
    getSecondRandomPokemon();
    winCountSecondPoke = 0;
    secondPokemonStrenght.classList.remove("pokemon-strenght-reveal");
    console.log("Changed second pokemon"); //For testing purpose
  }
}

/////////////////////////////////
// CLICK\CHOOSE FIRST POKEMON //
///////////////////////////////
firstPokemonImg.onclick = () => {
  if (Number(firstPokemonStrenght.textContent) >= Number(secondPokemonStrenght.textContent)) {
    firstPokemonStrenght.classList.add("pokemon-strength-reveal");
    secondPokemonStrenght.classList.add("pokemon-strength-reveal");
    firstPokemonImg.classList.add("correct-answer", "disable-click");
    setTimeout(() => {
      secondPokemonStrenght.classList.remove("pokemon-strength-reveal");
      getSecondRandomPokemon();
      scoreCorrectAnswer();
      winCountFirstPokemon();
      winCountSecondPoke = 0;
      firstPokemonImg.classList.remove("correct-answer", "disable-click");
    }, 2000);
  } else {
    firstPokemonStrenght.classList.add("pokemon-strength-reveal");
    secondPokemonStrenght.classList.add("pokemon-strength-reveal");
    firstPokemonImg.classList.add("incorrect-answer", "disable-click");
    setTimeout(() => {
      setHighScore();
      score.textContent = 0;
      scoreIncrease = 0;
      startScreen.style.visibility = "visible";
      getFirstRandomPokemon();
      getSecondRandomPokemon();
      firstPokemonStrenght.classList.remove("pokemon-strength-reveal");
      secondPokemonStrenght.classList.remove("pokemon-strength-reveal");
      firstPokemonImg.classList.remove("incorrect-answer", "disable-click");
      console.clear(); //For testing purpose
    }, 2000);
  }
};

//////////////////////////////////
// CLICK\CHOOSE SECOND POKEMON //
////////////////////////////////
secondPokemonImg.onclick = () => {
  if (Number(secondPokemonStrenght.textContent) >= Number(firstPokemonStrenght.textContent)) {
    firstPokemonStrenght.classList.add("pokemon-strength-reveal");
    secondPokemonStrenght.classList.add("pokemon-strength-reveal");
    secondPokemonImg.classList.add("correct-answer", "disable-click");

    setTimeout(() => {
      firstPokemonStrenght.classList.remove("pokemon-strength-reveal");
      getFirstRandomPokemon();
      scoreCorrectAnswer();
      winCountSecondPokemon();
      winCountFirstPoke = 0;
      secondPokemonImg.classList.remove("correct-answer", "disable-click");
    }, 2000);
  } else {
    firstPokemonStrenght.classList.add("pokemon-strength-reveal");
    secondPokemonStrenght.classList.add("pokemon-strength-reveal");
    secondPokemonImg.classList.add("incorrect-answer", "disable-click");
    setTimeout(() => {
      setHighScore();
      score.textContent = 0;
      scoreIncrease = 0;
      startScreen.style.visibility = "visible";
      getFirstRandomPokemon();
      getSecondRandomPokemon();
      secondPokemonStrenght.classList.remove("pokemon-strength-reveal");
      firstPokemonStrenght.classList.remove("pokemon-strength-reveal");
      secondPokemonImg.classList.remove("incorrect-answer", "disable-click");
      console.clear(); //For testing purpose
    }, 2000);
  }
};
