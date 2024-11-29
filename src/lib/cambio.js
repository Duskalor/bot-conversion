const url = 'https://odoo.samicapital.site/v1/controller/obtener/tipo/cambio';
const cookies = 'session_id=98918961da706bab42b009747357a6bdd6f3c10d';

const cambio = async (cantidad_moneda) => {
  const data = {
    params: {
      moneda_base: 'USD',
      moneda_objetivo: 'PEN',
      monto: cantidad_moneda,
    },
  };
  const { data: newData } = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies,
    },
  });
  return newData.result;
};
