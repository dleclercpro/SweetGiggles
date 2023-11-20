import { NotifyData } from '../types/APITypes';
import { Service } from '../types/ServiceTypes';
import Call, { CallMethod } from './Call';

class CallNotify extends Call<NotifyData> {
    protected method: CallMethod = 'POST';

    public constructor(service: Service) {
        super(`${service.uri}/notify`);
    }
}

export default CallNotify;