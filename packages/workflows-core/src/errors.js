// 
export class InvalidGraphError extends Error {
    details;
    constructor(message, details) {
        super(message);
        this.details = details;
        this.name = "InvalidGraphError";
    }
}
export class CyclicDependencyError extends InvalidGraphError {
    cyclePath;
    constructor(cyclePath) {
        super(`Workflow graph contains a cycle: ${cyclePath.join(" -> ")}`, { cyclePath });
        this.cyclePath = cyclePath;
        this.name = "CyclicDependencyError";
    }
}
export class InvalidStepConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidStepConfigError";
    }
}
