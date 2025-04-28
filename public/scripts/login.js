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
      background: "linear-gradient(to right, #3e2514, #c99147)",
    },
    onClick: function () {},
  }).showToast();
};

const handleLogin = async (userName, avatarSrc) => {
  const { username, avatar } =
    avatarSrc === ""
      ? { username: userName, avatar: "/images/no-avatar.png" }
      : { username: userName, avatar: avatarSrc };

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, avatar }),
    });

    if (!response.redirected) {
      const responseData = await response.json();
      showToast(responseData.message);
      return;
    }

    globalThis.location.href = "/";
  } catch (error) {
    console.error("Login error:", error);
    showToast("An error occurred. Please try again later.");
  }
};

function selectAvatar(e) {
  document.getElementById("avatarSrc").value = "";
  document.getElementById("avatarSrc").value = e.target.src;

  document.querySelectorAll("img").forEach((img) => {
    img.classList.remove("selected-image");
  });

  e.target.classList.add("selected-image");
}

const handleFormSubmit = (event) => {
  event.preventDefault();

  const usernameInput = event.target.querySelector("#username").value;
  const src = document.getElementById("avatarSrc").value;

  if (!usernameInput) {
    showToast("Username must be filled out");
    return;
  }

  const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  if (!usernameRegex.test(usernameInput)) {
    showToast(
      "Username must contain only letters, numbers, and underscores, and cannot start with a number"
    );
  }

  handleLogin(usernameInput, src);
};

const initializeApp = () => {
  const loginForm = document.querySelector("form");
  const avatars = document.querySelectorAll("img");
  loginForm.addEventListener("submit", handleFormSubmit);
  avatars.forEach((img) => {
    img.addEventListener("click", selectAvatar);
  });
};

globalThis.onload = initializeApp;
