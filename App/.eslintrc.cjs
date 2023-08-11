module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	root: true,
	env: { browser: true, es2020: true, node: true },
	rules: {
		'no-mixed-spaces-and-tabs': 'off',
	},
}
