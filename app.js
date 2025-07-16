const express = require('express');
const app = express();
const port = 3000;

const eventRoutes = require('./routes/eventRoutes'); 
const userRoutes = require('./routes/userRoutes');


app.use(express.json());

app.use('/events', eventRoutes); 

app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Event Management API is running ✅');
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
