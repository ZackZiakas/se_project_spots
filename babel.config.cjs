const presets = [
  [
    "@babel/preset-env", // The preset you want to use.
    {
      targets: "defaults, IE 11, not dead",
      useBuiltIns: "entry",
      corejs: "^3",
    },
  ],
];

const config = {
  presets,
  // 👇 this is what fixes the error
  sourceType: "module",
};

module.exports = config;
