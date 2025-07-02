const { readData, writeData } = require('../utils/fileHelper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const users = readData('users.json');
  const { name, email, password, isAdmin } = req.body;

  if (users.find(u => u.email === email)) return res.status(400).json({ message: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), name, email, password: hashed, isAdmin };
  users.push(newUser);
  writeData('users.json', users);
  res.status(201).json(newUser);
};

exports.loginUser = async (req, res) => {
  const users = readData('users.json');
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
};

exports.getCurrentUser = (req, res) => {
  const users = readData('users.json');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const { password, ...rest } = user;
  res.json(rest);
};
