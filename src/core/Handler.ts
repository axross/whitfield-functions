import { https } from 'firebase-functions';

type Handler = (data: any, context: https.CallableContext) => any | Promise<any>;

export default Handler;
