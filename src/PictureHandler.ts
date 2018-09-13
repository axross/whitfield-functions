import * as functions from 'firebase-functions';
import { inject, injectable } from 'inversify';
import PictureApi from './PictureApi';
import ValidationError from './ValidationError';

@injectable()
class PictureHandler {
  private readonly pictureApi: PictureApi;

  public onCall = async (data: any): Promise<string[]> => {
    try {
      const { text: _text }: any = { ...data };

      const text = validateText(_text);

      const urls = await this.pictureApi.searchPictureUrlsByKeyword(text);

      return urls;
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new functions.https.HttpsError('invalid-argument', err.message);
      }

      throw err;
    }
  };

  public constructor(@inject('pictureApi') pictureApi: PictureApi) {
    this.pictureApi = pictureApi;
  }
}

const validateText = (text: any): string => {
  if (typeof text !== 'string') {
    throw new ValidationError('`text` must be a string.', text);
  }

  if (text.trim().length === 0) {
    throw new ValidationError('`text` must not be an empty.', text);
  }

  return text;
};

export default PictureHandler;
