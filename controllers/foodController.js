const Food = require("../models/Food");

const addFood = async (req, res) => {
	const newFood = new Food(req.body);
	try {
		await newFood.save();
		res
			.status(201)
			.json({ status: true, message: "Food item added successfully" });
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "Food item could not be added successfully",
		});
	}
};

const getFoodById = async (req, res) => {
	const foodId = req.params.id;
	try {
		const food = await Food.findById(foodId);
		if (food) {
			res.status(200).json(food);
		} else {
			res.status(404).json({ status: false, message: "Food item not found" });
		}
	} catch (error) {
		res.status(500).json({ status: false, error: error.message });
	}
};

const getFoodByRestaurant = async (req, res) => {
	const restaurantId = req.params.id;
	try {
		const foods = await Food.find({ restaurant: restaurantId });
		if (foods || foods.length > 0) {
			res.status(200).json(foods);
		} else {
			res.status(404).json({ status: false, message: "No food item found" });
		}
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};

const deleteFoodById = async (req, res) => {
	const foodId = req.params.id;
	try {
		const food = await Food.findById(foodId);
		if (food) {
			await Food.findByIdAndDelete(foodId);
			res
				.status(200)
				.json({ status: true, message: "Food item is successfully deleted" });
		} else {
			res.status(404).json({ status: false, message: "Food item not found" });
		}
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};

const toggleFoodAvailability = async (req, res) => {
	const foodId = req.params.id;
	try {
		const food = await Food.findById(foodId);
		if (food) {
			food.isAvailable = !food.isAvailable;
			await food.save();
			res.status(200).json({
				status: true,
				message: "Food availability toggled successfully",
				isAvailable: food.isAvailable,
			});
		} else {
			res.status(404).json({ status: false, message: "Food item not found" });
		}
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};

const updateFood = async (req, rs) => {
	const foodId = req.params.id;
	try {
		const updatedFood = await Food.findByIdAndUpdate(foodId, req.body, {
			new: true,
			runValidators: true,
		});
		if (updatedFood) {
			res
				.status(200)
				.json({ status: true, message: "Food item updated successfully" });
		} else {
			res.status(404).json({ status: false, message: "Food item not found" });
		}
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};

const addFoodTag = async (req, res) => {
	const foodId = req.params.id;
	const { tag } = req.body;
	try {
		const food = await Food.findById(foodId);
		if (food) {
			if (food.foodTags.includes(tag)) {
				return res
					.status(200)
					.json({ status: false, messaage: "Tag already exist" });
			} else {
				food.foodTags.push(tag);
				await food.save();
				res
					.status(200)
					.json({ status: true, message: "Food tag updated successfully" });
			}
		} else {
			res.status(400).json({ status: false, message: "Food item not found" });
		}
	} catch (error) {
		res.status(500).json({ message: true, message: error.message });
	}
};

const getRandomFoodsByCode = async (req, res) => {
	try {
		const randomFoodItem = await Food.aggregate([
			{ $match: { code: req.params.code } },
			{ $sample: { size: 5 } },
			{ $project: { _id: 0 } },
		]);
		res.status(200).json(randomFoodItem);
	} catch (error) {
		res.status(500).json({ status: false, message: error.messaage });
	}
};

const addFoodType = async (req, res) => {
	const foodId = req.params.id;
	const foodType = req.body.foodType;
	try {
		const food = await Food.findById(foodId);
		if (food) {
			if (food.foodType.includes(foodType)) {
				res
					.status(400)
					.json({ status: false, message: "Food type already exist" });
			} else {
				food.foodType.push(foodType);
				await food.save();
				res
					.status(200)
					.json({ status: true, message: "Food type added successfully" });
			}
		} else {
			res.status(404).json({ status: false, message: "Food item not found" });
		}
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};

const getRandomFoodsByCategoryAndCode = async (req, res) => {
	const { category, code } = req.params;

	try {
		let foods = await Food.aggregate([
			{ $match: { category: category, code: code } },
			{ $sample: { size: 10 } },
		]);
		if (!foods || foods.length === 0) {
			res.status(200).json(foods);
		} else {
			foods = await Food.aggregate([{ $sample: { size: 10 } }]);
		}
		res.status(200).json(foods);
	} catch (error) {
		res.status(500).json({ status: false, message: error.messaage });
	}
};

module.exports = {
	addFood,
	addFoodTag,
	addFoodType,
	getFoodById,
	getFoodByRestaurant,
	getRandomFoodsByCategoryAndCode,
	getRandomFoodsByCode,
	updateFood,
	toggleFoodAvailability,
	deleteFoodById,
};
