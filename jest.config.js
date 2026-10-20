import { createDefaultEsmPreset } from "ts-jest";

export default {
    ...createDefaultEsmPreset(),
    testEnvironment: "node",
    collectCoverageFrom: ["src/**/*.ts"],
    testPathIgnorePatterns: [".*/dist/.*", ".*dist.*"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};
