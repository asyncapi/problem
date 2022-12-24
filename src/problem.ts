import { DEFAULT_KEYS } from "./constants";
import {
  HttpObject,
  ProblemInterface,
  ToJsonParamType,
  UpdateProblemParamType,
} from "./@types";

import { COPY_MODE } from "./constants";
import { objectToProblemMap } from "./util";
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
      // returns a new problem object with preserved keys passed as props
      case COPY_MODE.LEAVE_PROPS: {
        let newProblemKeyValuePairs: Record<string, any> = {
          type: this.problem.type,
          title: this.problem.title,
        };
        props.forEach((key) => {
          newProblemKeyValuePairs = {
            ...newProblemKeyValuePairs,
            [key]: this.problem[key],
          };
        });
        const newProblem = new Problem(
          objectToProblemMap(newProblemKeyValuePairs)
        );
        return newProblem;
      }
      // skip the copy of keys
      case COPY_MODE.SKIP_PROPS:
      default: {
        let newProblemKeyValuePairs: Record<string, any> = {};

        // loop to copy only the required keys
        for (let key in this.problem) {
          // Skip only those keys, which are given in props and NOT a default key.
          if (props.includes(key) && !DEFAULT_KEYS.includes(key)) continue;
          newProblemKeyValuePairs[key] = this.problem[key];
        }
        const newProblem = new Problem(
          objectToProblemMap(newProblemKeyValuePairs)
        );
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
