const { NotFound, BadRequest, Conflict, Unauthorized } = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_KEY } = process.env;

const { User } = require('../model/usersModel');

const signUp = async (req, res) => {
  const { password, email } = req.body;
  const duplicateUser = await User.findOne({ email });

  if (duplicateUser) {
    throw new Conflict('Email in use');
  }

  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const newUser = await User.create({ password: hashedPassword, email });

  res.json({
    status: 'created',
    code: 201,
    user: {
      email: newUser.email,
      subscription: 'starter',
    },
  });
};

const logIn = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Unauthorized('Email or password is wrong');
  }
  const comparePassword = bcrypt.compareSync(password, user.password);

  if (!comparePassword) {
    throw new Unauthorized('Email or password is wrong');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_KEY, { expiresIn: '1h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    status: 'OK',
    code: 200,
    result: {
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    },
  });
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, { token: null });

  if (!user) {
    throw new Unauthorized('Not authorized');
  }

  res.status(204).json();
};

const getCurrentUser = async (req, res) => {
  const { _id } = req.user;
  const currentUser = await User.findById(_id, {
    _id: 0,
    password: 0,
    token: 0,
  });

  if (!currentUser) {
    throw new Unauthorized('Not authorized');
  }

  res.json({
    status: 'OK',
    code: 200,
    result: currentUser,
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    select: '-id -password -token',
    runValidators: true,
  });

  if (!updatedUser) {
    throw new Unauthorized('Not authorized');
  }

  res.json({
    status: 'OK',
    code: 200,
    result: updatedUser,
  });
};

module.exports = {
  signUp,
  logIn,
  logOut,
  getCurrentUser,
  updateSubscription,
};
