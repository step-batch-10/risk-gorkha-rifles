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
    onClick: function () { }
  }).showToast();
};

const handleLogin = async (username) => {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });

    if (!response.redirected) {
      const responseData = await response.json();
      showToast(responseData.message);
      return;
    }

    globalThis.location.href = '/';
  } catch (error) {
    console.error("Login error:", error);
    showToast("An error occurred. Please try again later.");
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const usernameInput = event.target.querySelector("#username").value;
  if (!usernameInput) {
    showToast("Username must be filled out");
    return;
  }
  const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  if (!usernameRegex.test(usernameInput)) {
    showToast("Username must contain only letters, numbers, and underscores, and cannot start with a number")
  }

  handleLogin(usernameInput);
};

const initializeApp = () => {
  const loginForm = document.querySelector('form');
  loginForm.addEventListener('submit', handleFormSubmit);
};

globalThis.onload = initializeApp;