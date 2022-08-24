import { Problem } from "../problem";

export type ProblemInterface = {
  type: string;
  title: string; // Title should be description of http status, if type is not present.
  http?: httpObject;
  detail?: string;
  instance?: string; // Details to reproduce the error.
  stack?: string;
  [key: string]: any; // Custom Field of Problem
};

export type httpObject = {
  status: number; // Status Code
  [key: string]: any;
};

export type UpdateProblemParamType = {
  updates: { [key: string]: any };
};

export type ToJsonParamType = {
  includeStack?:boolean
}