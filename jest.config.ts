import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset({
    preset: "ts-jest",
});

export default {
    ...presetConfig,
} satisfies Config;
