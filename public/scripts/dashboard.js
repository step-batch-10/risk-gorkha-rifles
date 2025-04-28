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
      background:
        "linear-gradient(to right,rgb(251, 196, 85),rgb(255, 166, 0))",
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
      globalThis.location.href = "/game/waiting.html";

      return;
    }

    globalThis.location.href = "/";
  } catch {
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

const textContent = (context, element, content) => {
  const ele = context.querySelector(element);
  ele.textContent = content;
};

const innerHTML = (context, element, content) => {
  const ele = context.querySelector(element);
  ele.innerHTML = content;
};

const renderPlayerProfile = (userProfile, profile) => {
  const { username, matchesPlayed, matchesWon, avatar } = profile;
  textContent(userProfile, "#player-name", username);
  textContent(userProfile, "#matches-played", matchesPlayed);
  textContent(userProfile, "#matches-won", matchesWon);
  innerHTML(
    userProfile,
    "#picture",
    `<img src=${avatar} width=100% height=100%/>`
  );
};

const handleProfile = async () => {
  const response = await fetch("/game/player-full-profile");
  const profile = await response.json();

  const userProfile = document.querySelector("#player-profile");
  userProfile.style.display = "flex";

  const close = userProfile.querySelector(".close");

  close.onclick = () => {
    userProfile.style.display = "none";
  };

  renderPlayerProfile(userProfile, profile);
};

const renderDashBoard = ({ username, avatar }) => {
  const profile = document.querySelector("#profile");
  textContent(profile, "#player-name", username);
  innerHTML(
    profile,
    "#profile-picture",
    `<img src=${avatar} alt="user avatar" width=100% height=100% />`
  );
};

const main = async () => {
  const response = await fetch("/game/profile-details");
  const playerDetails = await response.json();

  renderDashBoard(playerDetails);
  const join = document.querySelector("#join-button");
  const profile = document.querySelector("#profile");

  profile.addEventListener("click", handleProfile);
  join.addEventListener("click", handlePopup);
};

globalThis.onload = main;
