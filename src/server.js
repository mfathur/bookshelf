const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hpi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    await server.start();

    server.route(routes);
    console.log(`Server running on ${server.info.uri}`);
}
