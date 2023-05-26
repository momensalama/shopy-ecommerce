// selectors
const burger = document.querySelector("nav .burger-icon");
const navContent = document.querySelector(".nav-content");
const itemCount = document.querySelector("header .items-count");
const closeNav = document.querySelector(".nav-content .logo .close");
const overlay = document.querySelector(".overlay");
const cartIcon = document.querySelector("header nav .user-info .cart");
const cartContent = document.querySelector("header .cart-content");
const CartContainer = document.querySelector(
  ".cart-products .products-container__cart"
);
const cartItems = document.querySelector("header .cart-products");
const closeCart = document.querySelector("header .cart-content .close-cart");
const cartTitle = document.querySelector(".cart-products .cart-title span");
const removeProduct = document.querySelector(".cart-products .remove-product");
const subTotalPrice = document.querySelector(
  "header .cart-products .total-price_container .total-price"
);
const ProductContainer = document.querySelector(
  ".products .products-container"
);
const searchInput = document.querySelector("header form input");

const searchedProductsContainer = document.querySelector(
  ".searched-products ul"
);
const searchForm = document.querySelector("header form");

const PreviewContainer = document.querySelector(".products .previews");

const PreviewProducts = document.querySelectorAll(
  ".products .preview-container"
);

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

cartIcon.addEventListener("click", () => {
  slideContent();
  cartContent.classList.add("show-cart");
});

closeCart.addEventListener("click", () => {
  closeContent();
  cartContent.classList.remove("show-cart");
});

// slider
// const slider = document.querySelector(".categories .category-container");
// let startX;
// let scrollLeft;
// let isDown = false;

// slider.addEventListener("mousedown", (e) => {
//   isDown = true;
//   console.log(e.pageX);
//   startX = e.pageX - slider.offsetLeft;
//   scrollLeft = slider.scrollLeft;
// });
// slider.addEventListener("mouseleave", () => {
//   isDown = false;
// });
// slider.addEventListener("mouseup", () => {
//   isDown = false;
// });
// slider.addEventListener("mousemove", (e) => {
//   if (!isDown) return;
//   console.count(isDown);
//   e.preventDefault();

//   const x = e.pageX - slider.offsetLeft;
//   const walk = x - startX;

//   slider.scrollLeft = scrollLeft - walk;
// });

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const result = await response.json();
    return result.products;
  } catch (error) {
    console.error(error);
  }
}

function displayProducts(products) {
  products.forEach((product) => {
    ProductContainer.innerHTML += `
    <div
    class="product rounded p-3"
    id="${product.id}">
    <a class="product-img">
      <div class="image mb-5 position-relative">
        <div class="brand p-1 rounded position-absolute end-0">
          ${product.brand}
        </div>
        <img class="img-fluid rounded" src="${product.images[0]}" alt="" />
      </div>
    </a>
    <a class="product-name fw-semibold" href="#">${product.title}</a>
    <p class="description mt-2 mb-1">
      ${product.description}
    </p>
    <div class="rate d-flex align-items-center m-1 ms-0 me-0">
      <i class="fa-solid fa-star"></i>
      <span class="ms-1">${product.rating}</span>
    </div>
    <div class="price mb-3">
      <span class="fw-medium">$${product.price}</span>
    </div>
    <a
      onclick="addToCart(${product.id})"
      class="add-to__cart p-2 fw-medium rounded"
      >+ add to cart</a
    >
  </div>
`;
  });
}

async function renderProducts() {
  const products = await fetchProducts();
  displayProducts(products);
  displayPreviews(products);
  // render the pagination
  const productElements = document.querySelectorAll(".products .product");
  renderPreviews(productElements);
}

renderProducts();

let cart = JSON.parse(localStorage.getItem("items")) || [];
updateCart();

async function addToCart(id) {
  const products = await fetchProducts();
  if (cart.some((item) => item.id === id)) {
    alert("product Already in cart!");
  } else {
    const item = products.find((product) => product.id === id);
    cart.push({
      ...item,
      numberOfUnits: 1,
    });
  }
  updateCart();
}

function updateCart() {
  renderCartItems();
  renderSubtotal();

  // save items in local Storage
  localStorage.setItem("items", JSON.stringify(cart));
}

function renderSubtotal() {
  let totalPrice = 0,
    totalItems = 0;
  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
    totalItems += item.numberOfUnits;
  });
  cartTitle.innerHTML = totalItems;
  subTotalPrice.innerHTML = `$${totalPrice}`;
  itemCount.innerHTML = totalItems;
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

function displayCartItems() {
  cart.forEach((item) => {
    let html = `
    <div class="product-content d-flex align-items-center pt-2 pb-2">
    <div class="product-info d-flex align-items-center">
      <div class="image w-25 me-3">
        <img
          class="img-fluid"
          src="${item.images[0]}"
          alt="${item.title}"
        />
      </div>
      <div class="product-details">
        <a href="#" class="product-cart__name fw-semibold">${item.title}</a>
        <div class="product-cart__price fw-medium">$${item.price}</div>
        <div
          class="counter d-flex align-items-center m-2 ms-0 me-0"
        >
          <button onclick="changeNumOfUnits('minus', ${item.id})" class="count-btn p-1 ps-3 pe-3 rounded-start decrease">
            -
          </button>
          <span class="p-1 ps-3 pe-3 amount">${item.numberOfUnits}</span>
          <button onclick="changeNumOfUnits('plus', ${item.id})" class="count-btn p-1 ps-3 pe-3 rounded-end increase">
            +
          </button>
        </div>
        <div onclick="removeItem(${item.id})" class="remove-product mt-3 d-flex align-items-center">
          <i class="fa-regular fa-trash-can me-1"></i>
          Remove item
        </div>
      </div>
    </div>
    <div class="main-price fw-semibold">$${item.price}</div>
  </div>
    `;
    CartContainer.insertAdjacentHTML("beforeend", html);
  });
}

