let total = 0;
let orderItems = {};

function animateTotalPrice(oldTotal, newTotal) {
    const display = document.getElementById("total-display");
    const animationDuration = 500;
    const increment = (newTotal - oldTotal) / (animationDuration / 10);

    let currentTotal = oldTotal;

    const animation = setInterval(() => {
        currentTotal += increment;
        if ((increment > 0 && currentTotal >= newTotal) || (increment < 0 && currentTotal <= newTotal)) {
            currentTotal = newTotal;
            clearInterval(animation);
        }
        display.innerText = `Total: $${Math.max(currentTotal, 0).toFixed(2)}`;
    }, 10);
}

function updateBucketDisplay() {
    const bucketItemsContainer = document.getElementById("bucket-items");
    bucketItemsContainer.innerHTML = '';

    for (const [id, item] of Object.entries(orderItems)) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('bucket-item');
        itemDiv.innerHTML = ` 
            <span>${item.quantity} x ${item.name} - $${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeOrder(${id})" class="remove-button">Remove</button>
        `;
        bucketItemsContainer.appendChild(itemDiv);
    }
}

function addOrder(id, name, price) {
    const quantity = document.getElementById(`quantity${id}`).value;
    const itemTotal = price * quantity;

    if (orderItems[id]) {
        orderItems[id].quantity += parseInt(quantity);
    } else {
        orderItems[id] = {
            name: name,
            price: price,
            quantity: parseInt(quantity)
        };
    }

    const oldTotal = total;
    total += itemTotal;
    animateTotalPrice(oldTotal, total);
    updateBucketDisplay();
}

function removeOrder(id) {
    if (orderItems[id]) {
        const itemTotal = orderItems[id].price * orderItems[id].quantity;
        delete orderItems[id];

        const oldTotal = total;
        total -= itemTotal;
        animateTotalPrice(oldTotal, total);
        updateBucketDisplay();
    }
}

function placeOrder() {
    if (Object.keys(orderItems).length === 0) {
        showModalMessage("No items in your order.");
        return;
    }

    let orderSummary = "Your Order:<br><br>";
    let totalPrice = 0;

    for (const [id, item] of Object.entries(orderItems)) {
        const itemTotal = item.price * item.quantity;
        orderSummary += `${item.quantity} x ${item.name} - $${itemTotal.toFixed(2)}<br><br>`;
        totalPrice += itemTotal;
    }

    orderSummary += `<br><strong>Total Price: $${totalPrice.toFixed(2)}<br><br>Your Order Has Been Placed</strong><br>and will not be delivered to you`;
    
    showModalMessage(orderSummary);

    orderItems = {};
    const oldTotal = total;
    total = 0;

    animateTotalPrice(oldTotal, total);
    updateBucketDisplay();
}

function showModalMessage(message) {
    document.getElementById("modalMessage").innerHTML = message;
    document.getElementById("messageModal").style.display = "flex";
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("closeModal").onclick = function() {
        document.getElementById("messageModal").style.display = "none";
    };
});

window.onclick = function(event) {
    if (event.target === document.getElementById("messageModal")) {
        document.getElementById("messageModal").style.display = "none";
    }
};