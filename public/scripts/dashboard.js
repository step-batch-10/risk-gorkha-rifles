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
    const response = await fetch("/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numOfPlayers }),
    });

    if (!response.redirected) {
      const responseData = { message: "you entered the game.....!" };
      showToast(responseData.message);
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

const main = () => {
  const join = document.querySelector("#join-button");
  join.addEventListener("click", handlePopup);
};

globalThis.onload = main;
