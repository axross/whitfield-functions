import * as request from 'got';
// import {} from 'got';
import { inject, injectable } from 'inversify';
import Configuration from './Configuration';
import { URL } from 'url';

@injectable()
class PictureApi {
  private readonly config: Configuration;

  public async searchPictureUrlsByKeyword(keyword: string): Promise<string[]> {
    const response = await request(
      new URL(
        `https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${encodeURIComponent(
          keyword
        )}&count=100&safeSearch=Moderate`
      ),
      {
        headers: {
          'ocp-apim-subscription-key': this.config.bingImageSearch.apiKey,
        },
        json: true,
      }
    );

    const imageUrls = response.body.value.map((item: any) => item.thumbnailUrl);

    return imageUrls;
  }

  public constructor(@inject('configuration') configuration: Configuration) {
    this.config = configuration;
  }
}

export class PictureSearchFailed extends Error {
  public readonly name = 'PictureSearchFailed';

  constructor(message: string) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.message = message;
  }
}

export default PictureApi;
