const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
    [name, email, hashed]
  );

  res.json(result.rows[0]);
};

exports.registerAdmin = async (req, res) => {

  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO admin(name,email,password) VALUES($1,$2,$3) RETURNING *",
    [name, email, hashed]
  );

  res.json(result.rows[0]);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0)
    return res.status(400).json({ message: "User not found" });

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);

  if (!valid)
    return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({ token });
};

  exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM admin WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Admin not found" });

    const admin = result.rows[0];

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);

    res.json({ token });
  };