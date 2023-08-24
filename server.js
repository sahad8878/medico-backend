const cors = require('cors');
const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const userRouter = require('./routes/clientRoutes');
const adminRouter = require('./routes/adminRoutes');
const doctorRouter = require('./routes/doctorRoutes')
const authRouter = require('./routes/authRoutes')



// dotenv config
dotenv.config();

// Mongodb connection
connectDB()

// rest object
const app = express();

// cors
app.use(
  cors({
    // origin: ['http://localhost:3000'],
    // methods: ['GET', 'POST','PUT', 'PATCH', 'DELETE'],
    // credentials: true,
  }),
);

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/', userRouter);
app.use('/auth',authRouter)
app.use('/admin', adminRouter);
app.use('/doctor', doctorRouter)

// port
const port = process.env.PORT || 8080;

// listen port
app.listen(port, () => {
  console.log(
    `Server Running is${process.env.NODE_MODE} mode on port ${process.env.PORT}`
      .bgCyan.white,
  );
});
