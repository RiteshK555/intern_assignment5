const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/eternalight', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/users', userRoutes);


const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
