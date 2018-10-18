process.on('unhandledRejection', err => {
  console.error(err);
});

import { asClass, asFunction, asValue, createContainer } from 'awilix';
import * as functions from 'firebase-functions';
import Configuration from './core/Configuration';
import Handler from './core/Handler';
import PictureApi from './repository/PictureApi';
import TextToSpeechApi from './repository/TextToSpeechApi';
import createPictureHandler from './handler/createPictureHandler';
import createSynthesizationHandler from './handler/createSynthesizationHandler';

const container = createContainer();

container.register<Configuration>(
  Symbol.for('configuration'),
  asValue({
    googleCloud: {
      clientEmail: functions.config().google_cloud.client_email,
      projectId: functions.config().google_cloud.project_id,
      privateKey: functions.config().google_cloud.private_key,
    },
    bingImageSearch: {
      apiKey: functions.config().bing_image_search.api_key,
    },
  })
);

// apis
container.register(Symbol.for('pictureApi'), asClass(PictureApi));
container.register(Symbol.for('textToSpeechApi'), asClass(TextToSpeechApi));

// handlers
container.register(Symbol.for('pictureHandler'), asFunction(createPictureHandler));
container.register(Symbol.for('synthesizationHandler'), asFunction(createSynthesizationHandler));

// functions
export const ping = functions.https.onCall(() => 'pong');
export const synthesize = functions.https.onCall(container.resolve<Handler>(Symbol.for('synthesizationHandler')));
export const searchPictures = functions.https.onCall(container.resolve<Handler>(Symbol.for('pictureHandler')));
