const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require('@bot-whatsapp/bot');

const { connectDB } = require('./src/lib/bd');

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const { getProductos } = require('./src/controller/productos');
const { categorias } = require('./src/lib/const');

const flowCambio = addKeyword(['cambio']).addAnswer(
  ['🤪 Únete al discord'],
  ['🤪 Ingrese el monto q desea convertir '],
  { capture: true },
  //   null,
  async (ctx, { flowDynamic }) => {
    await flowDynamic('🤪 Ingrese el monto q desea convertir ');
    // const res = await cambio(ctx.body);
    // await flowDynamic(`El monto en soles es: ${res.monto_convertido}`);
  },
  []
);

const flowProductos = addKeyword(['productos']).addAnswer(
  ['Contáctanos para más'],
  null,
  async (ctx, { flowDynamic }) => {
    try {
      const productos = await getProductos(categorias.monitores);
      const productosList = productos.slice(0, 10).map((pro) => {
        return {
          body: `${pro.nombre} - S/. ${pro.precio}`,
          media: pro.img,
        };
      });

      await flowDynamic(productosList);
    } catch (error) {}
  },
  []
);

const flowPrincipal = addKeyword(EVENTS.WELCOME)
  .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
  .addAnswer(
    [
      'te comparto los siguientes comandos para que puedas interactuar conmigo',
      '👉 *cambio* para realizar conversión de moneda de USD a SOLES',
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
