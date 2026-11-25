
const { withProjectBuildGradle } = require("expo/config-plugins");

module.exports = function withFirebaseBom(config) {
  return withProjectBuildGradle(config, (config) => {
    config.modResults.contents += `

project.ext {
  set('react-native', [versions: [firebase: [bom: '34.19.0']]])
}
`;

    return config;
  });
};