// counter for items
function renderCartItems() {
  CartContainer.innerHTML = ""; // clear cart items
  displayCartItems();
}

function changeNumOfUnits(action, id) {
  cart = cart.map((item) => {
    let numberOfUnits = item.numberOfUnits;
    if (item.id === id) {
      if (action === "minus" && numberOfUnits > 1) {
        numberOfUnits--;
      } else if (action === "plus" && numberOfUnits < item.stock) {
        numberOfUnits++;
      }
    }
    return {
      ...item,
      numberOfUnits,
    };
  });
  updateCart();
}

async function fetchProductsByName(name) {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/search?q=${name}`
    );
    const result = await response.json();
    return result.products;
  } catch (error) {
    console.error(error);
  }
}

async function displayMatchingProducts(searchValue) {
  const products = await fetchProductsByName(searchValue);
  if (searchValue === "") {
    searchedProductsContainer.innerHTML = "";
  } else {
    searchedProductsContainer.innerHTML = products
      .map(
        (product) => `
        <li class="d-flex align-items-center p-2 rounded">
          <div class="product-search__image me-3">
            <img class="rounded" src="${product.images[0]}" alt="${product.title}" />
          </div>
          <h6 class="name">${product.title}</h6>
        </li>`
      )
      .join("");
  }
}

function handleSearchFormSubmit(event) {
  event.preventDefault();
  displayMatchingProducts(searchInput.value);
  searchInput.blur();
}

function handleSearchInputChange() {
  displayMatchingProducts(searchInput.value);
}

function initializeSearch() {
  searchForm.addEventListener("submit", handleSearchFormSubmit);
  searchInput.addEventListener("change", () => {
    searchedProductsContainer.innerHTML = "";
  });
  searchInput.addEventListener("keyup", handleSearchInputChange);
}

initializeSearch();

function displayPreviews(previews) {
  previews.forEach((preview) => {
    let html = `
    <div class="preview-container bg-white position-fixed top-50 start-50 rounded" id="${preview.id}">
    <div class="close-preview text-end me-1 me-lg-2 me-xl-2 mt-0 mt-lg-1 mt-xl-1 position-absolute end-0">
      <i class="fa-solid fa-xmark text-end"></i>
    </div>
    <div
      class="product-preview p-3 d-flex flex-wrap align-items-center justify-content-between"
    >
      <div
        class="image-preview text-center mb-4 mb-lg-0 mb-xl-0 me-0 me-lg-3 me-xl-3 overflow-hidden"
      >
        <div class="image-showcase h-100 d-flex justify-content-center m-auto">
          <img class="rounded img-fluid" src="${preview.images[0]}" alt="" />
        </div>
      </div>
      <div class="preview-info">
        <div
          class="heading d-flex justify-content-between align-items-center mb-2"
        >
          <h1 class="m-0">${preview.title}</h1>
          <div class="rate d-flex align-items-center">
            <span class="me-1">${preview.rating}</span>
            <i class="fa-solid fa-star"></i>
          </div>
        </div>
        <p>${preview.description}</p>
        <div class="price mb-3">
          <span class="fw-medium">$${preview.price}</span>
        </div>
        <a onclick="addToCart(${preview.id})" class="add-to__cart p-2 fw-medium rounded">+ add to cart</a>
      </div>
    </div>
  </div>
`;
    PreviewContainer.insertAdjacentHTML("beforeend", html);
  });
}

function renderPreviews(products) {
  products.forEach((product) => {
    product.addEventListener("click", (e) => {
      const PreviewProducts = document.querySelectorAll(
        ".products .preview-container"
      );
      if (e.target.closest(".add-to__cart")) return;
      PreviewProducts.forEach((preview) => {
        if (product.id === preview.id) {
          preview.classList.add("active");
          slideContent();
        }
        preview
          .querySelector(".close-preview")
          .addEventListener("click", () => {
            preview.classList.remove("active");
            closeContent();
          });
      });
    });
  });
}

// imgs.forEach((img) => {
//   img.addEventListener("click", (e) => {
//     e.preventDefault();
//     imgId = img.dataset.id;
//     selectedImgs.forEach((img) => {
//       img.classList.remove("active");
//     });

//     img.parentElement.classList.add("active");
//     moveImage();
//   });
// });

// function moveImage() {
//   const imgWidth = document.querySelector(
//     ".previews .product-preview .image-showcase img:first-child"
//   ).clientWidth;

//   let width = (imgId - 1) * imgWidth;

//   document.querySelector(
//     ".previews .product-preview .image-showcase"
//   ).style.transform = `translateX(${-width}px)`;
// }
