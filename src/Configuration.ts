interface Configuration {
  googleCloud: GoogleCloudConfiguration;
}

export interface GoogleCloudConfiguration {
  clientEmail: string;
  projectId: string;
  privateKey: string;
}

export default Configuration;
