import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import checkFile from "eslint-plugin-check-file";

const sourceFileGlob = "**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [sourceFileGlob],
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      // 파일이름은 케밥 케이스로 합니다.
      "check-file/filename-naming-convention": [
        "error",
        {
          [sourceFileGlob]: "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      // <img> 태그를 사용하면 에러처리합니다.
      "@next/next/no-img-element": "error",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",

        // 상수 + React 컴포넌트
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },

        // 일반 변수
        {
          selector: "variable",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },

        // 일반 함수 + React 컴포넌트
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },

        // JSX에서 사용하는 컴포넌트 매개변수
        {
          selector: "parameter",
          filter: {
            regex: "^_?[A-Z]",
            match: true,
          },
          format: ["PascalCase"],
          leadingUnderscore: "allow",
        },

        // 일반 함수 매개변수
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },

        // type, interface, class, enum
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },

        // 서버 응답의 user_id 같은 필드는 허용
        {
          selector: "property",
          format: null,
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
