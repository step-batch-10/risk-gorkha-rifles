// export default class GameManager { 
//   private games: Game[] = [];
  
//   createGame(noOfPlayers: 3|4|6, createdBy:number=0) {
//     const game = new Game(noOfPlayers, createdBy);
//     this.games.push(game);
//     return game;
//   }

//   isWaitingGame = (game) => {
//     return game.noOfPlayers === noOfPlayers && game.status === "waiting";
//   }

//   allotPlayer(noOfPlayers: number = 6, playerId: string) {
//     const game = this.games.find((game) => isWaitingGame(game));
//     game.addPlayer(playerId);
//   }

// };