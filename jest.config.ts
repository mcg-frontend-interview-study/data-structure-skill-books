import type {Config} from 'jest';
import {createDefaultEsmPreset} from 'ts-jest';

const presetConfig = createDefaultEsmPreset({
  preset: 'ts-jest',
});

export default {
  ...presetConfig,
  collectCoverageFrom: [
    // 커버리지 수집 대상 및 제외 파일. (문법 => ! ? 제외 : 포함)
    'src/**/*.{ts,tsx,js,jsx}',

    '!src/constants/**',
    '!src/**/utils/**',
  ],
} satisfies Config;
