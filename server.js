const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/userRoute");
const restaurantRouter = require("./routes/restaurantRoute");
const categoryRouter = require("./routes/categoryRoute");
const foodRouter = require("./routes/foodRoute");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongo_uri = process.env.MONGO_URI;

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

// connect database
mongoose
	.connect(mongo_uri)
	.then(() => {
		console.log("Database is connected");
	})
	.catch((err) => {
		console.log(err);
	});

// routes
app.use("/", authRouter);
app.use("/api/users", userRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/category", categoryRouter);
app.use("/api/foods", foodRouter);

app.listen(port, () => {
	console.log(`Foodly backend is running on port ${port}`);
});
