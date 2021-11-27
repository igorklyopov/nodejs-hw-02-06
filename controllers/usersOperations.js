const fs = require('fs/promises');
const path = require('path');
const {
  Conflict,
  Unauthorized,
  UnsupportedMediaType,
  NotFound,
  BadRequest,
} = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');

const { JWT_KEY } = process.env;

const { User } = require('../model/usersModel');
const { sendLetter } = require('../utils/mailTransporter');

const avatarsDir = path.join(__dirname, '../public/avatars');

const signUp = async (req, res) => {
  const { password, email } = req.body;
  const avatarURL = gravatar.url(email);
  const duplicateUser = await User.findOne({ email });

  if (duplicateUser) {
    throw new Conflict('Email in use');
  }

  const verifyToken = nanoid();
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const newUser = await User.create({
    password: hashedPassword,
    email,
    avatarURL,
    verifyToken,
  });

  const confirmationLetter = {
    to: email,
    subject: 'Подтверждение регистрации',
    text: `<a href="http://localhost:3000/api/users/verify/${verificationToken}">Нажмите для подтверждения email</a>`,
  };

  await sendLetter(confirmationLetter);

  const userAvatarFolder = path.join(avatarsDir, String(newUser._id));
  await fs.mkdir(userAvatarFolder);

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

  if (!user || !user.verify) {
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
  const user = await User.findOneAndUpdate(_id, { token: null });

  if (!user) {
    throw new Unauthorized('Not authorized');
  }

  res.status(204).json();
};

const getCurrentUser = async (req, res) => {
  const { _id } = req.user;
  const currentUser = await User.findOne(_id, {
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
  const updatedUser = await User.findOneAndUpdate(_id, req.body, {
    new: true,
    select: '-_id -password -token',
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

const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    return next(UnsupportedMediaType('Error loading file'));
  }

  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  try {
    const avatarFileName = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, String(_id), avatarFileName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join('/avatars', String(_id), avatarFileName);
    const userAvatarImg = await Jimp.read(resultUpload);

    userAvatarImg.resize(250, 250).write(resultUpload);

    const updatedUserAvatar = await User.findOneAndUpdate(
      _id,
      { avatarURL },
      {
        new: true,
        select: '-_id -password -email -subscription -token',
        runValidators: true,
      }
    );

    if (!updatedUserAvatar) {
      throw new Unauthorized('Not authorized');
    }

    res.json({
      status: 'OK',
      code: 200,
      avatarURL: updatedUserAvatar,
    });
  } catch (error) {
    await fs.unlink(tempUpload);
    next(error);
  }
};

const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;
  const verifiedUser = await User.findOne(verificationToken, {
    _id: 0,
    password: 0,
    token: 0,
  });

  if (!verifiedUser) {
    throw new NotFound('User not found');
  }

  await User.findByIdAndUpdate(verifiedUser._id, {
    verifyToken: null,
    verify: true,
  });

  res.json({
    status: 'OK',
    code: 200,
    message: 'Verification successful',
  });
};

const repeatVerificationUser = async (req, res) => {
  const { email } = req.body;

  const currentUser = await User.findOne(email);

  if (!currentUser) {
    throw new NotFound('User not found');
  }

  if (!currentUser.verifyToken || currentUser.verifyToken.length < 1) {
    throw new BadRequest('Verification has already been passed');
  }

  const confirmationLetter = {
    to: email,
    subject: 'Подтверждение регистрации',
    text: `<a href="http://localhost:3000/api/users/verify/${currentUser.verifyToken}">Нажмите для подтверждения email</a>`,
  };

  await sendLetter(confirmationLetter);

  res.json({
    status: 'OK',
    code: 200,
    message: 'Verification email sent',
  });
};

module.exports = {
  signUp,
  logIn,
  logOut,
  getCurrentUser,
  updateSubscription,
  updateUserAvatar,
  verifyUser,
  repeatVerificationUser,
};
