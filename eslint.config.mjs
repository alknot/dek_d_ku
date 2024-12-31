import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'next', 'prettier'),
  {
    rules: {
      // Allow the usage of `any` without showing errors
      '@typescript-eslint/no-explicit-any': 'off',

      // Warn when a variable is declared but never used
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];

export default eslintConfig;