import * as functions from 'firebase-functions';
import Handler from '../core/Handler';
import PictureApi, { PictureSearchFailed } from '../repository/PictureApi';
import ValidationError from '../core/ValidationError';

const createPictureHandler = (cradle: any): Handler => async (data: any): Promise<string[]> => {
  try {
    const { text: _text }: any = { ...data };
    const text = validateText(_text);
    const pictureApi: PictureApi = cradle[Symbol.for('pictureApi')];
    const urls = await pictureApi.searchPictureUrlsByKeyword(text);

    return urls;
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new functions.https.HttpsError('invalid-argument', err.message);
    }

    if (err instanceof PictureSearchFailed) {
      throw new functions.https.HttpsError('aborted', err.message);
    }

    throw new functions.https.HttpsError('internal', err.message);
  }
};

const validateText = (text: any): string => {
  if (typeof text !== 'string') {
    throw new ValidationError('`text` must be a string.', text);
  }

  if (text.trim().length === 0) {
    throw new ValidationError('`text` must not be an empty.', text);
  }

  return text;
};

export default createPictureHandler;
