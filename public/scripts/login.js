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

    if (response.status !== 302) {
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

  handleLogin();
};

const initializeApp = () => {
  const loginForm = document.querySelector('form');
  loginForm.addEventListener('submit', handleFormSubmit);
};

globalThis.onload = initializeApp;