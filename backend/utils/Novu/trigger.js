import { Novu } from '@novu/node';
import { NovuAPI, NovuTriggerIdentifier } from '../../config';

const novu = new Novu(NovuAPI);

async function requestTrip(subscriberID, tripID) {
    await novu.trigger(NovuTriggerIdentifier, {
        to: {
            subscriberId: subscriberID,
        },
        payload: {
            tripID,
        },
    });
}

async function tripActioned(subscriberID, tripID) {
    await novu.trigger(NovuTriggerIdentifier, {
        to: {
            subscriberId: subscriberID,
        },
        payload: {
            tripID,
        },
    });
}

export {
    requestTrip, tripActioned,
};
