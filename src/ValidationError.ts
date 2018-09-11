class ValidationError extends Error {
  public readonly name = 'ValidationError';

  constructor(message: string, actual?: any) {
    super();

    Error.captureStackTrace(this, this.constructor);

    if (actual === undefined) {
      this.message = `${message}`;
    } else {
      this.message = `${message} (received value: ${JSON.stringify(actual)})`;
    }
  }
}

export default ValidationError;
