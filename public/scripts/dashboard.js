const showToast = (message) => {
  Toastify({
    text: message,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right,rgb(20, 62, 28),rgb(37, 148, 40))",
    },
    onClick: function () {},
  }).showToast();
};

const handleJoinGame = async (numOfPlayers) => {
  try {
    const response = await fetch("/game/join-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numOfPlayers }),
    });

    if (response.redirected) {
      // const responseData = { message: "you entered the game.....!" };
      // showToast(responseData.message);
      globalThis.location.href = "/game";

      return;
    }

    globalThis.location.href = "/";  
  } catch (error) {
    console.error("Join error:", error);
    showToast("An error occurred. Please try again later.");
  }
};

const handleJoin = () => {
  const numOfPlayers = document.querySelector("#player-count-for-join").value;

  if (!numOfPlayers) {
    showToast("Number of players must be selected");
    return;
  }

  handleJoinGame(numOfPlayers);
};

const handlePopup = () => {
  const popup = document.querySelector("#join-game");
  popup.style.display = "flex";
  const close = popup.querySelector(".close");

  close.onclick = () => {
    popup.style.display = "none";
  };

  const joinGame = document.querySelector("#join-game-button");
  joinGame.addEventListener("click", handleJoin);
};

const handleProfile = () => {
  const response = {
    playerName: "Jack",
    matchesPlayed: 5,
    matchesWon: 3,
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  };

  const userProfile = document.querySelector("#player-profile");
  userProfile.style.display = "flex";

  const close = userProfile.querySelector(".close");

  close.onclick = () => {
    userProfile.style.display = "none";
  };

  userProfile.querySelector("#player-name-in-popup").textContent =
    response.playerName;
  userProfile.querySelector("#matches-played").textContent =
    response.matchesPlayed;
  userProfile.querySelector("#matches-won").textContent = response.matchesWon;
  userProfile.querySelector(
    "#picture"
  ).innerHTML = `<img src=${response.avatar} width=100% height=100%/>`;
};

const renderDashBoard = ({ playerName, avatar }) => {
  const profile = document.querySelector("#profile");
  profile.querySelector("#player-name").textContent = playerName;
  profile.querySelector(
    "#profile-picture"
  ).innerHTML = `<img src=${avatar} alt="user avatar" width=100% height=100% />`;
};

const main = () => {
  const response = {
    playerName: "Jack",
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  };

  renderDashBoard(response);
  const join = document.querySelector("#join-button");
  const profile = document.querySelector("#profile");

  profile.addEventListener("click", handleProfile);
  join.addEventListener("click", handlePopup);
};

globalThis.onload = main;
