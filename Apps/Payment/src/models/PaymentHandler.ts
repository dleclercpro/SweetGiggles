import EventGenerator from '../../../Common/src/models/EventGenerator';
import CallPublish from '../../../Common/src/models/calls/CallPublish';
import { Event, Order } from '../../../Common/src/types';
import { BROKER_SERVICE, SERVICE } from '../config/services';
import logger from '../logger';

class PaymentHandler {
    protected order: Order;

    public constructor(order: Order) {
        this.order = order;
    }

    public async approvePayment() {
        const { userId } = this.order;

        logger.trace(`Payment was approved. [Order ID: ${this.order.id}]`);
        await this.publishEvent({
            ...EventGenerator.generatePaymentAcceptedEvent(this.order),
            userId,
        });
    }

    public async declinePayment() {
        const { userId } = this.order;
        
        logger.trace(`Payment was declined. [Order ID: ${this.order.id}]`);
        await this.publishEvent({
            ...EventGenerator.generatePaymentDeclinedEvent(this.order),
            userId,
        });
    }

    protected async publishEvent(event: Event) {
        await new CallPublish(BROKER_SERVICE).execute({
            service: SERVICE.name,
            event: {
                ...event,
                userId: event.userId,
            },
        });
    }
}

export default PaymentHandler;