type key = {
  [key: string]: { noOfPlayers: number; totalNumberOfTroops: number };
};

export const playersAndTroops = () => {
  const obj: key = {
    6: { noOfPlayers: 6, totalNumberOfTroops: 120 },
    5: { noOfPlayers: 5, totalNumberOfTroops: 125 },
    4: { noOfPlayers: 4, totalNumberOfTroops: 120 },
    3: { noOfPlayers: 3, totalNumberOfTroops: 105 },
  };
  return obj;
};
