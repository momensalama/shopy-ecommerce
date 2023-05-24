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
