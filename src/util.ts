import { ProblemInterface } from "@types";

export const objectToProblemMap = (obj: Record<string, any>) => {
  const type: string = obj.type;
  const title: string = obj.title;
  const problemObject: ProblemInterface = {
    type,
    title,
    ...obj,
  };
  return problemObject;
};
