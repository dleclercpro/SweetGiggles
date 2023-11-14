import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import router from './routes';
import { ENV, HOST, PORT, PROTOCOL, ROOT } from './config';
import logger from './logger';



/* -------------------------------------------------- INSTANCES -------------------------------------------------- */
// Server
const server = express();



/* -------------------------------------------------- MIDDLEWARE -------------------------------------------------- */

// Cookies
server.use(cookieParser());

// JSON
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// GZIP
server.use(compression());

// API
server.use('/', router);



/* -------------------------------------------------- MAIN -------------------------------------------------- */
const execute = async () => {

    // Then start listening on given port
    server.listen(PORT, () => {
        logger.info(`Server listening in ${ENV} mode at: ${ROOT}`);

        // Execute health check on all services
        [3001, 3002, 3003].forEach(async (port: number) => {
            const service = `${PROTOCOL}://${HOST}:${port}`;

            const res = await fetch(`${service}/health`);

            logger.info(`HTTP health check [${service}]: ${res.status}`);
        });
    });
}



// Run
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });

export default execute;