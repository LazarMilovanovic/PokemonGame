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

////////////////////
// GAME COMMENTS //
//////////////////
let roundComment = document.createElement("li");

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
async function getRandomPokemon(elPassed) {
  try {
    let randomPokemon = Math.floor(Math.random() * 1024) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
    const data = await response.json();
    if (elPassed === 1) {
      console.log("First Pokemon", data.base_experience);
      firstPokemonImg.src = data.sprites.other.home.front_default;
      firstPokemonStrenght.textContent = data.base_experience;
      const firstName = data.name[0].toUpperCase() + data.name.slice(1);
      firstPokemonTitle.textContent = firstName.replaceAll("-", " ");
    } else if (elPassed === 2) {
      console.log("Second Pokemon", data.base_experience);
      secondPokemonImg.src = data.sprites.other.home.front_default;
      secondPokemonStrenght.textContent = data.base_experience;
      const secondName = data.name[0].toUpperCase() + data.name.slice(1);
      secondPokemonTitle.textContent = secondName.replaceAll("-", " ");
    }
  } catch (err) {
    console.error(err);
  }
}
getRandomPokemon(1);
getRandomPokemon(2);

setTimeout(() => {
  roundComment.textContent = `${firstPokemonTitle.textContent} vs ${secondPokemonTitle.textContent}`;
}, 500);
gameComments.append(roundComment);

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
function winCountPokemon(num) {
  if (num === 1) {
    winFirstPoke++;
    if (winFirstPoke === 5) {
      getRandomPokemon(1);
      winFirstPoke = 0;
      firstPokemonStrenght.classList.remove("pokemon-strength-reveal");
    }
  } else if (num === 2) {
    winSecondPoke++;
    if (winSecondPoke === 5) {
      getRandomPokemon(2);
      winSecondPoke = 0;
      secondPokemonStrenght.classList.remove("pokemon-strength-reveal");
    }
  }
}

