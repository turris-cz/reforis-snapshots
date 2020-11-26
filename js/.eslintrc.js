module.exports = {
    extends: ["eslint-config-reforis", "prettier"],
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": ["error"],
        "react/jsx-curly-newline": "off",
    },
};
