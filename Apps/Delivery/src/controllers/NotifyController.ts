import { RequestHandler } from 'express';
import { HttpStatusCode } from '../../../Common/src/types/HTTPTypes';
import logger from '../logger';
import { NotifyRequestData } from '../../../Common/src/types/APITypes';
import { EventName } from '../../../Common/src/constants/events';
import WorkerFinder from '../models/WorkerFinder';
import { BROKER_SERVICE, SERVICE } from '../config/services';
import CallPublish from '../../../Common/src/models/calls/CallPublish';
import EventGenerator from '../../../Common/src/models/EventGenerator';
import { Delivery, Event, TimeUnit } from '../../../Common/src/types';
import { SUBSCRIBED_EVENTS } from '../config';
import { EventPaymentSuccess } from '../../../Common/src/types/EventTypes';
import { sleep } from '../../../Common/src/utils/time';
import TimeDuration from '../../../Common/src/models/units/TimeDuration';



const NotifyController: RequestHandler = async (req, res) => {
    try {
        const { event } = req.body as NotifyRequestData;

        // Ensure event is subscribed to
        if (!SUBSCRIBED_EVENTS.includes(event.name)) {
            throw new Error(`NOT_SUBSCRIBED_TO_EVENT`);
        }

        // Tell broker the event was well received
        res.json({
            code: HttpStatusCode.OK,
        });

        // Process expected event
        await processEvent(event);

    } catch (err: any) {
        logger.error(err);

        // Unknown error
        return res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
}



const processEvent = async (event: Event) => {
    logger.debug(`Notification: ${event.name}`);

    if (event.name === EventName.PaymentSuccess) {
        const { data: order } = event as EventPaymentSuccess;

        let done = false;

        // Try and find worker that does the job until the end
        while (!done) {
            const worker = await WorkerFinder.find();

            const now = new Date();

            // Delivery started
            const delivery: Delivery = {
                id: `Delivery-${worker}-${now.getTime()}-${crypto.randomUUID()}`,
                orderId: order.id,
                workerId: worker,
                startTime: now,
            };

            logger.info(`Attempting delivery...`);

            // Wait random amount of time for delivery to be brought to customer
            const wait = new TimeDuration(5 * Math.random(), TimeUnit.Seconds);
            logger.info(`[Delivery will take: ${wait.format()}]`)
            await sleep(wait);

            // Worker has an 90% chance of completing work (e.g. might become sick,
            // and need to cancel their deliveries)
            if (Math.random() < 0.9) {
                logger.info(`Delivery successful.`);

                // Delivery done
                delivery.endTime = new Date();

                await new CallPublish(BROKER_SERVICE).execute({
                    service: SERVICE.name,
                    event: EventGenerator.generateDeliveryCompletedEvent(delivery),
                });

                // Job is now finally done
                done = true;
            } else {
                logger.info(`Delivery aborted. Re-assigning job to different worker...`);
            }
        }
    }
}



export default NotifyController;