// @ts-nocheck

/* Defining Table
 * Input: Hit or Stay?
 * Processing: Random cards and total calculation
 * Output: You get cards and get to know whether you won or not
 */

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
    initialize: function () { // This is fancy.
        // var suitArray, valueArray, s, r;
        // suitArray = ["spades", "diamonds", "clubs", "hearts"];
        // rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
        // DECK OF CARDS
        // Okay, it's time to make a deck of cards.
        // You'll need to make your suits and values.
        var suits = ["clubs", "diamonds", "hearts", "spades"];
        var values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
        for (var s = 0; s < suits.length; s += 1) {
            for (var v = 0; v < values.length; v += 1) {
                this.deckArray[s * 13 + v] = {
                    "The" :values[v] +
                    " of " + suits[s]
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
// DECK OF CARDS
    // Okay, it's time to make a deck of cards.
    // You'll need to make your suits and values.
    // var suits = ["spades", "diamonds", "clubs", "hearts"];
    // var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    // // Now for the deck itself.
    // function deckYourHalls() {
    //     var playingDeck = new Array();

    //     for (var i = 0; i < suits.length; i++) { // s for suits
    //         for (var x = 0; x < cards.length; x++) { // v for values
    //             var card = { Value: cards[x], Suit: suits[i] }; // Time to make each combination: 13 values/4 suits
    //             // This is what that line is doing:
    //             // var deck = [{Value: 'A', Suit: 'Spades'}, {Value: 'A', Suit: 'Diamonds'}, {Value: 'A', Suit: 'Clubs'}...]
    //             playingDeck.push(card); // This adds that card to my deck.
    //         }
    //     }
    //     return playingDeck; // Yay, I have a deck!
    // }

// What value do the cards have? (Dealer vs. Player)
function getCardsValue(a) {
    var cardArray = [],
        sum = 0,
        i = 0,
        aceCount = 0;
    cardArray = a;
    for (i; i < cardArray.length; i += 1) {
        if (cardArray[i].value === "Jack" || cardArray[i].value === "Queen" || cardArray[i].value === "King") {
            sum += 10;
        } else if (cardArray[i].value === "Ace") {
            sum += 11;
            aceCount += 1;
        } else {
            sum += cardArray[i].value;
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









// DECK OF CARDS
// Okay, it's time to make a deck of cards.
// You'll need to make your suits and values.
// var suits = ["spades", "diamonds", "clubs", "hearts"];
// var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// // Now for the deck itself.
// function deckYourHalls() {
//     var playingDeck = new Array();

//     for (var i = 0; i < suits.length; i++) { // s for suits
//         for (var x = 0; x < cards.length; x++) { // v for values
//             var card = { Value: cards[x], Suit: suits[i] }; // Time to make each combination: 13 values/4 suits
//             // This is what that line is doing:
//             // var deck = [{Value: 'A', Suit: 'Spades'}, {Value: 'A', Suit: 'Diamonds'}, {Value: 'A', Suit: 'Clubs'}...]
//             playingDeck.push(card); // This adds that card to my deck.
//         }
//     }
//     return playingDeck; // Yay, I have a deck!
// }

// // No deck is any good without a way to shuffle it.
// // I need a way to randomize for shuffling.
// function truffleShuffler(playingDeck) {
// 	// for 1,000,000 turns
// 	// switch the values of two random cards
// 	for (var i = 0; i < 1000000; i++) {
// 		var location1 = Math.floor((Math.random() * playingDeck.length)); // It's like the shell game.
// 		var location2 = Math.floor((Math.random() * playingDeck.length));
// 		var tmp = playingDeck[location1];

// 		playingDeck[location1] = playingDeck[location2];
// 		playingDeck[location2] = tmp;
// 	}
//     renderDeck();
// }
// function renderDeck()
// {
// 	document.getElementById('playingDeck').innerHTML = '';
// 	for(var i = 0; i < playingDeck.length; i++) {
// 		var card = document.createElement("div");
// 		var value = document.createElement("div");
// 		var suit = document.createElement("div");
// 		card.className = "card";
// 		value.className = "value";
// 		suit.className = "suit " + playingDeck[i].Suit;

// 		value.innerHTML = playingDeck[i].Value;
// 		card.appendChild(value);
// 		card.appendChild(suit);

// 		document.getElementById("playingDeck").appendChild(card);
// 	}
// }

// function magicDeckLoader()
// {
// 	playingDeck = deckYourHalls();
// 	truffleShuffler();
//     renderDeck();
// }
// // This is a beautiful piece of code I found that loads this program.
// window.onload = magicDeckLoader;






// var cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
// var suits = ["diamonds", "hearts", "spades", "clubs"];
// var deck = new Array();

// function getDeck() {
//     var deck = new Array();

//     for (var i = 0; i < suits.length; i++) {
//         for (var x = 0; x < cards.length; x++) {
//             var card = { Value: cards[x], Suit: suits[i] };
//             deck.push(card);
//         }
//     }

//     return deck;
// }

// function shuffle() {
//     // for 1000 turns
//     // switch the values of two random cards
//     for (var i = 0; i < 1000; i++) {
//         var location1 = Math.floor((Math.random() * deck.length));
//         var location2 = Math.floor((Math.random() * deck.length));
//         var tmp = deck[location1];

//         deck[location1] = deck[location2];
//         deck[location2] = tmp;
//     }

//     renderDeck();
// }

// function renderDeck() {
//     document.getElementById('deck').innerHTML = '';
//     for (var i = 0; i < deck.length; i++) {
//         var card = document.createElement("div");
//         var value = document.createElement("div");
//         var suit = document.createElement("div");
//         card.className = "card";
//         value.className = "value";
//         suit.className = "suit " + deck[i].Suit;

//         value.innerHTML = deck[i].Value;
//         card.appendChild(value);
//         card.appendChild(suit);

//         document.getElementById("deck").appendChild(card);
//     }
// }

// function load() {
//     deck = getDeck();
//     shuffle();
//     renderDeck();
// }

// window.onload = load;
