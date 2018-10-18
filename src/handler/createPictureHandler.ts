import * as functions from 'firebase-functions';
import Handler from '../core/Handler';
import PictureApi from '../repository/PictureApi';
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

    throw err;
  }
};

// @injectable()
// class PictureHandler {
//   private readonly pictureApi: PictureApi;

//   public onCall = async (data: any): Promise<string[]> => {
//     try {
//       const { text: _text }: any = { ...data };

//       const text = validateText(_text);

//       const urls = await this.pictureApi.searchPictureUrlsByKeyword(text);

//       return urls;
//     } catch (err) {
//       if (err instanceof ValidationError) {
//         throw new functions.https.HttpsError('invalid-argument', err.message);
//       }

//       throw err;
//     }
//   };

//   public constructor(@inject('pictureApi') pictureApi: PictureApi) {
//     this.pictureApi = pictureApi;
//   }
// }

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
