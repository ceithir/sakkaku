/**
 * https://github.com/DocSpring/craco-antd
 * https://github.com/DocSpring/craco-less/issues/45#issuecomment-692571756
 */

const CracoAntDesignPlugin = require("craco-antd");
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    // This plugin takes care of the .less files (and does a bit of magic on the side)
    {
      plugin: CracoAntDesignPlugin,
    },
    // This plugin take scare of the .module.less files
    {
      plugin: CracoLessPlugin,
      options: {
        modifyLessRule: function (lessRule, _context) {
          lessRule.test = /\.(less)$/;
          lessRule.use = [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ];
          lessRule.exclude = /node_modules/;
          return lessRule;
        },
      },
    },
  ],
};
