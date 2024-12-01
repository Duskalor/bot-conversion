const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require('@bot-whatsapp/bot');

const { connectDB } = require('./src/lib/bd');
const { getCambio } = require('./src/lib/cambio');

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const { getProductos } = require('./src/controller/productos');
const { categorias } = require('./src/lib/const');

const flowProductos = addKeyword(['productos']).addAnswer(
  [
    'Contáctanos para más',
    '👇 Lista de productos :',
    ' 1.- Laptop',
    ' 2.- Disco',
    ' 3.- Procesador',
    ' 4.- Monitores',
    ' 5.- Placa madre',
    ' 6.- Memoria ram',
  ],
  { capture: true },
  async (ctx, { flowDynamic, fallBack }) => {
    const key = Object.keys(categorias)[ctx.body - 1];
    if (!key) {
      return fallBack('🤪 Ingrese un número de la lista');
    } else {
      const value = categorias[key];
      try {
        const productos = await getProductos(value);
        const productosList = productos.slice(0, 10).map((pro) => ({
          body: `${pro.nombre} - S/. ${pro.precio}`,
          media: pro.img,
        }));
        await flowDynamic(productosList);
      } catch (error) {}
    }
  },
  []
);

const flowCambio = addKeyword(['cambio']).addAnswer(
  [
    'Comunícate con nosotros para algo más exacto',
    '🤪 Ingrese el monto q desea convertir :  ',
  ],
  { capture: true },
  async (ctx, { flowDynamic }) => {
    const res = await getCambio(ctx.body);
    await flowDynamic(
      `*${ctx.body}* soles es  *${res.monto_invertido}* dolares`
    );
  },
  [flowProductos]
);

const flowPrincipal = addKeyword(['hola'])
  .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
  .addAnswer(
    [
      'te comparto los siguientes comandos para que puedas interactuar conmigo :',
      '👉 *cambio* para realizar conversión de moneda de SOLES A USD',
      '👉 *productos* para ver lista de Deltron',
    ],
    null,
    null,
    [flowProductos, flowCambio]
  );

const main = async () => {
  await connectDB().then(() => console.log('🚀 Database connected'));
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
