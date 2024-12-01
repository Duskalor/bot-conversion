const axios = require('axios');

const URL = process.env.URL_API;
const cookies = `session_id=${process.env.ID_API}`;

const getCambio = async (cantidadMoneda) => {
  const data = {
    params: {
      moneda_base: 'USD',
      moneda_objetivo: 'PEN',
      monto: Number(cantidadMoneda),
    },
  };
  const { data: newData } = await axios.post(URL, data, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies,
    },
  });
  return newData.result;
};

module.exports = { getCambio };