///////////////////////////
// CLICK\CHOOSE POKEMON //
/////////////////////////
function chosePokemon(num) {
  if (num === 1) {
    if (Number(firstPokemonStrenght.textContent) >= Number(secondPokemonStrenght.textContent)) {
      firstPokemonStrenght.classList.add("pokemon-strength-reveal");
      secondPokemonStrenght.classList.add("pokemon-strength-reveal");
      firstPokemonImg.classList.add("correct-answer", "disable-click");
      secondPokemonImg.classList.add("disable-click");
      // START Comments if First Pokemon Wins
      let firstPokeWinLi = document.createElement("li");
      let firstPokemonWinRound = document.createElement("span");
      firstPokemonWinRound.textContent = `${firstPokemonTitle.textContent} (${firstPokemonStrenght.textContent})`;
      firstPokemonWinRound.classList.add("win-round");
      let secondPokemonLossRound = document.createElement("span");
      secondPokemonLossRound.textContent = `${secondPokemonTitle.textContent} (${secondPokemonStrenght.textContent})`;
      secondPokemonLossRound.classList.add("loss-round");
      firstPokeWinLi.append(firstPokemonWinRound, " vs ", secondPokemonLossRound);
      gameComments.append(firstPokeWinLi);
      // END Comments if First Pokemon Wins
      setTimeout(() => {
        secondPokemonStrenght.classList.remove("pokemon-strength-reveal");
        getRandomPokemon(2);
        correctAnswerScore();
        winCountPokemon(1);
        winSecondPoke = 0;
        firstPokemonImg.classList.remove("correct-answer", "disable-click");
        secondPokemonImg.classList.remove("disable-click");
        // START Comments After First Pokemon Wins
        let newRound = document.createElement("li");
        setTimeout(() => {
          newRound.textContent = `${firstPokemonTitle.textContent} vs ${secondPokemonTitle.textContent}`;
        }, 500);
        gameComments.append(newRound);
        // END Comments After First Pokemon Wins
      }, 2000);
    } else {
      firstPokemonStrenght.classList.add("pokemon-strength-reveal");
      secondPokemonStrenght.classList.add("pokemon-strength-reveal");
      firstPokemonImg.classList.add("incorrect-answer", "disable-click");
      secondPokemonImg.classList.add("disable-click");
      setTimeout(() => {
        setHighScore();
        score.textContent = 0;
        scoreIncrease = 0;
        startScreen.classList.remove("hide-overlay");
        startScreen.classList.add("show-overlay");
        getRandomPokemon(1);
        getRandomPokemon(2);
        firstPokemonStrenght.classList.remove("pokemon-strength-reveal");
        secondPokemonStrenght.classList.remove("pokemon-strength-reveal");
        firstPokemonImg.classList.remove("incorrect-answer", "disable-click");
        secondPokemonImg.classList.remove("disable-click");
        // START Comment After First Looses / Restart Comments
        gameComments.textContent = "";
        setTimeout(() => {
          roundComment.textContent = `${firstPokemonTitle.textContent} vs ${secondPokemonTitle.textContent}`;
        }, 500);
        gameComments.append(roundComment);
        // END Comment After First Looses
      }, 2000);
    }
  } else if (num === 2) {
    if (Number(secondPokemonStrenght.textContent) >= Number(firstPokemonStrenght.textContent)) {
      firstPokemonStrenght.classList.add("pokemon-strength-reveal");
      secondPokemonStrenght.classList.add("pokemon-strength-reveal");
      secondPokemonImg.classList.add("correct-answer", "disable-click");
      firstPokemonImg.classList.add("disable-click");
      // START Comments if Second Wins
      let secondPokeWinLi = document.createElement("li");
      let secondPokemonWinRound = document.createElement("span");
      secondPokemonWinRound.textContent = `${secondPokemonTitle.textContent} (${secondPokemonStrenght.textContent})`;
      secondPokemonWinRound.classList.add("win-round");
      let firstPokemonLossRound = document.createElement("span");
      firstPokemonLossRound.textContent = `${firstPokemonTitle.textContent} (${firstPokemonStrenght.textContent})`;
      firstPokemonLossRound.classList.add("loss-round");
      secondPokeWinLi.append(firstPokemonLossRound, " vs ", secondPokemonWinRound);
      gameComments.append(secondPokeWinLi);
      // END Comments if Second Wins
      setTimeout(() => {
        firstPokemonStrenght.classList.remove("pokemon-strength-reveal");
        getRandomPokemon(1);
        correctAnswerScore();
        winCountPokemon(2);
        winFirstPoke = 0;
        secondPokemonImg.classList.remove("correct-answer", "disable-click");
        firstPokemonImg.classList.remove("disable-click");
        // START Comments After First Wins
        let newRound = document.createElement("li");
        setTimeout(() => {
          newRound.textContent = `${firstPokemonTitle.textContent} vs ${secondPokemonTitle.textContent}`;
        }, 500);
        gameComments.append(newRound);
        // END Comments After First Wins
      }, 2000);
    } else {
      firstPokemonStrenght.classList.add("pokemon-strength-reveal");
      secondPokemonStrenght.classList.add("pokemon-strength-reveal");
      secondPokemonImg.classList.add("incorrect-answer", "disable-click");
      firstPokemonImg.classList.add("disable-click");
      setTimeout(() => {
        setHighScore();
        score.textContent = 0;
        scoreIncrease = 0;
        startScreen.classList.remove("hide-overlay");
        startScreen.classList.add("show-overlay");
        getRandomPokemon(1);
        getRandomPokemon(2);
        secondPokemonStrenght.classList.remove("pokemon-strength-reveal");
        firstPokemonStrenght.classList.remove("pokemon-strength-reveal");
        secondPokemonImg.classList.remove("incorrect-answer", "disable-click");
        firstPokemonImg.classList.remove("disable-click");
        // START Comment If second looses
        gameComments.textContent = "";
        setTimeout(() => {
          roundComment.textContent = `${firstPokemonTitle.textContent} vs ${secondPokemonTitle.textContent}`;
        }, 500);
        gameComments.append(roundComment);
        // END Comment If second looses
      }, 2000);
    }
  }
}
