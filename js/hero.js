let currentIndex=0;
const visibleItemCount=3;
let currentDrinkPrice=0;
let currentQuantity=1;

async function fetchDrinkData(){
  try{
    const response = await fetch("js/foods.json");
    const data = await response.json();

    // Pick which category to show in hero carousel:
    const heroCategory = "Soft Drinks";

    const drinks = data.categories[heroCategory] || [];
    if (!drinks.length) return;

    renderDrinkCarousel(drinks);
    updateHeroImage(drinks[0]);
    setupArrowNavigation(drinks);
  }catch(err){
    console.log(err);
  }
}

function renderDrinkCarousel(drinks){
  const container = document.querySelector(".food-items");
  if (!container) return;

  container.innerHTML = "";

  drinks.forEach((drink, index) => {
    const el = document.createElement("div");
    el.classList.add("food-item");
    if (index === 0) {
      el.classList.add("selected");
      currentDrinkPrice = Number(drink.price) || 0;
      const total = document.querySelector(".price");
      if (total) total.textContent = `$${currentDrinkPrice.toFixed(2)}`;
    }

    el.innerHTML = `
      <img src="${drink.image}" alt="${drink.name}"/>
      <p>${drink.name}<br>
        <span class="food-price"><span class="valute">$</span>${Number(drink.price || 0).toFixed(2)}</span>
      </p>
    `;

    if (index >= visibleItemCount) el.style.display = "none";

    el.addEventListener("click", () => {
      selectDrinkItem(drink, el);
      currentIndex = index;
    });

    container.appendChild(el);
  });
}

function updateTotalPrice(){
  const totalPrice = document.querySelector(".order-info-total .price");
  const total = currentDrinkPrice * currentQuantity;
  if (totalPrice) totalPrice.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(newQuantity){
  currentQuantity = newQuantity;
  const quantityEl = document.querySelector(".quantity");
  if (quantityEl) quantityEl.textContent = currentQuantity;
  updateTotalPrice();
}

function updateHeroImage(selectedDrink){
  const hero = document.querySelector(".hero-image");
  if (!hero) return;

  const rating = Number(selectedDrink.rating ?? 4.7);
  const prep = selectedDrink.preparation ?? "1 min";

  hero.innerHTML = `
    <img class="hero-main-image" src="${selectedDrink.image}" alt="${selectedDrink.name}"/>
    <div class="food-details">
      <div class="food-title">
        <p>${selectedDrink.name}</p>
        <p><i class="fa-solid fa-star"></i>${rating.toFixed(1)}</p>
      </div>
      <p class="prepare-time">
        <i class="fa-regular fa-clock"></i>${prep}
      </p>
    </div>
  `;
}

function selectDrinkItem(selectedDrink, selectedEl){
  updateHeroImage(selectedDrink);
  currentDrinkPrice = Number(selectedDrink.price) || 0;
  updateQuantity(currentQuantity);

  document.querySelectorAll(".food-item").forEach(x => x.classList.remove("selected"));
  selectedEl.classList.add("selected");
}

const incBtn = document.getElementById("increment");
if (incBtn){
  incBtn.addEventListener("click",()=> updateQuantity(currentQuantity+1));
}
const decBtn = document.getElementById("decrement");
if (decBtn){
  decBtn.addEventListener("click",()=> { if (currentQuantity>1) updateQuantity(currentQuantity-1); });
}

function updateVisibleItems(){
  const items = document.querySelectorAll(".food-item");
  items.forEach((item, idx) => {
    if (idx >= currentIndex && idx < currentIndex + visibleItemCount) item.style.display = "block";
    else item.style.display = "none";
  });
}

function setupArrowNavigation(drinks){
  const left = document.querySelector(".left-arrow");
  const right = document.querySelector(".right-arrow");
  if (!left || !right) return;

  left.addEventListener("click", () => {
    if (currentIndex > 0) currentIndex--;
    else currentIndex = Math.max(0, drinks.length - visibleItemCount);
    updateVisibleItems();
  });

  right.addEventListener("click", () => {
    if (currentIndex < drinks.length - visibleItemCount) currentIndex++;
    else currentIndex = 0;
    updateVisibleItems();
  });
}

document.querySelector(".add-to-cart")?.addEventListener("click",()=>{
  const selected = {
    name: document.querySelector(".food-title p:first-of-type")?.textContent || "Item",
    price: currentDrinkPrice,
    image: document.querySelector(".hero-main-image")?.getAttribute("src") || "img/placeholder.png",
  };
  addToCart(selected);
});

function addToCart(selected){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const idx = cart.findIndex(i => i.name === selected.name);
  if (idx !== -1) cart[idx].quantity += currentQuantity;
  else cart.push({ name:selected.name, price:selected.price, image:selected.image, quantity: currentQuantity });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();

  if (window.Toastify){
    Toastify({
      text: `${selected.name} is added to the cart!`,
      duration: 2500,
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

document.addEventListener("DOMContentLoaded",()=>{
  fetchDrinkData();
  updateCartBadge();
});
