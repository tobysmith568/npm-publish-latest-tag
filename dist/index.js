"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github = require("@actions/github");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield runGitHubAction();
    }
    catch (error) {
        handleErrorInGitHubAction(error);
    }
});
const runGitHubAction = () => __awaiter(void 0, void 0, void 0, function* () {
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
});
const handleErrorInGitHubAction = (error) => {
    if (!!(error === null || error === void 0 ? void 0 : error.message)) {
        core.setFailed(error.message);
        return;
    }
    if (typeof error === "string") {
        core.setFailed(error);
        return;
    }
    core.setFailed("Action failed with an unknown error");
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield main();
}))();
