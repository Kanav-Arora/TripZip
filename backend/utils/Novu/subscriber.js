/* eslint-disable import/no-extraneous-dependencies */

import { Novu } from '@novu/node';
import { AwsBucketUrl, NovuAPI } from '../../config';

const novu = new Novu(NovuAPI);

async function createSubscriber(subscriberID, payload) {
    const response = await novu.subscribers.identify(subscriberID, {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        avatar: `${AwsBucketUrl}${subscriberID}`,
        locale: 'en-US',
    });
    return response;
}

async function updateSubscriber(subscriberID, payload) {
    const response = await novu.subscribers.update(subscriberID, payload);
    return response;
}

async function deleteSubscriber(subscriberID) {
    const response = await novu.subscribers.delete(subscriberID);
    return response;
}

async function fetchSubscriber(subscriberID) {
    const response = await novu.subscribers.get(subscriberID);
    return response;
}

export {
    createSubscriber, updateSubscriber, deleteSubscriber, fetchSubscriber,
};
