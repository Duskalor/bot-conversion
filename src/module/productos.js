const { model, Schema } = require('mongoose');

const productos = Schema({
  titulo: String,
  nombre: String,
  img: String,
  minCode: String,
  categoria: String,
  precio: String,
});

const productosModel = model('productos', productos);
module.exports = productosModel;
