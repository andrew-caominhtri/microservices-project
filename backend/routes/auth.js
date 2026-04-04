const router = require("express").Router();
const { register, login, registerAdmin, loginAdmin } = require("../controllers/authController");

router.post("/admin-register", registerAdmin);
router.post("/admin-login", loginAdmin);
router.post("/register", register);
router.post("/login", login);

module.exports = router;