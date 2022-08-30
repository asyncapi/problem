import { DEFAULT_KEYS } from "./constants";
import {
  httpObject,
  ProblemInterface,
  ToJsonParamType,
  UpdateProblemParamType,
} from "./types";

export enum COPY_MODE {
  SKIP_PROPS = "skipProps",
  LEAVE_PROPS = "leaveProps",
}

export class Problem extends Error implements ProblemInterface {
  public type: string;
  public title: string;
  public instance?: string;
  public detail?: string;
  public http?: httpObject;
  [key: string]: any;

  constructor(
    protected readonly problem: ProblemInterface,
  ) {
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
        return new Problem(problem, props);

      case COPY_MODE.SKIP_PROPS:
      default:
        let keysToBeCopied: string[] = [];
        for (let key in problem) {
          if (props.includes(key)) continue;
          keysToBeCopied.push(key);
        }
        return new Problem(
          { type: problem.type, title: problem.title },
          keysToBeCopied
        );
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
