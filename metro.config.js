// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

// Get the default Metro configuration
const config = getDefaultConfig(__dirname);

// Modify the default config for SVG support
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");

// Export the modified configuration
module.exports = config;
