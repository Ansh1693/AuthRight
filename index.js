const express = require('express');
const mongoose  = require('mongoose');
const app = express();
const cors = require('cors');
//Routes
const router = require('express');
const Router = require('./routes/router');

app.use(express.json());
app.use(cors());

//db connection

mongoose.connect('mongodb://localhost:27017/authright', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


app.use("/api",Router);

app.listen(5000,()=>{
    console.log("started!");
})