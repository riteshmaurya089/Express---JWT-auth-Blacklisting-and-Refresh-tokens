const User = require('../models/User');
const Token = require('../models/Token');
const generateTokens = require('../utils/generateTokens');
const verifyToken = require('../utils/verifyToken');

// Register
const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const { accessToken, refreshToken } = generateTokens(user._id);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(400).json({ message: 'Login failed', error: err.message });
  }
};

// Logout
const logout = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    await Token.create({ token });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Logout failed', error: err.message });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { accessToken } = generateTokens(decoded.userId);
    res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ message: 'Invalid refresh token' });
  }
};

module.exports = { register, login, logout, refreshToken };