import { Problem } from "../src"
import { ProblemInterface } from "../src/types"

export default class ProblemContextHelper {
    
    _problemInstance: Problem;

    _instanceOptions: ProblemInterface = {
        type: "null-or-falsey-document",
        title: "The AsyncAPI document is null or a JS falsey value.",
        detail: "The AsyncAPI document is null or a JS falsey value.",
        leaveThisWhenCopy:"This is used to test copy function: LEAVE PROPS. This will not be undefined in new copy. ",
        skipThisWhenCopy:"This is used to test copy functionL SKIP PROPS. This should be undefined in new copy.",
    }


    constructor() {
        this._problemInstance = new Problem(this._instanceOptions);
    }

}