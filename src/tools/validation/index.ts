import * as errors from '../../errors';
import { IncorrectArgLengthError } from '../../errors';

export default class Validation {
  private readonly _v: unknown;
  private readonly _name: string;

  constructor(v: unknown, name: string) {
    this._v = v;
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get v(): unknown {
    return this._v;
  }

  /**
   * Validate if element is typeof string
   * Require param: any
   */
  isDefined(): this {
    const { v, name } = this;
    if (v === undefined || v === null) throw new errors.MissingArgError(name);
    return this;
  }

  /**
   * Validate if element is smaller than x and bigger than y
   * Require param: number
   */
  isBetween(max: number, min?: number): this {
    const { v, name } = this;
    const value = v as number;

    if (min) {
      if (value < min || value > max) throw new IncorrectArgLengthError(name, min, max);
    } else {
      if (value > max) throw new IncorrectArgLengthError(name, min, max);
    }

    return this;
  }

  /**
   * Validate if element is typeof number
   * Require param: any
   */
  isNumber(): this {
    const { v, name } = this;
    if (typeof v !== 'number') throw new errors.IncorrectArgError(`${name} should be number`);

    return this;
  }

  /**
   * Validate if element is typeof array
   * Require param: array of strings
   */
  isArray(): this {
    const { v, name } = this;
    const value = v as string;

    if (!Array.isArray(value)) throw new errors.IncorrectArgTypeError(`${name} should be array`);

    return this;
  }

  /**
   * Validate if element has more children than x
   * Require param: array of strings
   */
  minElements(amount: number): this {
    const { v, name } = this;
    const value = v as string;

    if (value.length < amount) throw new errors.ElementTooShortError(name, amount);

    return this;
  }

  /**
   * Validate if element has fewer children than x
   * Require param: array of strings
   */
  maxElements(amount: number): this {
    const { v, name } = this;
    const value = v as string;

    if (value.length > amount) throw new errors.ElementTooLongError(name, amount);

    return this;
  }
}
