import { RequestHandler } from 'express';
import { HttpStatusCode } from '../../../Common/src/types/HTTPTypes';
import SubscriptionsManager from '../models/SubscriptionsManager';
import { SubscribeRequestData } from '../../../Common/src/types/APITypes';
import logger from '../logger';
import { SERVICES } from '../config/services';

const SubscribeController: RequestHandler = async (req, res) => {
    try {
        const { service, eventName } = req.body as SubscribeRequestData;

        SubscriptionsManager.add(eventName, SERVICES.get(service)!);

        // Success
        return res.json({
            code: HttpStatusCode.OK,
        });

    } catch (err: any) {
        logger.error(err);

        // Unknown error
        return res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
}

export default SubscribeController;