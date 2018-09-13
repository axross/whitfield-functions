import * as functions from 'firebase-functions';
import { inject, injectable } from 'inversify';
import TextToSpeechApi, { Gender } from './TextToSpeechApi';
import ValidationError from './ValidationError';

@injectable()
class SynthesizationHandler {
  private readonly textToSpeechApi: TextToSpeechApi;

  public onCall = async (data: any): Promise<string> => {
    try {
      const { text: _text, gender: _gender = Gender.MALE, rate: _rate = 0.9, volumeGain: _vg = 0.0 }: any = {
        ...data,
      };

      const text = validateText(_text);
      const gender = validateGender(_gender);
      const rate = validateRate(_rate);
      const volumeGain = validateVolumeGain(_vg);

      const audio = await this.textToSpeechApi.synthesize(text, { gender, rate, volumeGain });

      return `data:audio/mp3;base64,${audio.toString('base64')}`;
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new functions.https.HttpsError('invalid-argument', err.message);
      }

      throw err;
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
