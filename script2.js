
const cardValues = [
    { name: "two", img: 2, value: 2 },
    { name: "three", img: 3, value: 3 },
    { name: "four", img: 4, value: 4 },
    { name: "five", img: 5, value: 5 },
    { name: "six", img: 6, value: 6 },
    { name: "seven", img: 7, value: 7 },
    { name: "eight", img: 8, value: 8 },
    { name: "nine", img: 9, value: 9 },
    { name: "ten", img: 10, value: 10 },
    { name: "jack", img: "jack", value: 10 },
    { name: "queen", img: "queen", value: 10 },
    { name: "king", img: 'king', value: 10 },
    { name: "ace", img: 'ace', value: 11 },
];
const suits = ["clubs", "diamonds", "hearts", "spades"];
const deck = [];

for (let value of cardValues) {
    for (let suit of suits) {
        const img = new Image();
        img.src = `./Playing Cards/PNG-cards-1.3/${value.img}_of_${suit}.png`;
        img.name = value.name;
        img.suit = suit;
        img.value = value.value;
        img.height = 100;
        img.width = 62;
        deck.push(img);
    }
};

const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);

const message = document.querySelector("#notification");
const buttonsContainer = document.querySelector("#buttons");
const dealBtn = document.querySelector("#deal");
const playerHand = document.getElementById("player-hand");
const dealerHand = document.querySelector("#dealer-hand");
const startBtn = document.querySelector("#start");

const restartGameBtn = document.createElement("button");
restartGameBtn.textContent = "NEW GAME";
restartGameBtn.id = "new-game";
restartGameBtn.className = "restart-game";

const hitBtn = document.createElement("button");
hitBtn.textContent = "Hit";
hitBtn.id = "hit-btn";
hitBtn.className = "hit-button";

const standBtn = document.createElement("button");
standBtn.textContent = "Stand";
standBtn.id = "stand-btn";
standBtn.className = "stand-button";

dealBtn.hidden = true;
let playerHandValue = 0;
let dealerHandValue = 0;
let isGameActive = false;
let hasBlackjack = false;
let dealerHiddenCards = [];

function drawCard() {
    return shuffledDeck.pop();
}

function updateHandValue(card, currentValue) {
    return currentValue + card.value;
}

function adjustForAces(handValue, cards) {
    if (handValue > 21) {
        for (let card of cards) {
            if (card.name === "ace" && card.value === 11) {
                card.value = 1;
                handValue -= 10;
                if (handValue <= 21) break;
            }
        }
    }
    return handValue;
}

function displayCard(card, handElement) {
    handElement.appendChild(card);
}


function dealerTurn() {
    while (dealerHandValue < 17) {
        const newCard = drawCard();
        dealerHiddenCards.push(newCard);
        dealerHandValue = updateHandValue(newCard, dealerHandValue);
        dealerHandValue = adjustForAces(dealerHandValue, dealerHiddenCards);
    }
    revealDealerCards();
    checkWinner();
}

function revealDealerCards() {
    dealerHand.innerHTML = "";
    for (let card of dealerHiddenCards) {
        displayCard(card, dealerHand);
    }
}

function startGame() {
    startBtn.hidden = true;
    dealBtn.hidden = false;
    isGameActive = true;
    hasBlackjack = false;
    playerHand.innerHTML = "";
    dealerHand.innerHTML = "";
    playerHandValue = 0;
    dealerHandValue = 0;
    dealerHiddenCards = [];
    message.textContent = "Game started! Draw your cards.";
}

function firstDeal() {
    const playerCard1 = drawCard();
    const playerCard2 = drawCard();
    const dealerCard1 = drawCard();
    const dealerCard2 = drawCard();

    playerHandValue = updateHandValue(playerCard1, playerHandValue);
    playerHandValue = updateHandValue(playerCard2, playerHandValue);
    dealerHandValue = updateHandValue(dealerCard1, dealerHandValue);

    displayCard(playerCard1, playerHand);
    displayCard(playerCard2, playerHand);

    displayCard(dealerCard1, dealerHand);
    dealerHiddenCards.push(dealerCard2);

    playerHandValue = adjustForAces(playerHandValue, [playerCard1, playerCard2]);
    dealerHandValue = adjustForAces(dealerHandValue, [dealerCard1]);

    dealBtn.hidden = true;
    buttonsContainer.appendChild(hitBtn);
    buttonsContainer.appendChild(standBtn);

    checkPlayerStatus();
}

function hit() {
    const newCard = drawCard();
    playerHandValue = updateHandValue(newCard, playerHandValue);
    displayCard(newCard, playerHand);
    playerHandValue = adjustForAces(playerHandValue, [newCard]);
    checkPlayerStatus();
}

function stand() {
    hitBtn.hidden = true;
    standBtn.hidden = true;
    dealerTurn();
}

function checkPlayerStatus() {
    if (playerHandValue === 21) {
        message.textContent = "Blackjack! You win!";
        isGameActive = false;
        endGame();
    } else if (playerHandValue > 21) {
        message.textContent = "Bust! You lose.";
        isGameActive = false;
        endGame();
    }
}

function checkWinner() {
    if (dealerHandValue > 21 || playerHandValue > dealerHandValue) {
        message.textContent = "You win!";
    } else if (dealerHandValue === playerHandValue) {
        message.textContent = "It's a tie!";
    } else {
        message.textContent = "Dealer wins!";
    }
    endGame();
}

function endGame() {
    hitBtn.hidden = true;
    standBtn.hidden = true;
    buttonsContainer.appendChild(restartGameBtn);
}

restartGameBtn.addEventListener("click", () => location.reload());
dealBtn.addEventListener("click", firstDeal);
startBtn.addEventListener("click", startGame);
hitBtn.addEventListener("click", hit);
standBtn.addEventListener("click", stand);