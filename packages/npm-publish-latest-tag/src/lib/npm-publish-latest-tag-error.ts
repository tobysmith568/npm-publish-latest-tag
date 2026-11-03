/**
 * The base of every failure that is down to the project being checked rather than a bug, so that
 * callers can report `message` as it is instead of treating it as a crash.
 */
export class NpmPublishLatestTagError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}
