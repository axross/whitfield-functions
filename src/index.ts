process.on('unhandledRejection', err => {
  console.error(err);
});

import 'reflect-metadata';
import * as functions from 'firebase-functions';
import { Container } from 'inversify';
import Configuration from './Configuration';
import PronunciationHandler from './PronunciationHandler';
import TextToSpeechApi from './TextToSpeechApi';

const container = new Container();

container.bind<Configuration>('configuration').toConstantValue({
  googleCloud: {
    clientEmail: functions.config().google_cloud.client_email,
    projectId: functions.config().google_cloud.project_id,
    privateKey: functions.config().google_cloud.private_key,
  },
});
container.bind<PronunciationHandler>('pronunciationHandler').to(PronunciationHandler);
container.bind<TextToSpeechApi>('textToSpeechApi').to(TextToSpeechApi);

export const ping = functions.https.onRequest((_, response) => response.send('pong'));
export const getPronunciation = functions.https.onRequest(
  container.get<PronunciationHandler>('pronunciationHandler').onRequest
);
