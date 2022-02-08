module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2020,
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "env": {
        "browser": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended"
    ],
    "plugins": [
        "@typescript-eslint"
    ],
    "globals": {
        "__dirname": true,
        "module": true,
        "process": true,
        "require": true,
        "$": true,
        "Z": true
    },
    "rules": {},
    "overrides": [
        {
            "files": [
                "*.ts",
                "*.tsx"
            ]
        }
    ]
}