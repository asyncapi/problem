export type Problem = {
    http: httpObject,
    type: string,
    title: string,          // Title should be description of Status Code if type is not present.
    detail?: string,
    instance?: string,      // Details to reproduce the error.
    stack?: string;
    [key: string]: any,      // Custom Field of Problem
}

export type httpObject= {
    status: number,          // Status Code
    [key: string]: any,
}