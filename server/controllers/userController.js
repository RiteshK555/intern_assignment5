const User = require('../models/User');
const bcrypt = require('bcrypt');



exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name: name,
      email: email,
      password: password
    });

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log("bcyrpt hasing error");
            res.status(500).send('Server Error');
        }
        user.password = hash;
        user.save();
        const token = user.generateAuthToken();
        res.status(201).json({ msg: 'User registered successfully' , token: token});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const token = user.generateAuthToken();
    res.json({
      token,
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.setUser = async (req, res) => {
  const { name, email } = req.body.user;
  try {

    User.findOneAndUpdate({ email: email }, { name: name }, { new: true })
    .then(updatedUser => {
      console.log('Updated user:', updatedUser);
      res.status(200).json({ msg: 'updated successfully' });
    })
    .catch(error => {
      console.error('Error updating user:', error);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.setPasswordById = async (req, res) => {
  const {id, password , newPassword} = req.body;
  console.log(req.body);
  try {
    let user = await User.findById(id);
    console.log(user);
    if(!user){
      return res.status(404).json({ msg: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Wrong password' });
    }
    bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
            console.log("bcyrpt hasing error");
            res.status(500).json({ msg: 'bcrypt error' });
        }
        user.password = hash;
        user.save();
        res.status(200).json({ msg: 'updated successfully' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
