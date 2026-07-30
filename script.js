const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const addProductButton = document.getElementById('add-product');
const cart = document.getElementById('cart');
const totalPriceSpan = document.getElementById('total-price');

let totalPrice = 0;

// Function to update the total price
function updateTotalPrice(amount) {
  totalPrice += amount;
  totalPriceSpan.textContent = totalPrice.toFixed(2);
}

// Remove item (fixed to subtract price * quantity)
function removeItem(event) {
  const item = event.target.closest('li');
  if (!item) return;
  const unitPrice = parseFloat(item.dataset.price);
  const qty = Number(item.dataset.qty || item.querySelector('input[type="number"]').value || 1);
  const amountToSubtract = unitPrice * qty;
  updateTotalPrice(-amountToSubtract);
  item.remove();
}

// Add product handler
addProductButton.addEventListener('click', () => {
  const name = productNameInput.value.trim();
  const price = parseFloat(productPriceInput.value);

  // Basic validation
  if (!name) {
    alert('Please enter a product name.');
    return;
  }
  if (Number.isNaN(price) || price < 0) {
    alert('Please enter a valid non-negative price.');
    return;
  }

  // Create list item
  const li = document.createElement('li');

  // Store unit price and initial quantity on the element
  li.dataset.price = price.toFixed(2);
  li.dataset.qty = '1';

  // Structure: <span class="label">Name - $price</span> <input qty> <button remove>
  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = `${name} - $${Number(price).toFixed(2)} `;

  const qtyInput = document.createElement('input');
  qtyInput.type = 'number';
  qtyInput.min = '1';
  qtyInput.value = '1';
  qtyInput.style.width = '60px';
  qtyInput.setAttribute('aria-label', `Quantity for ${name}`);

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';

  li.appendChild(label);
  li.appendChild(qtyInput);
  li.appendChild(removeBtn);
  cart.appendChild(li);

  // Update total by price * initial qty (1)
  updateTotalPrice(price);

  // Quantity change handler: compute delta and update total
  qtyInput.addEventListener('input', (e) => {
    const newQty = Math.max(1, Number(e.target.value) || 1);
    const oldQty = Number(li.dataset.qty || 1);
    // normalize input value
    e.target.value = newQty;
    li.dataset.qty = String(newQty);

    const unitPrice = parseFloat(li.dataset.price);
    const delta = (newQty - oldQty) * unitPrice;
    updateTotalPrice(delta);
  });

  // Remove handler
  removeBtn.addEventListener('click', removeItem);

  productNameInput.value = '';
  productPriceInput.value = '';
  productNameInput.focus();
});

