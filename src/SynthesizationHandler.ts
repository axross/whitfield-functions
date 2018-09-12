import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import TextToSpeechApi, { Gender } from './TextToSpeechApi';
import ValidationError from './ValidationError';

@injectable()
class SynthesizationHandler {
  private readonly textToSpeechApi: TextToSpeechApi;

  public onRequest = async (request: Request, response: Response): Promise<void> => {
    try {
      const { text: _text, gender: _gender = Gender.MALE, rate: _rate = 0.9, volumeGain: _vg = 0.0 }: any = {
        ...request.query,
      };

      const text = validateText(_text);
      const gender = validateGender(_gender);
      const rate = validateRate(_rate);
      const volumeGain = validateVolumeGain(_vg);

      try {
        const audio = await this.textToSpeechApi.synthesize(text, { gender, rate, volumeGain });

        response
          .type('audio/mp3')
          .header('content-disposition', `attachment; filename="${text}.mp3"`)
          .send(audio);
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

  public constructor(@inject('textToSpeechApi') textToSpeechApi: TextToSpeechApi) {
    this.textToSpeechApi = textToSpeechApi;
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

const validateGender = (gender: any): Gender => {
  if ([Gender.MALE, Gender.FEMALE, Gender.NEUTRAL].indexOf(gender) === -1) {
    throw new ValidationError(
      `\`gender\` must be one of ${Gender.MALE}, ${Gender.FEMALE} or ${Gender.NEUTRAL}`,
      gender
    );
  }

  return gender;
};

const validateRate = (rate: any): number => {
  if (typeof rate !== 'number') {
    throw new ValidationError('`rate` must be a number.', rate);
  }

  if (rate <= 0 || rate > Number.MAX_VALUE) {
    throw new ValidationError('`rate` must be a valid number.', rate);
  }

  return rate;
};

const validateVolumeGain = (volumeGain: any): number => {
  if (typeof volumeGain !== 'number') {
    throw new ValidationError('`volumeGain` must be a number.', volumeGain);
  }

  return volumeGain;
};

export default SynthesizationHandler;
