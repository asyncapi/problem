import { CONTENT_TYPE, Problem } from "types/problem";
export class AsyncApiProblem extends Error implements Problem {

    public "Content-Type" = CONTENT_TYPE;
    public type: string;
    public title: string;
    public errorUrlPrefix: string;
    public status: number;
    public instance?: string;
    public skipFields?: string[];
    public detail?: string;
    public parsedJSON?: object | undefined;
    public validationErrors?: object[] | undefined;
    public location?: object[] | undefined;
    public refs?: object[] | undefined;
    [key: string]: any;


    constructor(problem: Problem) {
        super(problem.detail || problem.title);
        this.errorUrlPrefix = problem.errorUrlPrefix;
        this.instance = problem.instance;
        this.detail = problem.detail;
        this.type =
            problem
                .type
                .startsWith(problem.errorUrlPrefix)
                ? problem.type
                : `${problem.URL_PREFIX}${problem.type}`;

        this.title = problem.title;
        this.status = problem.status;
        this.skipFields = problem.skipFields || [];
        this.parsedJSON = problem.parsedJSON;
        this.validationErrors = problem.validationErrors
        this.location = problem.location;
        this.refs = problem.refs;

        // initiate miscalleneous keys
        for (let key in problem) {
            if (this.skipFields.includes(key))
                continue;
            this[key] = problem[key];
        }
    }

};