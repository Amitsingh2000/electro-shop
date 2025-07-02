const { readData, writeData } = require('../utils/fileHelper');

exports.getAllOrders = (req, res) => {
  const orders = readData('orders.json');
  res.json(orders);
};

exports.getOrderById = (req, res) => {
  const orders = readData('orders.json');
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

exports.createOrder = (req, res) => {
  const orders = readData('orders.json');
  const newOrder = { ...req.body, id: Date.now().toString() };
  orders.push(newOrder);
  writeData('orders.json', orders);
  res.status(201).json(newOrder);
};

exports.updateOrder = (req, res) => {
  let orders = readData('orders.json');
  orders = orders.map(o => o.id === req.params.id ? { ...o, ...req.body } : o);
  writeData('orders.json', orders);
  res.json({ message: 'Order updated' });
};

exports.deleteOrder = (req, res) => {
  let orders = readData('orders.json');
  orders = orders.filter(o => o.id !== req.params.id);
  writeData('orders.json', orders);
  res.json({ message: 'Order deleted' });
};
