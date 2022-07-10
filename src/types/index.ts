export const CONTENT_TYPE  = "application/problem+json"

export type Problem = {
    "Content-Type": string;
    errorUrlPrefix:string, 
    status:number,          // Status Code
    type:string,
    title: string,          // Title should be description of Status Code if type is not present.
    detail?: string,
    instance?: string,      // Details to reproduce the error.
    parsedJSON?:object;
    validationErrors?:object[];
    location?:object[];
    refs?:object[];
    stack?:string;
    skipFields?:string[];   // fields to skip during construct statement.
    [key:string]: any,      // Custom Field of Problem
}