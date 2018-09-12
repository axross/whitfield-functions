import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import PictureApi from './PictureApi';
import ValidationError from './ValidationError';

@injectable()
class PictureHandler {
  private readonly pictureApi: PictureApi;

  public onRequest = async (request: Request, response: Response): Promise<void> => {
    try {
      const { text: _text }: any = { ...request.query };

      const text = validateText(_text);

      try {
        const urls = await this.pictureApi.searchPictureUrlsByKeyword(text);

        response.json(urls);
      } catch (err) {
        console.error(err);

        response.status(500).send(err.message);
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        response.status(400).send(err.message);
      } else {
        console.error(err);

        response.status(500).send(err.message);
      }
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
