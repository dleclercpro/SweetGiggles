import { RequestHandler } from 'express';
import { HttpStatusCode } from '../../../CommonApp/src/types/HTTPTypes';
import SubscriptionsManager from '../models/SubscriptionsManager';
import { SubscribeData } from '../../../CommonApp/src/types/APITypes';

const SubscribeController: RequestHandler = async (req, res) => {
    try {
        const { service, event } = req.body as SubscribeData;

        SubscriptionsManager.add(event, service);

        // Success
        return res.sendStatus(HttpStatusCode.OK);

    } catch (err: any) {

        // Unknown error
        return res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
}

export default SubscribeController;