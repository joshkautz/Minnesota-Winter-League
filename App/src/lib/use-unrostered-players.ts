import { QuerySnapshot, DocumentData } from '@firebase/firestore'
import { useEffect, useState } from 'react'
import { ExtendedPlayerData, PlayerData } from './interfaces'

export const useUnrosteredPlayers = (
	unrosteredPlayersQuerySnapshot:
		| QuerySnapshot<PlayerData, DocumentData>
		| undefined
): {
	unrosteredPlayers: ExtendedPlayerData[] | undefined
	unrosteredPlayersLoading: boolean
} => {
	const [unrosteredPlayers, setUnrosteredPlayers] = useState<
		ExtendedPlayerData[] | undefined
	>()

	const [unrosteredPlayersLoading, setUnrosteredPlayersLoading] = useState(true)

	useEffect(() => {
		const updateUnrosteredPlayers = async () => {
			if (unrosteredPlayersQuerySnapshot) {
				try {
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
				} catch (error) {
					console.log(error)
				} finally {
					setUnrosteredPlayersLoading(false)
				}
			}
		}

		updateUnrosteredPlayers()
	}, [unrosteredPlayersQuerySnapshot])

	return { unrosteredPlayers, unrosteredPlayersLoading }
}
