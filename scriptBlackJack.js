// @ts-nocheck
/* Defining Table
* Input: Hit or Stay?
* Processing: Random cards and total calculation
* Output: You get cards and get to know whether you won or not
*/
/*jslint node: true*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*global document*/
"use strict";


var numCardsPulled = 0;

var player = {
    cards: [],
    score: 0,
    money: 100
};
var dealer = {
    cards: [],
    score: 0
};
var deck = {
    deckArray: [],
    // DECK OF CARDS
    // Okay, it's time to make a deck of cards.
    // You'll need to make your suits and values.
    initialize: function () {
        var suitArray, rankArray, s, r;
        suitArray = ["Clubs", "Diamonds", "Hearts", "Spades"];
        rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];
        for (s = 0; s < suitArray.length; s += 1) {
            for (r = 0; r < rankArray.length; r += 1) {
                this.deckArray[s * 13 + r] = {
                    rank: rankArray[r],
                    suit: suitArray[s]
                };
            }
        }
    },
    shuffle: function () {
        var temp, i, rnd;
        for (i = 0; i < this.deckArray.length; i += 1) {
            rnd = Math.floor(Math.random() * this.deckArray.length);
            temp = this.deckArray[i];
            this.deckArray[i] = this.deckArray[rnd];
            this.deckArray[rnd] = temp;
        }
    }
};

document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
deck.initialize();
deck.shuffle();
// Yay, I have a deck!

// What value do the cards have? (Dealer vs. Player)
function getCardsValue(a) {
    var cardArray = [],
        sum = 0,
        i = 0,
        aceCount = 0;
    cardArray = a;
    for (i; i < cardArray.length; i += 1) {
        if (cardArray[i].rank === "Jack" || cardArray[i].rank === "Queen" || cardArray[i].rank === "King") {
            sum += 10;
        } else if (cardArray[i].rank === "Ace") {
            sum += 11;
            aceCount += 1;
        } else {
            sum += cardArray[i].rank;
        }
    }
    while (aceCount > 0 && sum > 21) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}

// "Place your bets down ladies and gentlemen."
function bet(outcome) {
    var playerBet = document.getElementById("bet").valueAsNumber;
    if (outcome === "win") {
        player.money += playerBet;
    }
    if (outcome === "lose") {
        player.money -= playerBet;
    }
}

// Time to reset the game. Except your money.
function resetGame() {
    numCardsPulled = 0;
    player.cards = [];
    dealer.cards = [];
    player.score = 0;
    dealer.score = 0;
    deck.initialize();
    deck.shuffle();
    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;
    document.getElementById("bet").disabled = false;
    document.getElementById("bet").max = player.money;
    document.getElementById("new-game-button").disabled = false;
}

// The Gameplay Function (Lose or Win $?)
function gameplay() {
    if (player.score === 21) { // Very nice. This is a "natural."
        document.getElementById("message-board").innerHTML = "You win! You got a Blackjack/natural!" + "<br>" + "click Deal to keep playing";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (player.score > 21) { // This is the bust.
        document.getElementById("message-board").innerHTML = "Darn, you went over 21 and busted. The dealer wins this round." + "<br>" + "click Deal to keep playing";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score === 21) { // House has the advantage.
        document.getElementById("message-board").innerHTML = "Ouch. Dealer got a Blackjack/natural." + "<br>" + "click Deal to keep playing";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score > 21) { // Wow, the Dealer busted.
        document.getElementById("message-board").innerHTML = "Dealer went over 21! You win!" + "<br>" + "click Deal to keep playing";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score >= 17 && player.score > dealer.score && player.score < 21) {
        document.getElementById("message-board").innerHTML = "You win! You beat the dealer." + "<br>" + "click Deal to keep playing";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score >= 17 && player.score < dealer.score && dealer.score < 21) {
        document.getElementById("message-board").innerHTML = "You lost. Dealer had the higher score." + "<br>" + "click Deal to keep playing";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score >= 17 && player.score === dealer.score && dealer.score < 21) { // Would you look at that...
        document.getElementById("message-board").innerHTML = "You tied! " + "<br>" + "click Deal to keep playing";
        resetGame();
    }
    if (player.money <= 0) { // Ouch! DON'T GAMBLE!!
        document.getElementById("new-game-button").disabled = true;
        document.getElementById("hit-button").disabled = true;
        document.getElementById("stand-button").disabled = true;
        document.getElementById("message-board").innerHTML = "You lost!" + "<br>" + "You are out of money" + "<br>" + "<input type='button' value='New Game' onclick='location.reload();'/>";
    }
}

// The Dealer's Function
function dealerDraw() {
    dealer.cards.push(deck.deckArray[numCardsPulled]);
    dealer.score = getCardsValue(dealer.cards);
    document.getElementById("dealer-cards").innerHTML = "Dealer Cards: " + JSON.stringify(dealer.cards); // This is a new one for me.
    document.getElementById("dealer-score").innerHTML = "Dealer Score: " + dealer.score;
    numCardsPulled += 1;
}

// This is your new game/reset button
function newGame() {
    document.getElementById("new-game-button").disabled = true;
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
    document.getElementById("bet").disabled = true;
    document.getElementById("message-board").innerHTML = "";
    hit();
    hit();
    dealerDraw();
    gameplay();
}

// Like the Dealer's Function, this is your function.
function hit() {
    player.cards.push(deck.deckArray[numCardsPulled]);
    player.score = getCardsValue(player.cards);
    document.getElementById("player-cards").innerHTML = "Player Cards: " + JSON.stringify(player.cards);
    document.getElementById("player-score").innerHTML = "Player Score: " + player.score;
    numCardsPulled += 1;
    if (numCardsPulled >= 2) {
        gameplay();
    }
}

// The stand/stay button, and the dealer gets a card.
function stand() {
    while (dealer.score < 17) { // I think this is what the house's rules are. I could be wrong. Use this knowledge to your advantage.
        dealerDraw();
    }
    gameplay();
}

// // This is a beautiful piece of code I found that loads this program.
// window.onload = magicDeckLoader;



