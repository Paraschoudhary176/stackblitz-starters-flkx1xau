const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Endpoint 1: Calculate the total price of items in the cart

app.get('/newItemPrice', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  let total = newItemPrice + cartTotal;
  return res.send(total.toString());
});

// Endpoint 2 : Apply a discount based on membership status
const DISCOUNT_PERCENTAGE = 10;
app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember === 'true';
  if (isNaN(cartTotal) || cartTotal < 0) {
    return res
      .status(400)
      .send('Invalid cartTotal value. It must be a positive number.');
  }
  let finalPrice = isMember
    ? cartTotal - (cartTotal * DISCOUNT_PERCENTAGE) / 100
    : cartTotal;
  res.send(finalPrice.toString());
});

// Endpoint:3 to calculate tax on cart total
const TAX_PERCENTAGE = 5;
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  if (isNaN(cartTotal) || cartTotal < 0) {
    return res
      .status(400)
      .send('Invalid cartTotal value. It must be a positive number.');
  }
  let tax = (cartTotal * TAX_PERCENTAGE) / 100;
  res.send(tax.toString());
});

// Endpoint 4 : Estimate delivery time based on shipping method
app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  if (!shippingMethod || isNaN(distance) || distance < 0) {
    return res
      .status(400)
      .send(
        'Invalid input. Provide a valid shipping method and a non-negative distance.'
      );
  }
  let deliveryDays;
  if (shippingMethod.toLowerCase() === 'standard') {
    deliveryDays = Math.ceil(distance / 50);
  } else if (shippingMethod.toLowerCase() === 'express') {
    deliveryDays = Math.ceil(distance / 100);
  } else {
    return res
      .status(400)
      .send('Invalid shipping method. Use "standard" or "express".');
  }
  res.send(deliveryDays.toString());
});

// Endpoint 5 : Calculate the shipping cost based on weight and distance
app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  if (isNaN(weight) || weight <= 0 || isNaN(distance) || distance < 0) {
    return res
      .status(400)
      .send(
        'Invalid input. Provide a positive weight and a non-negative distance.'
      );
  }
  let shippingCost = weight * distance * 0.1;
  res.send(shippingCost.toString());
});

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  if (isNaN(purchaseAmount) || purchaseAmount <= 0) {
    return res
      .status(400)
      .send('Invalid purchaseAmount. It must be a positive number.');
  }
  let loyaltyPoints = purchaseAmount * 2;
  res.send(loyaltyPoints.toString());
});
