import { DocumentReference } from '@/firebase/firestore'
import { QuerySnapshot, DocumentData } from '@firebase/firestore'
import { useEffect, useState } from 'react'

export interface UnrosteredPlayer {
	captain: boolean
	email: string
	firstname: string
	lastname: string
	registered: boolean
	team: DocumentReference | null
	ref: DocumentReference
	offers: []
}

export const useUnrosteredPlayers = (
	unrosteredPlayersQuerySnapshot:
		| QuerySnapshot<DocumentData, DocumentData>
		| undefined
): UnrosteredPlayer[] | undefined => {
	const [unrosteredPlayers, setUnrosteredPlayers] = useState<
		UnrosteredPlayer[] | undefined
	>()

	useEffect(() => {
		const updateUnrosteredPlayers = async () => {
			if (unrosteredPlayersQuerySnapshot) {
				const updatedUnrosteredPlayers: UnrosteredPlayer[] = await Promise.all(
					unrosteredPlayersQuerySnapshot.docs.map(
						async (unrosteredPlayer: DocumentData, index: number) => {
							const result: UnrosteredPlayer = {
								...unrosteredPlayer.data(),
								ref: unrosteredPlayersQuerySnapshot.docs[index].ref,
							}
							return result
						}
					)
				)

				setUnrosteredPlayers(updatedUnrosteredPlayers)
			}
		}

		updateUnrosteredPlayers()
	}, [unrosteredPlayersQuerySnapshot])

	return unrosteredPlayers
}
