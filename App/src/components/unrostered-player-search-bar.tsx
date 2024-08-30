import { Input } from './ui/input'

export const UnrosteredPlayerSearchBar = ({
	value,
	onChange,
}: {
	value: string
	onChange: React.Dispatch<React.SetStateAction<string>>
}) => {
	return (
		<div className={'pt-2'}>
			<Input
				placeholder={'Start typing to search...'}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	)
}
