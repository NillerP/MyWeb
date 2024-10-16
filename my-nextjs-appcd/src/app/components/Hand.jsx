import React from "react";
import Card from "./Card";
import BackOfCard from "./BackOfCard"; // Import the back of the card component

export default function Hand({ cards, title, handValue, hidden }) {
  // Calculate the value of the first card
  const firstCardValue = cards.length > 0 ? calculateCardValue(cards[0]) : 0;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-2">{title}</h2>
      <div className="flex flex-col sm:flex-row gap-1">
        {cards.map((card, index) => {
          // If the dealer's second card is hidden, show the back of the card
          if (hidden && index === 1) {
            return <BackOfCard key={index} />; // Show face-down card
          }
          return <Card key={index} card={card} />;
        })}
      </div>
      {/* Display only the first card's value when the second card is hidden */}
      {hidden ? (
        <p className="mt-2">Card : {firstCardValue}</p>
      ) : (
        <p className="mt-2">Card : {handValue}</p>
      )}
    </div>
  );
}

// Helper function to calculate the value of a single card
const calculateCardValue = (card) => {
  if (card.rank === "J" || card.rank === "Q" || card.rank === "K") {
    return 10;
  } else if (card.rank === "A") {
    return 11; // In this case, you can decide if you want to handle Aces as 1 or 11
  } else {
    return parseInt(card.rank);
  }
};
