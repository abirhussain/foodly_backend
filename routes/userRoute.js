const router = require("express").Router();

const userController = require("../controllers/userController");
const { verifyAuthorization } = require("../middleware/authMiddleware");

router.get("/", verifyAuthorization, userController.getUser);
router.put("/", verifyAuthorization, userController.updateUser);
router.delete("/", verifyAuthorization, userController.deleteUser);

module.exports = router;
