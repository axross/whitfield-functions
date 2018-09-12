interface Configuration {
  googleCloud: GoogleCloudConfiguration;
  bingImageSearch: BingImageSearch;
}

export interface GoogleCloudConfiguration {
  clientEmail: string;
  projectId: string;
  privateKey: string;
}

export interface BingImageSearch {
  apiKey: string;
}

export default Configuration;
