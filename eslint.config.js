// eslint.config.js
import pluginJs from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import securityPlugin from 'eslint-plugin-security';
import importSortPlugin from 'eslint-plugin-simple-import-sort';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';
import tsPlugin from 'typescript-eslint';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    {
        ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    },

    // Base JS rules
    pluginJs.configs.recommended,

    // Node globals
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },

    // TypeScript rules
    ...tsPlugin.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsPlugin.parser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/prefer-ts-expect-error': 'warn',
            '@typescript-eslint/strict-boolean-expressions': 'warn',
        },
    },

    // React + Hooks
    {
        files: ['**/*.tsx'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },

    // Unicorn
    {
        plugins: {
            unicorn: unicornPlugin,
        },
        rules: {
            'unicorn/empty-brace-spaces': 'off',
            'unicorn/no-null': 'off',
            'unicorn/prefer-node-protocol': 'error',
            'unicorn/prefer-logical-operator-over-ternary': 'warn',
            'unicorn/no-useless-undefined': 'warn',
        },
    },

    // Security
    securityPlugin.configs.recommended,
    {
        rules: {
            'security/detect-object-injection': 'off',
        },
    },

    // Import sorting
    {
        plugins: {
            'simple-import-sort': importSortPlugin,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },

    // General stylistic rules
    {
        rules: {
            'func-style': ['error', 'expression'],
            'no-restricted-syntax': ['off', 'ForOfStatement'],
            'no-console': ['warn'],
            'prefer-template': 'error',
            quotes: ['error', 'single', { avoidEscape: true }],
            'object-shorthand': ['error', 'always'],
            'arrow-body-style': ['error', 'as-needed'],
            'no-magic-numbers': ['warn', { ignore: [0, 1, -1], ignoreArrayIndexes: true }],
            'max-lines-per-function': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
        },
    },
];
