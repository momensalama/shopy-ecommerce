const burger = document.querySelector("nav .burger-icon");
const navContent = document.querySelector(".nav-content");
const itemCount = document.querySelector("header .items-count");
const closeNav = document.querySelector(".nav-content .logo .close");
const overlay = document.querySelector(".overlay");
const filterBtn = document.querySelector(".filter-button");
const closeFilter = document.querySelector(".close-filter");
const filterContent = document.querySelector(".filter");
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
const minRangeValue = document.querySelector(
  ".filter .price-range .price .min"
);
const maxRangeValue = document.querySelector(
  ".filter .price-range .price .max"
);
const rangeInput = document.querySelector(".filter .price-range .range input");
const ProductContainer = document.querySelector(
  ".products .products-container"
);
const categoryName = document.querySelector(
  ".shop .shop-container .products-content .main-title"
);
const PreviewContainer = document.querySelector(".products .previews");

const searchInput = document.querySelector("header form input");
const searchedProdutsContainer = document.querySelector(
  "header form .searched-products ul"
);

const categoryContainer = document.querySelector(".shop .categories-filter ul");

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
  filterContent.classList.remove("show-filter");
  navContent.classList.remove("slide");
  cartContent.classList.remove("show-cart");
});

filterBtn.addEventListener("click", () => {
  slideContent();
  filterContent.classList.add("show-filter");
});

closeFilter.addEventListener("click", () => {
  closeContent();
  filterContent.classList.remove("show-filter");
});

cartIcon.addEventListener("click", () => {
  slideContent();
  cartContent.classList.add("show-cart");
});

closeCart.addEventListener("click", () => {
  closeContent();
  cartContent.classList.remove("show-cart");
});

async function fetchData() {
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
    id="${product.id}"
  >
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
      >+ dd to cart</a
    >
  </div>
`;
  });
}

async function renderProducts() {
  const products = await fetchData();
  displayProducts(products);
  setPrice(products);
  displayPreviews(products);
  // render the pagination
  const productElements = document.querySelectorAll(".products .product");
  paginate(productElements);
  renderPreviews(productElements);
}

renderProducts();

let cart = JSON.parse(localStorage.getItem("items")) || [];
updateCart();

async function addToCart(id) {
  const products = await fetchData();
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

async function fetchCategories() {
  try {
    const response = await fetch("https://dummyjson.com/products/categories");
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function renderCategories() {
  const categories = await fetchCategories();
  categories.forEach((category) => {
    categoryContainer.innerHTML += `
    <li class="pb-1 pt-1">
      <a class="fw-medium">${category}</a>
    </li>
    `;
  });
  const categoryLinks = document.querySelectorAll(
    ".shop .categories-filter ul li a"
  );
  filterCategories(categoryLinks);
}

renderCategories();

function filterCategories(categories) {
  categories.forEach((e) => {
    e.addEventListener("click", (e) => {
      let clicked = e.target.textContent;
      categoryName.textContent = clicked;
      filterProductsCategories(clicked);
    });
  });
}

async function filterProductsCategories(name) {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/category/${name}`
    );
    const result = await response.json();

    displayFilteredProducts(result.products);
  } catch (error) {
    console.error(error);
  }
}

function displayFilteredProducts(products) {
  ProductContainer.innerHTML = "";
  displayProducts(products);
  displayPreviews(products);
  const productElements = document.querySelectorAll(".products .product");
  renderPreviews(productElements);
  paginate(productElements);
}

// pagination
const limit = 10;
let currentPage = 1;

function paginate(productElements) {
  let productsLength = productElements.length;
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  document.querySelector(".appearance .results .from").textContent =
    startIndex + 1;
  document.querySelector(".appearance .results .to").textContent = `${
    limit > productsLength ? productsLength : endIndex
  }`;

  document.querySelector(".appearance .results .total").textContent =
    productsLength;

  productElements.forEach((product, index) => {
    product.style.display =
      index >= startIndex && index < endIndex ? "block" : "none";
  });

  renderPagination(productElements);
}

function renderPagination(productElements) {
  const totalPages = Math.ceil(productElements.length / limit);
  const pagination = document.querySelector(".pagination");

  pagination.innerHTML = "";

  if (totalPages <= 1) {
    return;
  }

  if (currentPage > 1) {
    pagination.appendChild(
      createPageLink("<-", currentPage - 1, productElements)
    );
  }

  for (let i = 1; i <= totalPages; i++) {
    pagination.appendChild(createPageLink(i, i, productElements));
  }

  if (currentPage < totalPages) {
    pagination.appendChild(
      createPageLink("->", currentPage + 1, productElements)
    );
  }
}

function createPageLink(text, pageNumber, productElements) {
  const link = document.createElement("li");
  link.classList = "pb-2 pt-2 pe-3 ps-3 rounded";
  link.innerText = text;

  if (pageNumber === currentPage) {
    link.classList.add("active");
  }

  link.addEventListener("click", () => {
    currentPage = pageNumber;
    paginate(productElements);
  });

  return link;
}

// range slider
function setPrice(products) {
  const prices = products.map((product) => product.price);

  let minPrice = Math.min(...prices);
  let maxPrice = Math.max(...prices);

  minRangeValue.textContent = `$${minPrice}`;
  maxRangeValue.textContent = `$${maxPrice}`;

  rangeInput.setAttribute("value", minPrice);
  rangeInput.setAttribute("min", minPrice);
  rangeInput.setAttribute("max", maxPrice);

  rangeInput.addEventListener("input", (e) => {
    minRangeValue.textContent = `$${e.target.value}`;
    filterProducts(products, e.target.value);
  });
}

function filterProducts(products, value) {
  ProductContainer.innerHTML = "";
  const filterProducts = products.filter((product) => product.price <= value);
  displayProducts(filterProducts);
  const filteredProducts = document.querySelectorAll(".products .product");
  renderPreviews(filteredProducts);
  paginate(filteredProducts);
}

async function fetchDataSearched(name) {
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

async function findMatchesProdducts() {
  const products = await fetchDataSearched(searchInput.value);
  if (searchInput.value == "") {
    searchedProdutsContainer.innerHTML = "";
  } else {
    products.forEach((product) => {
      let html = `
      <li class="d-flex align-items-center p-2 rounded">
        <div class="product-search__image me-3">
          <img class="rounded" src="${product.images[0]}" alt="${product.title}" />
        </div>
        <h6 class="name">${product.title}</h6>
      </li>
      `;
      searchedProdutsContainer.insertAdjacentHTML("beforeend", html);
    });
  }
}

searchInput.addEventListener("change", findMatchesProdducts);
searchInput.addEventListener("keyup", findMatchesProdducts);

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
        <div class="image-showcase d-flex m-auto">
          <img class="rounded" src="${preview.images[0]}" alt="" />
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
        <a onclick="addToCart(${preview.id})" class="add-to__cart p-2 fw-medium rounded">+ dd to cart</a>
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
