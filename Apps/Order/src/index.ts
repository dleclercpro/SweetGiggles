import { ENV } from './config'; // Do NOT remove!
import process from 'process';
import { SERVICE } from './config/services';
import router from './routes';
import logger from './logger';
import AppServer from '../../Common/src/models/AppServer';
import WebSocketServer from '../../Common/src/models/WebSocketServer';
import ServiceSubscriber from './models/ServiceSubscriber';
import { killAfterTimeout } from '../../Common/src/utils/process';
import TimeDuration from '../../Common/src/models/units/TimeDuration';
import { TimeUnit } from '../../Common/src/types';



export const APP_SERVER = new AppServer(SERVICE, logger);
export const WEB_SOCKET_SERVER = new WebSocketServer(SERVICE, logger);
export const SUBSCRIBER = new ServiceSubscriber();



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await APP_SERVER.setup(router);
    await APP_SERVER.start();

    await WEB_SOCKET_SERVER.setup();
    await WEB_SOCKET_SERVER.start();

    await SUBSCRIBER.createSubscriptions();
}



// Shut down gracefully
const TIMEOUT = new TimeDuration(2, TimeUnit.Seconds);
const stopServers = async () => {
    await WEB_SOCKET_SERVER.stop();
    await APP_SERVER.stop();
    process.exit(0);
};

process.on('SIGTERM', async () => {
    logger.trace(`Received SIGTERM signal.`);
    await Promise.race([stopServers(), killAfterTimeout(TIMEOUT)]);
});
process.on('SIGINT', async () => {
    logger.trace(`Received SIGINT signal.`);
    await Promise.race([stopServers(), killAfterTimeout(TIMEOUT)]);
});



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;