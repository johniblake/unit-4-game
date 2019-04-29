class Fighter {
  class;
  healthPoints;
  attackPower;
  counterAttackPower;
  attack;
  name;
  id;
  imageURL;

  constructor(hp, ap, cap, name, id, url) {
    this.name = name;
    this.id = id;
    this.class = "fighter";
    this.attackPower = ap;
    this.healthPoints = hp;
    this.counterAttackPower = cap;
    this.attack = this.attackPower;
    this.imageURL = url;
  }
  attack = fighter => {
    fighter.healthPoints -= this.attack;
    this.attack += this.attackPower;
  };

  isDead = () => {
    if (this.healthPoints <= 0) {
      return true;
    } else {
      return false;
    }
  };

  getHTML = () => {
    let fighterDiv = $("<div>");
    let fighterImage = $("<img>");
    fighterDiv.val(this.id);
    fighterDiv.attr("class", this.class);
    fighterImage.attr("src", this.imageURL);
    fighterImage.attr("class", "fighter-image");

    fighterDiv.append("HP: " + this.healthPoints);
    fighterDiv.append(fighterImage);
    fighterDiv.append(this.name);
    //fighterDiv.append("<br> HP: " + this.healthPoints);
    return fighterDiv;
  };

  setClass = fighterClass => {
    this.class = fighterClass;
  };
}

class Game {
  fighters;
  myFighter;
  enemies;
  defender;
  fighterSelected;
  defenderSelected;

  constructor() {
    this.reset();
  }

  reset = () => {
    this.fighterSelected = false;
    this.defenderSelected = false;
    this.myFighter = null;
    this.defender = null;
    this.enemies = null;

    let obiwon = new Fighter(
      190,
      5,
      15,
      "Obi Won",
      "obiwon",
      "./assets/images/obiwon.png"
    );
    let anakin = new Fighter(
      120,
      12,
      12,
      "Anakin",
      "anakin",
      "./assets/images/anakin.png"
    );
    let darthmaul = new Fighter(
      150,
      11,
      6,
      "Darth Maul",
      "darthmaul",
      "./assets/images/darthmaul.png"
    );
    let darthsidious = new Fighter(
      180,
      3,
      20,
      "Darth Sidious",
      "darthsidious",
      "./assets/images/darthsidious.png"
    );

    this.fighters = {
      obiwon: obiwon,
      anakin: anakin,
      darthmaul: darthmaul,
      darthsidious: darthsidious
    };
    $("#message-container").html("");
    $("#game-over-container").css("display", "none");
    $("#game-container").css("display", "block");
    console.log("My Fighter: " + this.myFighter);
    this.display();
    $(document).trigger("change");
  };

  attack = () => {
    this.defender.healthPoints -= this.myFighter.attack;
    this.myFighter.healthPoints -= this.defender.counterAttackPower;
    this.displayMessage(
      "You attacked " +
        this.defender.name +
        " for " +
        this.myFighter.attack +
        " damage.<br>" +
        this.defender.name +
        " hit you back for " +
        this.defender.counterAttackPower +
        " damage."
    );
    if (this.defender.healthPoints <= 0) {
      this.displayMessage("You killed " + this.defender.name + ".");
      this.killOpponent();
    }
    this.updateAttackPower();
  };

  killOpponent = () => {
    this.defenderSelected = false;
    this.defender = null;
  };

  updateAttackPower = () => {
    this.myFighter.attack += this.myFighter.attackPower;
  };

  enemiesLeft = () => {
    if (Object.keys(this.fighters).length == 0 && !this.defender) {
      return false;
    }
    return true;
  };

  gameOver = condition => {
    let endGameScreen = $("<div>");
    if (condition === "win") {
      endGameScreen.html(
        "<h1>Congratulations! You have defeated the enemy!</h1>"
      );
    } else {
      endGameScreen.html("<h1>You died. Try harder...</h1>");
    }
    $("#game-container").css("display", "none");
    $("#game-over-container").html(endGameScreen);
    $("#game-over-container").css("display", "flex");
    window.setTimeout(this.reset, 2000);
  };

  displayMessage = message => {
    let container = $("<span>");
    container.css("background-color", "black");
    container.html(message);
    if (message != "") {
      $("#message-container").html(container);
    } else {
      $("#message-container").html("");
    }
  };
  display = () => {
    this.displayFighters();
    this.displayMyFighter();
    this.displayDefender();
  };

  selectFighter = fighter => {
    this.myFighter = fighter;
    fighter.setClass("my-fighter");
  };

  selectDefender = fighter => {
    this.defender = fighter;
    fighter.setClass("defender");
    this.displayMessage("");
  };

  displayMyFighter = () => {
    if (this.myFighter) {
      $("#my-fighter-container").html("<h1>Your Character</h1>");
      $("#my-fighter-container").append(this.myFighter.getHTML());
    } else {
      $("#my-fighter-container").html("");
    }
  };

  displayFighters = () => {
    let fightersDiv = $("<div>");
    fightersDiv.attr("id", "fighters");
    for (let fighter in this.fighters) {
      fightersDiv.append(this.fighters[fighter].getHTML());
    }
    if (!this.fighterSelected) {
      $("#fighters-container").html("<h1>Select a Fighter</h1>");
      $("#fighters-container").append(fightersDiv);
    } else {
      if (!this.defender && Object.keys(this.fighters).length > 0) {
        $("#fighters-container").html("<h1>Select a Defender</h1>");
        $("#fighters-container").append(fightersDiv);
      } else {
        $("#fighters-container").html(fightersDiv);
      }
      fightersDiv.css("background-color", "black");
    }
  };

  displayDefender = () => {
    let attackButton = $("<button>")
      .attr("class", "attack-button")
      .text("Attack");

    if (this.defender) {
      $("#attack-button-container").html(attackButton);
      $("#defender-container").html("<h1>Defender</h1>");
      $("#defender-container").append(this.defender.getHTML());
    } else {
      $("#attack-button-container").html("");
      $("#defender-container").html("");
    }
  };
}

let game = new Game();

$(document).ready(function() {
  $(document).change(function() {
    $(".fighter").on("click", function() {
      console.log("registering click");
      let value = $(this).val();
      let myGuy;
      if (!game.fighterSelected) {
        game.fighterSelected = true;
        myGuy = game.fighters[value];
        game.selectFighter(myGuy);
        delete game.fighters[value];
      } else if (!game.defenderSelected) {
        game.defenderSelected = true;
        myGuy = game.fighters[value];
        game.selectDefender(myGuy);
        delete game.fighters[value];
      }
      game.display();
      $(document).trigger("change");
      console.log(value);
    });

    $(".attack-button").on("click", function() {
      console.log("registering click");
      game.attack();
      if (!game.myFighter.isDead()) {
        if (!game.enemiesLeft()) {
          game.gameOver("win");
        } else {
          game.display();
        }
      } else {
        game.gameOver("lose");
      }
      $(document).trigger("change");
    });
  });
  $(document).trigger("change");
});
