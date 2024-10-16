"use client";

import React, { useState, useEffect } from "react";
import { combinations } from "../assets/CardDeck";
import Button from "../components/button";
import Hand from "../components/Hand";
import styles from "../styles/buttonBet.module.css";
import requireAuth from "../components/requireAuth";
import { useAuth } from "../context/AuthContext";

export function Blackjack() {
  // Game States
  const [gameDeck, setGameDeck] = useState(combinations);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState({ type: "", message: "" });
  const [dealerCardHidden, setDealerCardHidden] = useState(true);
  const [coins, setCoins] = useState(1000); // Starting coins
  const [bet, setBet] = useState(0); // Current bet amount
  const [betPlaced, setBetPlaced] = useState(false); // Track if bet has been placed
  const [isDealerDrawing, setIsDealerDrawing] = useState(false); // Track if dealer is drawing
  const [standPressed, setStandPressed] = useState(false);

  // Get random card from deck
  const getRandomCardFromDeck = () => {
    const randomIndex = Math.floor(Math.random() * gameDeck.length);
    const card = gameDeck[randomIndex];
    const newDeck = gameDeck.filter((_, index) => index !== randomIndex);
    setGameDeck(newDeck);
    return card;
  };

  // Deal card to player
  const dealCardToPlayer = () => {
    const newHand = [...playerHand, getRandomCardFromDeck()];
    setPlayerHand(newHand);
    const playerValue = calculateHandValue(newHand);
    if (playerValue > 21) {
      handleGameOver({
        type: "Dealer",
        message: `Player busts! Dealer wins! \n You lost ${bet} Coins`,
      });
    }
  };

  // Player stands, dealer's turn starts
  const playerStand = () => {
    setStandPressed(true); // Set standPressed to true
    setDealerCardHidden(false); // Reveal dealer's hidden card
    setIsDealerDrawing(true); // Set state to indicate dealer is drawing
    // Delay showing the dealer's hidden card
    setTimeout(() => {
      dealerTurn();
    }, 1000); // 1 second delay
  };

  // Dealer's turn with delay
  const dealerTurn = () => {
    let dealerValue = calculateHandValue(dealerHand);

    const drawCard = () => {
      if (dealerValue < 17) {
        const newCard = getRandomCardFromDeck();
        setDealerHand((prevHand) => {
          const newHand = [...prevHand, newCard];
          dealerValue = calculateHandValue(newHand);
          return newHand;
        });

        // Continue drawing cards until value is 17 or more
        setTimeout(drawCard, 1000); // Delay of 1 second between draws
      } else {
        // End dealer's turn and evaluate the game
        setIsDealerDrawing(false);
        evaluateGame(dealerValue);
      }
    };

    drawCard(); // Start dealer's turn
  };

  // Calculate hand value based on Blackjack rules
  const calculateHandValue = (hand) => {
    let value = 0;
    let aceCount = 0;
    hand.forEach((card) => {
      if (card.rank === "J" || card.rank === "Q" || card.rank === "K") {
        value += 10;
      } else if (card.rank === "A") {
        aceCount += 1;
        value += 11;
      } else {
        value += parseInt(card.rank);
      }
    });
    while (value > 21 && aceCount > 0) {
      value -= 10;
      aceCount -= 1;
    }
    return value;
  };

  // Evaluate the game result
  const evaluateGame = (dealerValue) => {
    const playerValue = calculateHandValue(playerHand);

    if (dealerValue > 21) {
      handleGameOver({
        type: "Player",
        message: `Dealer busts! Player wins! \n You won ${bet * 2} Coins`,
      });
    } else if (playerValue > dealerValue) {
      handleGameOver({
        type: "Player",
        message: `Player wins! \n You won ${bet * 2} Coins`,
      });
    } else if (playerValue < dealerValue) {
      handleGameOver({
        type: "Dealer",
        message: `Dealer wins! \n You lost ${bet} Coins`,
      });
    } else if (playerValue === dealerValue) {
      handleGameOver({
        type: "Draw",
        message: `It's a Draw \n You got your Coins back`,
      });
    }
  };

  // Handle game over and adjust coin balance
  const handleGameOver = (result) => {
    setGameOver(true);
    setResult(result);
    switch (result.type) {
      case "Player":
        setCoins(coins + bet * 2); // Player wins, add bet amount
        break;
      case "Dealer":
        break;
      case "Draw":
        setCoins(coins + bet); // Dealer wins, subtract bet amount
        break;
      default:
        break;
    }
  };

  // Reset the game
  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameOver(false);
    setResult({ type: "", message: "" });
    setGameDeck(combinations);
    setDealerCardHidden(true); // Reset dealer's card visibility
    setBetPlaced(false); // Reset bet placement status
    setStandPressed(false); // Reset standPressed state
  };

  // Handle bet placement
  const handlePlaceBet = () => {
    if (bet > 0 && bet <= coins) {
      setCoins(coins - bet); // Deduct bet from coins
      setBetPlaced(true);
      setPlayerHand([getRandomCardFromDeck(), getRandomCardFromDeck()]);
      setDealerHand([getRandomCardFromDeck(), getRandomCardFromDeck()]);
    } else {
      alert("Invalid bet amount. Please enter a valid amount.");
    }
  };

  useEffect(() => {
    // Check for immediate win conditions after initial deal
    if (betPlaced && playerHand.length === 2 && dealerHand.length === 2) {
      const playerValue = calculateHandValue(playerHand);
      const dealerValue = calculateHandValue(dealerHand);

      if (playerValue === 21) {
        handleGameOver(
          {
            type: "Player",
            message: `BLACKJACK! Player wins! You won ${bet * 2.25}`,
          },
          setCoins(coins + bet * 2.25)
        );
      } else if (dealerValue === 21) {
        handleGameOver(
          {
            type: "Dealer",
            message: `BLACKJACK! Dealer wins! You lost ${bet}`,
          },
          setDealerCardHidden(false)
        );
      }
    }
  }, [playerHand, dealerHand, betPlaced]);

  return (
    <div className="container mx-auto p-4 text-white h-screen w-screen">
      <h1 className="text-4xl text-center mb-4">Blackjack</h1>

      {/* Display Coin Balance and Bet */}
      <div className="text-center mb-4">
        <link rel="" href="buttonBet.module.css"></link>
        <p className="text-2xl">Coins: {coins}</p>
        {!gameOver && !betPlaced && (
          <div>
            <input
              type="number"
              value={bet}
              onChange={(e) =>
                setBet(
                  Math.max(0, Math.min(parseInt(e.target.value) || 0, coins))
                )
              }
              min="0"
              max={coins}
              readOnly
              className="p-2 bg-gray-800 border border-gray-600 rounded-md"
            />
            <Button bg_color={`green`} onClick={handlePlaceBet}>
              Place Bet
            </Button>
            <div className={styles.sort1}>
              <button
                onClick={() =>
                  setBet((prevBet) => Math.min(prevBet + 50, coins))
                }
                className={styles.green}
              >
                + 50
              </button>
              <button
                onClick={() =>
                  setBet((prevBet) => Math.min(prevBet + 100, coins))
                }
                className={styles.green}
              >
                + 100
              </button>
              <button
                onClick={() =>
                  setBet((prevBet) => Math.min(prevBet + 500, coins))
                }
                className={styles.green}
              >
                + 500
              </button>
              <button
                onClick={() =>
                  setBet((prevBet) => Math.min(prevBet + 1000, coins))
                }
                className={styles.green}
              >
                + 1000
              </button>
              <button onClick={() => setBet(coins)} className={styles.green}>
                + MAX
              </button>
            </div>
            <div className={styles.sort2}>
              <button
                onClick={() => setBet((prevBet) => Math.max(prevBet - 50, 0))}
                className={styles.red}
              >
                - 50
              </button>
              <button
                onClick={() => setBet((prevBet) => Math.max(prevBet - 100, 0))}
                className={styles.red}
              >
                - 100
              </button>
              <button
                onClick={() => setBet((prevBet) => Math.max(prevBet - 500, 0))}
                className={styles.red}
              >
                - 500
              </button>
              <button
                onClick={() => setBet((prevBet) => Math.max(prevBet - 1000, 0))}
                className={styles.red}
              >
                - 1000
              </button>
              <button onClick={() => setBet(0)} className={styles.red}>
                - MAX
              </button>
            </div>
          </div>
        )}
      </div>

      {gameOver && (
        <div
          className={`text-white ${
            result.type === "Player"
              ? "bg-green-600"
              : result.type === "Dealer"
              ? "bg-red-700"
              : "bg-yellow-500" // Background color for Draw scenario
          } font-bold rounded-md text-center mt-4 py-4`}
        >
          <h2 className="text-2xl">{result.message}</h2>
        </div>
      )}

      {/* Conditional Rendering for Hit and Stand Buttons */}
      {betPlaced && !gameOver && !standPressed && (
        <div className="flex justify-center gap-2 mt-4">
          <Button bg_color={`green`} onClick={dealCardToPlayer}>
            Hit
          </Button>
          <Button bg_color={`red`} onClick={playerStand}>
            Stand
          </Button>
          <span className="bg-black rounded-md flex justify-center items-center text-yellow-500 border-2 border-yellow-500">
            Bet Placed : {bet}
          </span>
        </div>
      )}

      {/* Reset Button */}
      {gameOver && (
        <div className="flex justify-center mt-4">
          <button
            onClick={resetGame}
            className={`text-white ${
              result.type === "Player"
                ? "bg-green-600"
                : result.type === "Dealer"
                ? "bg-red-700"
                : "bg-yellow-500" // Background color for Draw scenario
            } text-white font-medium px-4 py-2 rounded-lg shadow-md mr-2`}
          >
            Reset
          </button>
        </div>
      )}

      <div className="flex justify-around">
        <Hand
          cards={playerHand}
          title={"Player's Hand"}
          handValue={calculateHandValue(playerHand)}
        />
        <Hand
          cards={dealerHand}
          title={"Dealer's Hand"}
          handValue={calculateHandValue(dealerHand)}
          hidden={dealerCardHidden} // Hide the dealer's second card if needed
        />
      </div>
    </div>
  );
}

export default requireAuth(Blackjack);
