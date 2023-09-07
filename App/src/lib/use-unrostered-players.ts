import { QuerySnapshot, DocumentData } from '@firebase/firestore'
import { useEffect, useState } from 'react'
import { ExtendedPlayerData, PlayerData } from './interfaces'

export const useUnrosteredPlayers = (
	unrosteredPlayersQuerySnapshot:
		| QuerySnapshot<PlayerData, DocumentData>
		| undefined
): ExtendedPlayerData[] | undefined => {
	const [unrosteredPlayers, setUnrosteredPlayers] = useState<
		ExtendedPlayerData[] | undefined
	>()

	useEffect(() => {
		const updateUnrosteredPlayers = async () => {
			if (unrosteredPlayersQuerySnapshot) {
				const updatedUnrosteredPlayers: ExtendedPlayerData[] =
					await Promise.all(
						unrosteredPlayersQuerySnapshot.docs.map(
							async (unrosteredPlayer: DocumentData, index: number) => {
								const result: ExtendedPlayerData = {
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
