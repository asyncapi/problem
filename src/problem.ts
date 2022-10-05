import { DEFAULT_KEYS } from "./constants";
import {
  HttpObject,
  ProblemInterface,
  ToJsonParamType,
  UpdateProblemParamType,
} from "./types";

import { COPY_MODE } from "./constants";

export class Problem extends Error implements ProblemInterface {
  public type: string;
  public title: string;
  public instance?: string;
  public detail?: string;
  public http?: HttpObject;
  [key: string]: any;

  constructor(protected readonly problem: ProblemInterface) {
    super(problem.detail || problem.title);
    this.http = problem.http;
    this.type = problem.type;
    this.title = problem.title;
    this.detail = problem.detail;
    this.instance = problem.instance;
    this.stack = problem.stack;

    // add extra keys
    Object.keys(problem)
      .filter((el) => !DEFAULT_KEYS.includes(el))
      .forEach((k) => (this[k] = problem[k]));
  }

  copy(mode: COPY_MODE = COPY_MODE.LEAVE_PROPS, props: string[] = []): Problem {
    switch (mode) {
      case COPY_MODE.LEAVE_PROPS:
        const newProblem = new Problem(this.problem);
        props.forEach((prop) => (newProblem[prop] = undefined));
        return newProblem;

      case COPY_MODE.SKIP_PROPS:
      default: {
        const newProblem = new Problem(this.problem);
        let keysToBeCopied: string[] = [];
        for (let key in newProblem) {
          // Default Keys cannot be skipped
          if (props.includes(key) && !DEFAULT_KEYS.includes(key)) continue;
          keysToBeCopied.push(key);
        }
        return newProblem;
      }
    }
  }

  toJSON({ includeStack = false }: ToJsonParamType) {
    const { stack, ...rest } = this;

    if (includeStack) {
      return {
        ...this,
        stack: this.stack,
      };
    }

    return { ...rest };
  }

  isOfType(type: string) {
    return this.type === type;
  }

  update({ updates }: UpdateProblemParamType) {
    Object.keys(updates).forEach((i) => {
      this[i] = updates[i];
    });
  }
}
