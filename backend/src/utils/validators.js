function validateProductPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return ["El body debe ser un objeto JSON válido."];
  }

  const fields = ["campo1", "campo2", "campo3", "campo4", "campo5", "campo6"];

  if (!partial) {
    for (const field of fields) {
      if (!(field in payload)) {
        errors.push(`El campo ${field} es requerido.`);
      }
    }
  }

  if ("campo1" in payload) {
    if (typeof payload.campo1 !== "string" || payload.campo1.trim() === "") {
      errors.push("campo1 debe ser un string no vacío.");
    }
  }

  if ("campo2" in payload) {
    if (typeof payload.campo2 !== "string" || payload.campo2.trim() === "") {
      errors.push("campo2 debe ser un string no vacío.");
    }
  }

  if ("campo3" in payload) {
    if (typeof payload.campo3 !== "string" || payload.campo3.trim() === "") {
      errors.push("campo3 debe ser un string no vacío.");
    }
  }

  if ("campo4" in payload) {
    if (!Number.isInteger(payload.campo4)) {
      errors.push("campo4 debe ser un integer.");
    }
  }

  if ("campo5" in payload) {
    if (typeof payload.campo5 !== "number" || !Number.isFinite(payload.campo5)) {
      errors.push("campo5 debe ser un number válido.");
    }
  }

  if ("campo6" in payload) {
    if (typeof payload.campo6 !== "boolean") {
      errors.push("campo6 debe ser un boolean.");
    }
  }

  return errors;
}

module.exports = {
  validateProductPayload
};
