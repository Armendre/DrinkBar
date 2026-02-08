async function fetchMenuData(){
  try{
    const response = await fetch("js/foods.json");
    const data = await response.json();

    renderCategories(data.categories);

    const firstCategory = Object.keys(data.categories)[0];
    renderMenuItems(data.categories[firstCategory], firstCategory);

    setupCategorySwitching(data.categories);

    document.querySelector(".menu-category")?.classList.add("active");
  }catch(err){
    console.log(err);
  }
}

function renderCategories(categories){
  const container = document.querySelector(".menu-categories");
  container.innerHTML = "";

  Object.keys(categories).forEach((categoryName, index) => {
    const el = document.createElement("div");
    el.classList.add("menu-category");
    if (index === 0) el.classList.add("active");

    // Pick icon based on category name
    let icon = "img/cola.svg";
    const c = categoryName.toLowerCase();
    if (c.includes("energy")) icon = "img/energy.svg";
    if (c.includes("coffee") || c.includes("tea")) icon = "img/coffee.svg";

    el.innerHTML = `
      <img width="200px" src="${icon}" alt="${categoryName}">
      <div class="menu-category-info">
        <h3 class="menu-category-title">${categoryName}</h3>
        <p class="text-gray">${categories[categoryName].length} items</p>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderMenuItems(items, categoryName){
  const container = document.querySelector(".menu-items");
  const titleEl = document.querySelector(".primary-title");

  if (titleEl) titleEl.textContent = `${categoryName} Menu`;
  container.innerHTML = "";

  items.forEach((item) => {
    const el = document.createElement("div");
    el.classList.add("menu-item");

    el.innerHTML = `
      <div class="menu-item-header">
        <img class="menu-item-img" src="${item.image}" alt="${item.name}"/>
        <div class="menu-item-title">
          <h3>${item.name}</h3>
          <p class="text-gray menu-item-desc">${item.description ?? ""}</p>
        </div>
      </div>

      <div class="menu-item-footer">
        <h3 class="menu-item-price"><span class="text-gray">$</span>${Number(item.price || 0).toFixed(2)}</h3>
        <button class="menu-item-button"
          data-name="${item.name}"
          data-price="${item.price}"
          data-image="${item.image}">
          Add to cart
        </button>
      </div>
    `;
    container.appendChild(el);
  });

  document.querySelectorAll(".menu-item-button").forEach((btn)=>{
    btn.addEventListener("click",()=>{
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      const image = btn.getAttribute("data-image");
      addToCart({name, price, image});
    });
  });
}

function addToCart(selected){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const idx = cart.findIndex(i => i.name === selected.name);
  if (idx !== -1) cart[idx].quantity += 1;
  else cart.push({ name:selected.name, price:selected.price, image:selected.image, quantity:1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  renderInvoice();

  if (window.Toastify){
    Toastify({
      text: `${selected.name} added to the cart!`,
      duration: 2500,
      close: true,
      gravity: "bottom",
      position: "center",
      backgroundColor: "var(--primary-color)"
    }).showToast();
  }
}

function updateCartBadge(){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.getElementById("cart-badge");
  if (badge) badge.textContent = cart.length;
}

function setupCategorySwitching(categories){
  const categoryEls = document.querySelectorAll(".menu-category");
  categoryEls.forEach((el)=>{
    el.addEventListener("click", ()=>{
      const selectedName = el.querySelector(".menu-category-title").textContent;
      categoryEls.forEach(x => x.classList.remove("active"));
      el.classList.add("active");
      renderMenuItems(categories[selectedName], selectedName);
    });
  });
}

function renderInvoice(){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const invoiceContainer = document.querySelector(".invoice-items");
  const summaryContainer = document.querySelector(".payment-summary");
  if (!invoiceContainer || !summaryContainer) return;

  let subTotal = 0;
  invoiceContainer.innerHTML = "<h2>Invoice</h2>";

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subTotal += itemTotal;

    const el = document.createElement("div");
    el.classList.add("invoice-item");
    el.innerHTML = `
      <img class="invoice-item-img" src="${item.image}" alt="${item.name}">
      <div class="invoice-item-details">
        <h3>${item.name}</h3>
        <div class="invoice-item-quantity">
          <button class="quantity-btn decrease" data-index="${index}">-</button>
          <input type="text" class="quantity-input" value="${item.quantity}">
          <button class="quantity-btn increase" data-index="${index}">+</button>
        </div>
      </div>
      <div class="invoice-item-price">
        <h3>$${itemTotal.toFixed(2)}</h3>
      </div>
    `;
    invoiceContainer.appendChild(el);
  });

  const tax = subTotal * 0.04;
  const total = subTotal + tax;

  summaryContainer.innerHTML = `
    <h3>Payment Summary</h3>
    <div class="summary-detail"><p class="text-gray">Sub Total</p><p>$${subTotal.toFixed(2)}</p></div>
    <div class="summary-detail"><p class="text-gray">Tax</p><p>$${tax.toFixed(2)}</p></div>
    <div class="summary-total"><p class="text-gray">Total Payment</p><p>$${total.toFixed(2)}</p></div>
    <button class="pay-button">Pay $${total.toFixed(2)}</button>
  `;

  document.querySelectorAll(".quantity-btn.increase").forEach(btn=>{
    btn.addEventListener("click",(event)=>{
      const index = event.target.dataset.index;
      updateCartQuantity(index, 1);
    });
  });
  document.querySelectorAll(".quantity-btn.decrease").forEach(btn=>{
    btn.addEventListener("click",(event)=>{
      const index = event.target.dataset.index;
      updateCartQuantity(index, -1);
    });
  });

  document.querySelector(".pay-button")?.addEventListener("click", ()=>{
    document.getElementById("payment-modal").style.display = "flex";
  });
}

function updateCartQuantity(index, change){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart[index];
  if (item){
    item.quantity += change;
    if (item.quantity < 1) cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderInvoice();
  updateCartBadge();
}

document.addEventListener("DOMContentLoaded", ()=>{
  fetchMenuData();
  updateCartBadge();
  renderInvoice();
});
