import { SubscribeData } from '../types/APITypes';
import { Service } from '../types/ServiceTypes';
import Call, { CallMethod } from './Call';

class CallSubscribe extends Call<SubscribeData> {
    protected method: CallMethod = 'PUT';

    public constructor(service: Service) {
        super(`${service.uri}/subscribe`);
    }
}

export default CallSubscribe;