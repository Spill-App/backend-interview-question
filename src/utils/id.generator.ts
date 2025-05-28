import { customAlphabet } from "nanoid";

export class NanoId {
  private static ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  private constructor() {}

  public static generate(size: number = 10): string {
    const nanoid = customAlphabet(NanoId.ALPHABET, size);
    return nanoid();
  }
}
