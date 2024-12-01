const productosModel = require('../module/productos');

const getProductos = async (categoria) => {
  return await productosModel.find({ categoria });
};

module.exports = { getProductos };
