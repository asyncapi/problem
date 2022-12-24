export type ProblemInterface = {
  type: string;
  title: string;
  http?: HttpObject;
  detail?: string;
  instance?: string;
  stack?: string;
  [key: string]: any;
};

export type HttpObject = {
  status: number; // Status Code
  [key: string]: any;
};

export type UpdateProblemParamType = {
  updates: { [key: string]: any };
};

export type ToJsonParamType = {
  includeStack?: boolean;
};
