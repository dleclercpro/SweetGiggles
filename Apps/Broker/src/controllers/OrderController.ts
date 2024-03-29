import { RequestHandler } from 'express';
import { HttpStatusCode } from '../../../Common/src/types/HTTPTypes';
import logger from '../logger';
import CallCreateOrder from '../models/calls/CallCreateOrder';
import ReadinessCheck from '../models/ReadinessCheck';
import { DELIVERY_SERVICE, ORDER_SERVICE, PAYMENT_SERVICE } from '../config/services';

const OrderController: RequestHandler = async (req, res) => {
    try {
        const { userId, products } = req.body;

        // Verify data validity
        if (!userId || !products) {
            logger.warn(`Invalid parameters!`)
            return res.sendStatus(HttpStatusCode.BAD_REQUEST);
        }

        // Before running any scenario, ensure AT LEAST ONE instance
        // of each necessary service is ready
        const areServicesReady = await new ReadinessCheck([
            ORDER_SERVICE,
            PAYMENT_SERVICE,
            DELIVERY_SERVICE,
        ]).execute();

        // Tell client services aren't ready yet
        if (!areServicesReady) {
            return res.sendStatus(HttpStatusCode.SERVICE_UNAVAILABLE);
        }

        logger.info(`User '${userId}' ordered products:`);
        logger.info(products);

        const { code, data } = await new CallCreateOrder().execute({
            userId,
            products,
        });

        // Success
        return res.json({ code, data });

    } catch (err: any) {
        logger.error(err);

        // Unknown error
        return res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
}

export default OrderController;