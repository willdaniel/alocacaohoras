import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {
    ignores: ["dist/", "node_modules/", "back-end/node_modules/"],
  },
  {
    // Backend files
    files: ["back-end/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
        "no-useless-catch": "warn",
        "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    }
  },
  {
    // Frontend files
    files: ["front-end/**/*.{js,jsx}"],
    ...pluginReactConfig,
    languageOptions: {
      ...pluginReactConfig.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
        ...pluginReactConfig.rules,
        "react/prop-types": "off", // Turning off for now to reduce noise
        "react/react-in-jsx-scope": "off"
    }
  },
  {
    // vite.config.mjs
    files: ["vite.config.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // eslint.config.js
    files: ["eslint.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
];
