globalThis.onload = () => {
  const createButton = document.querySelector("#create");
  const create = document.querySelector("#host-game");
  const joinButton = document.querySelector("#join");
  const joinGame = document.querySelector("#join-game");
  const profileButton = document.querySelector("#profile-picture");
  const profile = document.querySelector("#player-profile");
  const leaderBoardButton = document.querySelector("#leaderboard");
  const leaderboard = document.querySelector("#leader-board");
  const popupDisplays = [create, joinGame, profile, leaderboard];
  const closeButton = document.querySelectorAll(".close");

  createButton.addEventListener("click", () => {
    create.style.display = "flex";
  });

  joinButton.addEventListener("click", () => {
    joinGame.style.display = "flex";
  });

  profileButton.addEventListener("click", () => {
    profile.style.display = "block";
  });

  leaderBoardButton.addEventListener("click", () => {
    leaderboard.style.display = "block";
  });

  closeButton.forEach((button) => {
    button.addEventListener("click", () => {
      popupDisplays.map((popup) => {
        if (popup.style.display !== "none") {
          popup.style.display = "none";
        }

        return popup;
      });
    });
  });
};