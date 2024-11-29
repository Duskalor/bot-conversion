const productosModel = require('../module/productos');

const getProductos = async (categoria) => {
  console.log({ categoria });
  return await productosModel.find({ categoria: categoria });
};

module.exports = { getProductos };
