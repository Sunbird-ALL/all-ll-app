module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        'no-unused-vars': 'off',
        'react/prop-types': 'off',
        'no-redeclare': 'off',
        'no-global-assign': 'off',
        'no-extra-semi': 'off',
        'no-irregular-whitespace': 'off',
        'no-dupe-keys': 'off',
        'no-prototype-builtins': 'off',
        'react/jsx-key': 'off',
        'react/react-in-jsx-scop': 'off',
        'no-self-assign': 'off'
    }
}
