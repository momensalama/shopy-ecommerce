const burger = document.querySelector("nav .burger-icon");
const navContent = document.querySelector(".nav-content");
const closeNav = document.querySelector(".nav-content .logo .close");
const overlay = document.querySelector(".overlay");
const cart = document.querySelector("header nav .user-info .cart");
const cartContent = document.querySelector("header .cart-content");
const closeCart = document.querySelector("header .cart-content .close-cart");

// functions
const slideContent = function () {
  overlay.classList.add("show");
  document.body.classList.add("stop-scorll");
};

const closeContent = function () {
  overlay.classList.remove("show");
  document.body.classList.remove("stop-scorll");
};

// Event handler
burger.addEventListener("click", () => {
  slideContent();
  navContent.classList.add("slide");
});

closeNav.addEventListener("click", () => {
  closeContent();
  navContent.classList.remove("slide");
});

overlay.addEventListener("click", () => {
  closeContent();
  navContent.classList.remove("slide");
  cartContent.classList.remove("show-cart");
});

cart.addEventListener("click", () => {
  slideContent();
  cartContent.classList.add("show-cart");
});

closeCart.addEventListener("click", () => {
  closeContent();
  cartContent.classList.remove("show-cart");
});

async function fetchAuth(username, password) {
  try {
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

const alertMessage = document.querySelector(".account .alert-message");

document
  .querySelector(".login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the input values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "" || password === "") {
      alertMessage.innerHTML = `
      <div class="alert alert-warning" role="alert">
      username or password can not be empty. Please try again.
      </div>
      `;
    } else if (username === "kminchelle" && password === "0lelplR") {
      alertMessage.innerHTML = `
      <div class="alert alert-success" role="alert">Login successful!</div>
      `;
      fetchAuth(username, password);
      window.location.href = "../index.html";
    } else {
      alertMessage.innerHTML = `
      <div class="alert alert-danger" role="alert">
      Invalid username or password. Please try again.
      </div>
      `;
    }
  });
