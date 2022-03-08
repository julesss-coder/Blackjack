// Funktioniert - von David als gut bewertet! - 28.2.2022
// Änderungen: das Generieren von cardsMap in Funktion verpackt und aufgerufen, um den Code sauberer zu gestalten. cardsMap ist trotzdem eine globale Variable. Ich könnte cardsMap erst in playBlackJack erzeugen, aber das ist unnötige Arbeit. Es reicht, wenn cardsMap nur einmal erzeugt wird.- 1.3.2022

/* Simple game: only user plays */
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

// Start a game
function playBlackJack() {
  // Create card deck out of cardsMap to play this round with
  var cardDeck = Object.entries(cardsMap);
  // current hand of cards held by the player
  var currentHand = [];
  // sum of current hand of cards held by the player
  var sum = 0; 

  dealCard();
  dealCard();
  getSum();

  function dealCard() {
    // Create a random number between 0 (inclusive) and cardDeck.length (exclusive).
    // Reason: cardDeck initially has 52 elements, but one is deleted each time a card is dealt.
    var randomIndex = Math.floor(Math.random() * cardDeck.length);
    alert(`Your card is ${cardDeck[randomIndex][0]}, value ${cardDeck[randomIndex][1]}.`);

    // delete the card (both name and value) as cards are only to be dealt once
    // Add card value, not its name, to cards array
    // splice() returns an array containing the spliced element, so I have to access the array first with [0] before accessing its elements
    currentHand.push(cardDeck.splice(randomIndex, 1)[0][1]);
    
    return currentHand;
  }



  function getSum() {
    // Number of soft aces, ie. aces with value 11 in currentHand
    // reset softAces each time getSum runs, otherwise an ace is counted every time we get the sum
    var softAces = 0;
    // get sum of current hand
    sum = currentHand.reduce(function(acc, cur) {
      if (cur === 11) {
        softAces++;
      }
      return acc + cur;
    }, 0);

    // check for black jack
    if (currentHand.length === 2 && sum === 21) {
      alert('Black Jack! You win!');
      return;
    }
  
    if (sum > 21) {
      if (softAces > 0) {
        while (sum > 21 && softAces > 0) {
          // count one softAce as 1
          sum = sum - 10;
          // By counting a soft aces as 1 instead of 11, it turns into a hard ace
          softAces--;
          // Replace one ace with value 11 with value 1
          currentHand[currentHand.indexOf(11)] = 1;
        }
        alert(`Reevaluated ace(s). Current points: ${sum}.`);
      }
    }
  
    // if sum is still > 21 after recalculating aces,
    // or if there are no aces but sum is > 21:
    if (sum > 21 && softAces === 0) {
      alert(`${sum} points - bust!`);
      return;
    }
  
    // sum is now <= 21 after recalculating aces, or
    // there are no aces and the sum is <= 21:
    if (sum < 21) {
      getPlayerChoice();
    } else if (sum === 21) {
      alert(`${sum} points - you win! Congratulations!`);
      return;
    }
  }

  function getPlayerChoice() {
    var playerChoice = prompt(`Current points: ${sum}. Would you like to hit or stand?\nType 1 to hit.\nType 2 to stand.`);
    while (playerChoice !== '1' && playerChoice !== '2') {
      playerChoice = prompt('You made a typo. Please try again:\nWould you like to hit or stand?\nType 1 to hit.\nType 2 to stand.');
    }

    if (playerChoice === '1') {
      dealCard(); 
      getSum();
    } else if (playerChoice === '2') {
      return;
    }
  }
}

playBlackJack();

while (confirm('Would you like to play another round?')) {
  playBlackJack();
}

console.log('To play another round, type playBlackJack() into the console and hit Enter.');


/*

getSum top-down outline:
function getSum
  sum up all values in cards:
    if card === 11:
      softAces++
    
  // check for black jack
  if cards.length === 2 && sum === 21:
    alert black jack
    player wins
    return
      
  if sum > 21:
    if softAces > 0:
      while sum > 21 && softAces > 0:
        // count one softAce as 1
        sum = sum - 10
        softAces--
        replace leftmost ace in cards with 1

  // if sum is still > 21 after recalculating aces,
  // or if there are no aces but sum is > 21:
  if sum > 21 && softAces === 0:
    alert player loses
    return

  // sum is now <= 21 after recalculating aces, or
  // there are no aces and the sum is <= 21:
  if sum < 21:
    ask player's choice
  else if sum === 21:
    alert player wins
    return 

===========================

NOTES AND QUESTIONS
- Does dealCard() really create a random number between 0 and 51? Yes. Googled it.
- Play game without debugger and add the missing alerts:
  - Alert sum of current hand --> OK
  - Alert reason of losing or winning (sum vs. 21) --> OK
  - Alert that ace has been reevaluated --> OK
- Can I code the game without global variables, and not within one all-encompassing function? (I.e. code it like Altcademy's Rock Paper Scissors solution).
- Check if check for black jack works. --> OK

ERRORS
- When I choose stand, another card is dealt!!! --> not happening anymore, might have to do with the other errors already corrected

- currentHand: [8, 1, 10, 6, 10, -1: 1] - what does -1 mean? --> probably result of counting aces multiple times and then replacing an already removed ace with 1

- test with current hand: [11, 11, 11, 11, 6, 6, 10], removing those from cardsMap
*/