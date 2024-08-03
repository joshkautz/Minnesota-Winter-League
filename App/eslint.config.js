import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	react.configs.flat.recommended,
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'no-undef': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/jsx-no-target-blank': 'off',
			'react/prop-types': 'off',
			'react/no-unescaped-entities': 'off',
			'react/jsx-uses-react': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
		},
	}
)
