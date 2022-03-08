// BEFORE GAME
// I will use only one deck for both player and dealer
// Alternative: Create 2 decks, put them together into one stack and deal from them

// create map of playing cards
function generateCardsMap() {
  var cardsMap = {};
  var suits = ['C', 'S', 'D', 'H'];
  var valuesNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  var valuesStrings = ['K', 'Q', 'J', 'A'];

  // Create map of cards and their values
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < valuesNumbers.length; j++) {
      // add each value in valuesNumbers after suit and add it to map (suit-valueNumbers: valueNumbers)
      cardsMap[suits[i] + valuesNumbers[j]] = valuesNumbers[j];
    }
  }

  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < valuesStrings.length - 1; j++) {
      // add each value in valuesNumbers after suit and add it to map (suit-valueNumbers: valueNumbers)
      cardsMap[suits[i] + valuesStrings[j]] = 10;
    }
  }

  for (var i = 0; i < suits.length; i++) {
    // add last value in valuesStrings after suit and add it to map (suit-valueStrings: 11)
    cardsMap[suits[i] + valuesStrings[valuesStrings.length - 1]] = 11;
  }

  return cardsMap;
}

var cardsMap = generateCardsMap();


//====================PLAY A ROUND OF BLACKJACK=================
function playBlackjack() {
  // Create card deck out of cardsMap to play this round with
  var cardDeck = Object.entries(cardsMap);
  var playerFunds = 100;
  var dealerFunds = 0;
  var playerHand = [];
  var dealerHand = [];

  // shuffle cardDeck - cards are dealt randomly, so no shuffling necessary

  // Set player bet
  function setPlayerBet() {
    var playerBet = prompt(`Set your bet, minimum: 10$, maximum ${playerFunds}$. Use multiples of 10 and type the number here:`);
    while (playerBet > 100 || playerBet % 10 !== 0) {
      playerBet = prompt(`You entered the wrong amount. Please place a bet between 10$ and ${playerFunds}$, using only multiples of 10 .\nType the amound you would like to bet here:`);
    }

    playerFunds = playerFunds - playerBet;
    return playerBet;
  }
  
  // Do I need to declare playerBet here or inside setPlayerBet?
  playerBet = setPlayerBet();

  // Can I make these local within getPlayerPoints() and getDealerPoints()?
  var playerStatus;
  var dealerStatus;


  function dealCard() { 
    // Create a random number between 0 (inclusive) and cardDeck.length (exclusive).
    // Reason: cardDeck initially has 52 elements, but one is deleted each time a card is dealt.
    var randomIndex = Math.floor(Math.random() * cardDeck.length);

    if (currentPlayer === 'player') {
      // Alert card BEFORE deleting it from cardDeck. Otherwise, the alert refers to the card at randomIndex AFTER deleting the card dealt.
      alert(`The player's card is ${cardDeck[randomIndex][0]}, value ${cardDeck[randomIndex][1]}.`);
      // delete the card (both name and value) as cards are only to be dealt once
      // Add card value, not its name, to cards array
      // splice() returns an array containing the spliced element, so I have to access the array first with [0] before accessing its elements
      playerHand.push(cardDeck.splice(randomIndex, 1)[0][1]);
      return playerHand;
    } else if (currentPlayer === 'dealer') {
      if (dealerHand.length === 0) {
        alert('The dealer\'s first card is placed face down.');
        // declare as global variable
        dealerCard1 = cardDeck[randomIndex];
      } else {
        alert(`The dealer's card is ${cardDeck[randomIndex][0]}, value ${cardDeck[randomIndex][1]}.`);
      }

      dealerHand.push(cardDeck.splice(randomIndex, 1)[0][1]);
      return dealerHand;
    }
  }

  // Deal one card to player, one to dealer. Repeat twice.
  // This is the actual process of dealing cards when starting a game of blackjack. I chose this instead of dealing 2 cards to player, then 2 to dealer, as it creates an unfair advantage for the player, as he has a higher chance of getting aces than the dealer.
  for (var i = 0; i < 2; i++) {
    var currentPlayer = 'player';
    playerHand = dealCard();
    var currentPlayer = 'dealer';
    dealerHand = dealCard();
  }

  alert(`Values in player's hand: ${playerHand}.`);
  alert(`Values in dealer's hand: ${dealerHand}.`);


  // =============PLAYER'S TURN=======================
  function getPlayerPoints() {
    currentPlayer = 'player';
    // Number of soft aces, ie. aces with value 11 in currentHand
    // reset softAces each time getSum runs, otherwise an ace is counted every time we get the sum
    var softAces = 0;
    // get sum of current hand
    playerPoints = playerHand.reduce(function(acc, cur) {
      if (cur === 11) {
        softAces++;
      }
      return acc + cur;
    }, 0);

    // check for black jack
    if (playerHand.length === 2 && playerPoints === 21) {
      alert('Player has Black Jack!');
      playerStatus = 'blackjack';
      // return playerPoints;
    }

    if (playerPoints > 21) {
      if (softAces > 0) {
        while (playerPoints > 21 && softAces > 0) {
          // count one softAce as 1
          playerPoints = playerPoints - 10;
          // By counting a soft aces as 1 instead of 11, it turns into a hard ace
          softAces--;
          // Replace one ace with value 11 with value 1
          playerHand[playerHand.indexOf(11)] = 1;
        }
        alert(`Reevaluated ace(s). Current points: ${playerPoints}.`);
      }
    }

    // if sum is still > 21 after recalculating aces,
    // or if there are no aces but sum is > 21:
    if (playerPoints > 21 && softAces === 0) {
      alert(`${playerPoints} points - bust!`);
      playerStatus = 'bust';
    }

    // sum is now <= 21 after recalculating aces, or
    // there are no aces and the sum is <= 21:
    if (playerPoints < 21) {
      getPlayerChoice();
    } else if (playerPoints === 21) {
      alert(`Player has ${playerPoints} points!`);
    }

    return playerPoints;
  }

  function getPlayerChoice() {
    var playerChoice = prompt(`Player's current points: ${playerPoints}. Would you like to hit or stand?\nType 1 to hit.\nType 2 to stand.`);
    while (playerChoice !== '1' && playerChoice !== '2') {
      playerChoice = prompt('You made a typo. Please try again:\nWould you like to hit or stand?\nType 1 to hit.\nType 2 to stand.');
    }

    if (playerChoice === '1') {
      dealCard(); 
      getPlayerPoints();
    } else if (playerChoice === '2') {
      playerStatus = 'stand';

      alert(`Values in player's hand: ${playerHand}.`);
    }
  }

  var playerPoints = getPlayerPoints();

  //===============DEALER'S TURN==========================
  
  // show dealer's first card
  alert(`Showing the dealer's first card: ${dealerCard1[0]}, value ${dealerCard1[1]}.`);
  alert(`Values in dealer's hand: ${dealerHand}.`);

  function getDealerPoints() {
    currentPlayer = 'dealer';
    // Number of soft aces, ie. aces with value 11 in dealerHand
    // reset softAces each time getSum runs, otherwise an ace is counted every time we get the sum
    var softAces = 0;
    // get sum of current hand
    dealerPoints = dealerHand.reduce(function(acc, cur) {
      if (cur === 11) {
        softAces++;
      }
      return acc + cur;
    }, 0);

    // check for black jack
    if (dealerHand.length === 2 && dealerPoints === 21) {
      alert('Dealer has a blackjack, 21 points!');
      dealerStatus = 'blackjack';
    }

    if (dealerPoints > 21) {
      if (softAces > 0) {
        while (dealerPoints > 21 && softAces > 0) {
          // count one softAce as 1
          dealerPoints = dealerPoints - 10;
          // By counting a soft aces as 1 instead of 11, it turns into a hard ace
          softAces--;
          // Replace one ace with value 11 with value 1
          dealerHand[dealerHand.indexOf(11)] = 1;
        }
        alert(`Reevaluated ace(s). Current points: ${dealerPoints}.`);
      }
    }

    // if sum is still > 21 after recalculating aces,
    // or if there are no aces but sum is > 21:
    if (dealerPoints > 21 && softAces === 0) {
      alert(`${dealerPoints} points - bust!`);
      dealerStatus = 'bust';
    }

    // Dealer only continues playing if player has not gone bust, and dealer himself has not gone bust
    if (playerStatus !== 'bust' && dealerStatus !== 'bust') {
      if (dealerPoints <= 16) {
        // hit
        // alert('Dealer hits.');
        console.log('Dealer hits');
        dealCard();
        getDealerPoints(); // was, wenn er durch den hit über 21 Punkte hat?
      } else if (dealerPoints > 16) {
        // stand
        dealerStatus = 'stand';
        alert(`Dealer has ${dealerPoints} points.\nDealer stands.`);
      }
    } else {
      alert(`Dealer has ${dealerPoints} points.`);
    }

    return dealerPoints;
  }

   // If player has not gone bust, it's the dealer's turn to play. Else, just count the dealer's points
  var dealerPoints = getDealerPoints();

  // COMPARE POINTS
  function comparePoints() {
    if (playerStatus !== 'bust' && playerPoints > dealerPoints) {
      alert(`Player: ${playerPoints}\nDealer: ${dealerPoints}.\nPlayer wins! Congratulations!`);
      playerFunds = playerFunds + playerBet * 2;
    } else if (playerStatus === 'blackjack' && dealerStatus !== 'blackjack') {
      alert(`Player: ${playerPoints}\nDealer: ${dealerPoints}.\nPlayer wins! Congratulations!`);
      playerFunds = playerFunds + playerBet * 2;
    } else if (playerPoints === dealerPoints || playerStatus === 'blackjack' && dealerStatus === 'blackjack') {
      alert(`Player: ${playerPoints}\nDealer: ${dealerPoints}.\nPush. It\'s a tie.`);
      playerFunds = playerFunds + playerBet;
  // see URL: https://edge.twinspires.com/casino-news/what-happens-if-the-dealer-busts-in-blackjack/ 
  // else if player does not bust && dealer busts:
    } else if (playerStatus !== 'bust' && dealerStatus === 'bust') {
      alert(`Player: ${playerPoints}\nDealer: ${dealerPoints}.\nPlayer wins! Congratulations!`);
      playerFunds += playerBet + dealerFunds;
    } else {
      // player went bust, or has fewer points than dealer
      alert(`Player: ${playerPoints}.\nDealer: ${dealerPoints}.\nDealer wins!`);
      dealerFunds += playerBet;
    }
    // not an option: player busts and dealer busts
    // bc after player busts, dealer does not hit
  }
  
  comparePoints();
}
// debugger;
playBlackjack();

while (confirm('Would you like to start a new game?')) {
  playBlackjack();
}
