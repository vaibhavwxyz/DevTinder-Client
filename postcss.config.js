export default {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
    "postcss-custom-properties": {
      preserve: false,
      importFrom: "./src/index.css",
    },
    "postcss-apply": {},
    "postcss-nesting": {},
  },
};
