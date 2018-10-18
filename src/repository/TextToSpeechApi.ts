const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
import Configuration from '../core/Configuration';

class TextToSpeechApi {
  private readonly config: Configuration;

  public synthesize(
    text: string,
    {
      gender = Gender.MALE,
      rate = 0.9,
      volumeGain = 0.0,
    }: {
      gender?: Gender;
      rate?: number;
      volumeGain?: number;
    } = {}
  ): Promise<Buffer> {
    const textToSpeechClient = new TextToSpeechClient({
      credentials: {
        client_email: this.config.googleCloud.clientEmail,
        private_key: this.config.googleCloud.privateKey,
      },
      email: this.config.googleCloud.clientEmail,
      projectId: this.config.googleCloud.projectId,
    });

    return new Promise((resolve, reject) => {
      textToSpeechClient.synthesizeSpeech(
        {
          input: {
            text,
          },
          voice: {
            languageCode: 'en-US',
            ssmlGender: gender,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: rate,
            volumeGainDb: volumeGain,
          },
        },
        (err: Error, result: any) => {
          if (err) return reject(new SynthesizationFailed(err.message));

          resolve(result.audioContent);
        }
      );
    });
  }

  public constructor(cradle: any) {
    this.config = cradle[Symbol.for('configuration')];
  }
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NEUTRAL = 'NEUTRAL',
}

export class SynthesizationFailed extends Error {
  public readonly name = 'SynthesizationFailed';

  constructor(message: string) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.message = message;
  }
}

export default TextToSpeechApi;
