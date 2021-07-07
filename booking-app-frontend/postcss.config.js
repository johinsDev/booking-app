const isProductionMode = process.env.NODE_ENV === "production";

module.exports = {
  plugins: [
    "postcss-import",
    "tailwindcss",
    "postcss-nesting",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
        features: {
          "custom-properties": false,
        },
      },
    ],

    [
      "cssnano",
      {
        preset: "advanced",
      },
      isProductionMode,
    ],
  ],
};
