// script.js - POS Logic

// Sample function to fetch and populate menu items
async function loadMenu() {
  const res = await fetch('Menu.html');
  const html = await res.text();
  const dummy = document.createElement('div');
  dummy.innerHTML = html;

  const items = dummy.querySelectorAll('.menu-item');
  const menuGrid = document.getElementById('menuGrid');

  items.forEach(item => {
    const name = item.querySelector('h4')?.textContent || 'Item';
    const price = parseFloat(item.dataset.price) || 100;

    const card = document.createElement('div');
    card.className = 'menu-item';
    card.innerHTML = `<h4>${name}</h4><p>₹${price.toFixed(2)}</p><button onclick="addToCart('${name}', ${price})">Add</button>`;
    menuGrid.appendChild(card);
  });
}

function loadStoreDetails() {
  fetch('Store.html').then(res => res.text()).then(html => {
    const dummy = document.createElement('div');
    dummy.innerHTML = html;
    const name = dummy.querySelector('#storeName')?.textContent || 'POS System';
    document.getElementById('storeName').textContent = name;
  });
}

function loadUser() {
  fetch('Register.html').then(res => res.text()).then(html => {
    const dummy = document.createElement('div');
    dummy.innerHTML = html;
    const user = dummy.querySelector('#loggedInUser')?.textContent;
    if (user) console.log('Logged in as:', user);
  });
}

const cart = {};

function addToCart(name, price) {
  if (!cart[name]) cart[name] = { quantity: 0, price };
  cart[name].quantity++;
  renderCart();
}

function removeFromCart(name) {
  delete cart[name];
  renderCart();
}

function updateQuantity(name, qty) {
  cart[name].quantity = parseInt(qty) || 1;
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';

  let subtotal = 0;
  Object.entries(cart).forEach(([name, { quantity, price }]) => {
    subtotal += price * quantity;
    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${name}</span>
        <input type="number" value="${quantity}" onchange="updateQuantity('${name}', this.value)" />
        <span>₹${(price * quantity).toFixed(2)}</span>
        <button onclick="removeFromCart('${name}')">✖</button>
      </div>
    `;
  });

  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('tax').textContent = tax.toFixed(2);
  document.getElementById('total').textContent = total.toFixed(2);
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'f') document.getElementById('searchInput').focus();
  if (e.ctrlKey && e.key === 'p') document.getElementById('printBtn').click();
});

// Initialize
window.onload = () => {
  loadMenu();
  loadStoreDetails();
  loadUser();
};
