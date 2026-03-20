const { query } = require("../db");
const { validateProductPayload } = require("../utils/validators");


const COLUMNS = ["campo1", "campo2", "campo3", "campo4", "campo5", "campo6"];
const SELECT_COLS = `id, ${COLUMNS.join(", ")}`;

// GET /products
async function getAllProducts(_req, res) {
  try {
    const result = await query(
      `SELECT ${SELECT_COLS} FROM products ORDER BY id`
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


async function getProductById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "El id debe ser un entero positivo." });
  }

  try {
    const result = await query(
      `SELECT ${SELECT_COLS} FROM products WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recurso no encontrado." });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// POST /products
async function createProduct(req, res) {
  const body = req.body;
  const errors = validateProductPayload(body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const sql = `
    INSERT INTO products (campo1, campo2, campo3, campo4, campo5, campo6)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING ${SELECT_COLS}
  `;

  try {
    const result = await query(sql, [
      body.campo1, body.campo2, body.campo3,
      body.campo4, body.campo5, body.campo6,
    ]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// PUT /products/:id  — reemplazo completo
async function updateProduct(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "El id debe ser un entero positivo." });
  }

  const body = req.body;
  const errors = validateProductPayload(body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const sql = `
    UPDATE products
    SET campo1=$1, campo2=$2, campo3=$3, campo4=$4, campo5=$5, campo6=$6
    WHERE id=$7
    RETURNING ${SELECT_COLS}
  `;

  try {
    const result = await query(sql, [
      body.campo1, body.campo2, body.campo3,
      body.campo4, body.campo5, body.campo6, id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recurso no encontrado." });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// DELETE /products/:id
async function deleteProduct(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "El id debe ser un entero positivo." });
  }

  try {
    const result = await query(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recurso no encontrado." });
    }
    return res.status(200).json({ message: "Recurso eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// PATCH /products/:id  — actualización parcial (solo los campos presentes)
async function patchProduct(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "El id debe ser un entero positivo." });
  }

  const body = req.body;
  const errors = validateProductPayload(body, { partial: true });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Construir SET dinámico solo con los campos presentes
  const sets = [];
  const values = [];
  for (const col of COLUMNS) {
    if (col in body) {
      sets.push(`${col} = $${values.length + 1}`);
      values.push(body[col]);
    }
  }

  if (sets.length === 0) {
    return res.status(400).json({ error: "El body no contiene campos válidos para actualizar." });
  }

  values.push(id);
  const sql = `
    UPDATE products
    SET ${sets.join(", ")}
    WHERE id = $${values.length}
    RETURNING ${SELECT_COLS}
  `;

  try {
    const result = await query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recurso no encontrado." });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al hacer patch de product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  patchProduct,
};
