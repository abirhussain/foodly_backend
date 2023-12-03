const Category = require("../models/Category");

const createCategory = async (req, res) => {
	const categoryInfo = req.body;
	const newCategory = new Category(categoryInfo);
	try {
		await newCategory.save();
		res
			.status(201)
			.json({ status: true, message: "Category created successfully" });
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};

const updateCategory = async (req, res) => {
	const categoryId = req.params.id;
	const { title, value, imageUrl } = req.body;
	try {
		const updatedCategory = await Category.findByIdAndUpdate(
			categoryId,
			{
				title: title,
				value: value,
				imageUrl: imageUrl,
			},
			{ new: true }
		);
		if (updatedCategory) {
			res
				.status(200)
				.json({ status: true, message: "Category updated successfully" });
		} else {
			res
				.status(500)
				.json({
					status: false,
					message: "Error updating category",
					error: error.message,
				});
		}
	} catch (error) {}
};

const deleteCategory = async (req, res) => {
	const categoryId = req.params.id;
	try {
		const category = await Category.findById(categoryId);
		if (category) {
			await Category.findByIdAndDelete(categoryId);
			res
				.status(200)
				.json({ status: true, message: "Category deleted successfully" });
		} else {
			res.status(404).json({ status: false, message: "Category not found" });
		}
	} catch (error) {
		res
			.status(500)
			.json({
				status: false,
				message: "Error deleting Category",
				error: error.message,
			});
	}
};

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({}, { __v: 0 });
		res.status(200).json(categories);
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};

const updateCategoryImage = async (req, res) => {
	const categoryId = req.params.id;
	const { imageUrl } = req.body;

	try {
		const category = await Category.findById(id);
		if (category) {
			const updatedCategory = new Category({
				title: category.title,
				value: category.value,
				imageUrl: imageUrl,
			});
			await updatedCategory.save();
			res
				.status(200)
				.json({
					status: true,
					message: "Category image url updated successfully",
				});
		} else {
			res.status(404).json({ status: true, message: "Category not found" });
		}
	} catch (error) {
		res
			.status(500)
			.json({
				status: false,
				message: "Error updating category images",
				error: error.message,
			});
	}
};

const getRandomCategories = async (req, res) => {
	try {
		let categories = await Category.aggregate([
			{ $match: { value: { $ne: "more" } } },
			{ $sample: { size: 7 } },
		]);

		const moreCategory = await Category.findOne({ value: "more" });

		if (moreCategory) {
			categories.push(moreCategory);
		}

		res.status(200).json(categories);
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};

module.exports = {
	createCategory,
	getAllCategories,
	getRandomCategories,
	updateCategory,
	updateCategoryImage,
	deleteCategory,
};
