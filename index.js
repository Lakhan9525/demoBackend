const express = require('express');
const app = express();
const {connection} =require("./config/db");
const cors=require("cors");

// Import route handlers
const walletRoutes = require('./Routes/walletRoutes');






//
app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PATCH,DELETE",
      credentials: true,
    })
  );

app.use(express.json());

// Use route handlers
app.use('/', walletRoutes);

//Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});




// Start the server
const port = 8000;
app.listen(port,async () => {
    try{
        await connection
        console.log("Connected to DB Successfully")
    }
    catch(err){
        console.log("Connection failed");
        console.log(err);
    }
  console.log(`Server listening on port ${port}.`);
});
