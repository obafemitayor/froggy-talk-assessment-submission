import { defineMessages } from 'react-intl';

export const messages = defineMessages({
    billingConsole: {
        id: 'home.billingConsole',
        defaultMessage: 'Billing console',
    },
    pageTitle: {
        id: 'home.pageTitle',
        defaultMessage: 'Real-time payment balance and payment flow.',
    },
    pageDescription: {
        id: 'home.pageDescription',
        defaultMessage: 'This dashboard talks to the Laravel API over JWT-authenticated requests and listens on a private Reverb channel for updates.',
    },
    signOut: {
        id: 'home.signOut',
        defaultMessage: 'Sign out',
    },
    paymentBalance: {
        id: 'home.paymentBalance',
        defaultMessage: 'Payment balance',
    },
    liveWalletSnapshot: {
        id: 'home.liveWalletSnapshot',
        defaultMessage: 'Live wallet snapshot',
    },
    currentBalance: {
        id: 'home.currentBalance',
        defaultMessage: 'Current balance',
    },
    updatedAt: {
        id: 'home.updatedAt',
        defaultMessage: 'Updated: {value}',
    },
    authenticatedSessionActive: {
        id: 'home.authenticatedSessionActive',
        defaultMessage: 'Authenticated session active',
    },
    noSessionTokenFound: {
        id: 'home.noSessionTokenFound',
        defaultMessage: 'No session token found',
    },
    paymentFlow: {
        id: 'home.paymentFlow',
        defaultMessage: 'Payment flow',
    },
    initiatePayment: {
        id: 'home.initiatePayment',
        defaultMessage: 'Initiate a payment',
    },
    amountLabel: {
        id: 'home.amountLabel',
        defaultMessage: 'Amount',
    },
    startPayment: {
        id: 'home.startPayment',
        defaultMessage: 'Start payment',
    },
    processingPayment: {
        id: 'home.processingPayment',
        defaultMessage: 'Processing payment...',
    },
    latestRequest: {
        id: 'home.latestRequest',
        defaultMessage: 'Latest request',
    },
    noPaymentSubmittedYet: {
        id: 'home.noPaymentSubmittedYet',
        defaultMessage: 'No payment submitted yet',
    },
    status: {
        id: 'home.status',
        defaultMessage: 'Status',
    },
    eventStream: {
        id: 'home.eventStream',
        defaultMessage: 'Event stream',
    },
    recentPaymentUpdates: {
        id: 'home.recentPaymentUpdates',
        defaultMessage: 'Recent payment updates',
    },
    noWebsocketActivityYet: {
        id: 'home.noWebsocketActivityYet',
        defaultMessage: 'No websocket activity yet.',
    },
    waitingForSocket: {
        id: 'home.waitingForSocket',
        defaultMessage: 'Waiting for socket',
    },
    reverbConnected: {
        id: 'home.reverbConnected',
        defaultMessage: 'Reverb connected',
    },
    apiQueueReverb: {
        id: 'home.apiQueueReverb',
        defaultMessage: 'API + Queue + Reverb',
    },
});
