import { RequestHandler } from 'express';
import { HttpStatusCode, HttpStatusMessage } from '../../../CommonApp/src/types/HTTPTypes';
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
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default SubscribeController;