import { Problem } from "../src/index"
import { ProblemInterface } from "../src/types"

export default class ProblemContextHelper {
    
    _problemInstance: Problem;

    _instanceOptions: ProblemInterface = {
        type: "null-or-falsey-document",
        title: "The AsyncAPI document is null or a JS falsey value.",
        detail: "The AsyncAPI document is null or a JS falsey value."
    }


    constructor(customKeys?:string[]) {
        this._problemInstance = new Problem(this._instanceOptions, customKeys);
    }

}