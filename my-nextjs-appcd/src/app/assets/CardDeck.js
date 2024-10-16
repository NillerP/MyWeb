const suits = ["♠", "♥", "♦", "♣"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

const combinations = suits.flatMap((suit) =>
  ranks.map((rank) => ({ suit, rank }))
);

export { combinations };

const car = ["volvo", "bmw", "audi", "ferrai"];
const doors = ["2", "4", "6"];

const comboCar = car.flatMap((car) => doors.map((doors) => ({ car, doors })));

export { comboCar };
