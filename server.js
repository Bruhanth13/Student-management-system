require('dotenv').config();
const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const app = express();
app.use(express.static(__dirname));

app.use(cors());
app.use(express.json()); // lets us read JSON sent from frontend

app.use('/api/students', studentRoutes); // all student routes live under /api/students

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});