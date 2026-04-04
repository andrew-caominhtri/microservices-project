const pool = require("../config/db");

exports.getProducts = async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
};

exports.createProduct = async (req, res) => {
  const { name, price, image, description } = req.body;

  const result = await pool.query(
    "INSERT INTO products(name,price,image,description) VALUES($1,$2,$3,$4) RETURNING *",
    [name, price, image, description]
  );

  res.json(result.rows[0]);
};

exports.updateProduct = async (req,res)=>{
 const {id} = req.params
 const {name,price,image,description} = req.body
 await pool.query(
  "UPDATE products SET name=$1,price=$2,image=$3,description=$4 WHERE id=$5",
  [name,price,image,description,id]
 )

 res.json({message:"Updated"})
};

exports.deleteProduct = async (req,res)=>{
 const {id} = req.params
 await pool.query("DELETE FROM products WHERE id=$1",[id])
 res.json({message:"Deleted"})
}