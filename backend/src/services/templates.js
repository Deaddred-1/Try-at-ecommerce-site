export const welcomeEmailTemplate = (name) => `
  <h2>Welcome to Sylera, ${name}! </h2>
  <p>Your account has been created successfully.</p>
  <p>We're excited to have you with us.</p>
`;

export const orderPlacedTemplate = (orderId, total) => `
  <h2>Order Placed Successfully </h2>
  <p>Your order ID: <strong>${orderId}</strong></p>
  <p>Total Amount: ₹${total}</p>
  <p>We’ll notify you once it’s confirmed.</p>
`;

export const orderConfirmedTemplate = (orderId) => `
  <h2>Your Order is Confirmed </h2>
  <p>Order ID: <strong>${orderId}</strong></p>
  <p>Your order is being prepared for shipping.</p>
`;

export const orderDeliveredTemplate = (orderId) => `
  <h2>Your Order Has Been Delivered </h2>
  <p>Order ID: <strong>${orderId}</strong></p>
  <p>We hope you love your purchase!</p>
`;

export const adminNewOrderTemplate = (orderId, userEmail, total) => `
  <h2>New Order Received </h2>
  <p>Order ID: <strong>${orderId}</strong></p>
  <p>Customer Email: ${userEmail}</p>
  <p>Total: ₹${total}</p>
`;