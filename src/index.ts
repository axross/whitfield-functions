process.on('unhandledRejection', err => {
  console.error(err);
});

import 'reflect-metadata';
import * as functions from 'firebase-functions';
import { Container } from 'inversify';
import Configuration from './Configuration';
import PictureApi from './PictureApi';
import PictureHandler from './PictureHandler';
import SynthesizationHandler from './SynthesizationHandler';
import TextToSpeechApi from './TextToSpeechApi';

const container = new Container();

container.bind<Configuration>('configuration').toConstantValue({
  googleCloud: {
    clientEmail: functions.config().google_cloud.client_email,
    projectId: functions.config().google_cloud.project_id,
    privateKey: functions.config().google_cloud.private_key,
  },
  bingImageSearch: {
    apiKey: functions.config().bing_image_search.api_key,
  },
});
container.bind<PictureApi>('pictureApi').to(PictureApi);
container.bind<PictureHandler>('pictureHandler').to(PictureHandler);
container.bind<SynthesizationHandler>('synthesizeHandler').to(SynthesizationHandler);
container.bind<TextToSpeechApi>('textToSpeechApi').to(TextToSpeechApi);

export const ping = functions.https.onRequest((_, response) => response.send('pong'));
export const synthesize = functions.https.onRequest(
  container.get<SynthesizationHandler>('synthesizeHandler').onRequest
);
export const getPictures = functions.https.onRequest(container.get<PictureHandler>('pictureHandler').onRequest);
