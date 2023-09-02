import { useContext, useEffect, useState } from 'react'
import { OffersContext } from '@/firebase/offers-context'
import { TeamsContext } from '@/firebase/teams-context'
import {
	DocumentReference,
	DocumentData,
	getPlayerData,
	acceptOffer,
	rejectOffer,
} from '@/firebase/firestore'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { cn } from '@/lib/utils'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card'

interface OfferType {
	creator: 'player' | 'captain'
	player: DocumentReference
	team: DocumentReference
	status: 'pending' | 'accepted' | 'rejected'
	playerName: DocumentData
	teamName: DocumentData
}

export const Home = () => {
	const { outgoingOffersCollectionDataSnapshot } = useContext(OffersContext)
	const { collectionDataSnapshot } = useContext(TeamsContext)
	const [offers, setOffers] = useState(
		outgoingOffersCollectionDataSnapshot?.docs.map(
			(offer) => offer.data() as OfferType
		)
	)

	useEffect(() => {
		const updateOffers = async () => {
			if (outgoingOffersCollectionDataSnapshot) {
				const updatedOffers: OfferType[] = await Promise.all(
					outgoingOffersCollectionDataSnapshot.docs.map(
						async (offer: DocumentData) => {
							const result: OfferType = {
								...offer.data(),
								playerName: (await getPlayerData(offer.data().player)).data()
									?.firstname,
								teamName: collectionDataSnapshot?.docs
									.find((team) => team.id == offer.data().team.id)
									?.data().name,
							}
							return result
						}
					)
				)

				setOffers(updatedOffers)
			}
		}

		updateOffers()
	}, [outgoingOffersCollectionDataSnapshot, collectionDataSnapshot])

	const offlineTestData = [
		{
			status: 'pending',
			creator: 'captain',
			team: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'teams',
							'ElgHNAw1pxDxtiVR9YLy',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			player: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'players',
							'HtOj11o9SjnZYNFUNHhg',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			playerName: 'Joshua',
			teamName: 'Fierce Crimson Platypus',
		},
		{
			team: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'teams',
							'ElgHNAw1pxDxtiVR9YLy',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			creator: 'captain',
			player: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'players',
							'WIZ8Rw4dsWQZ27qGtN4d',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			status: 'pending',
			playerName: 'Drew',
			teamName: 'Fierce Crimson Platypus',
		},
		{
			creator: 'captain',
			team: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'teams',
							'ElgHNAw1pxDxtiVR9YLy',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			player: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'players',
							'Y2PGZQ00pcMTIghG1zxD',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			status: 'pending',
			playerName: 'Chet',
			teamName: 'Fierce Crimson Platypus',
		},
		{
			creator: 'captain',
			team: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'teams',
							'ElgHNAw1pxDxtiVR9YLy',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			player: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'players',
							'E7YPYFVu2xLVpdHfHWf0',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			status: 'pending',
			playerName: 'Bud',
			teamName: 'Fierce Crimson Platypus',
		},
		{
			creator: 'captain',
			team: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'teams',
							'ElgHNAw1pxDxtiVR9YLy',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			status: 'pending',
			player: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'players',
							'8GbzY5pqZBFfMtdFHnBZ',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			playerName: 'Genna',
			teamName: 'Fierce Crimson Platypus',
		},
		{
			status: 'pending',
			player: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'players',
							'xPT2VIqhnAiTyTMEeSeL',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			team: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'teams',
							'ElgHNAw1pxDxtiVR9YLy',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			creator: 'captain',
			playerName: 'Simon',
			teamName: 'Fierce Crimson Platypus',
		},
		{
			team: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'teams',
							'ElgHNAw1pxDxtiVR9YLy',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			creator: 'captain',
			status: 'pending',
			player: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'players',
							'rFqfWhh9ywnZoynvVoIo',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			playerName: 'Gayle',
			teamName: 'Fierce Crimson Platypus',
		},
		{
			creator: 'captain',
			team: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'teams',
							'ElgHNAw1pxDxtiVR9YLy',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			player: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'players',
							'jsUc9AB5M8YrvbXS4y1N',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			status: 'pending',
			playerName: 'Zula',
			teamName: 'Fierce Crimson Platypus',
		},
		{
			team: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'teams',
							'ElgHNAw1pxDxtiVR9YLy',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			creator: 'captain',
			player: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'players',
							'ApWeOm34UhKfi0pKFSaO',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			status: 'pending',
			playerName: 'Yevette',
			teamName: 'Fierce Crimson Platypus',
		},
		{
			status: 'pending',
			team: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'teams',
							'ElgHNAw1pxDxtiVR9YLy',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			player: {
				converter: null,
				_key: {
					path: {
						segments: [
							'projects',
							'minnesota-winter-league',
							'databases',
							'(default)',
							'documents',
							'players',
							'ru1RQ7L6PpuBw3o8lOPr',
						],
						offset: 5,
						len: 2,
					},
				},
				type: 'document',
				firestore: {
					app: {
						_isDeleted: false,
						_options: {
							apiKey: 'AIzaSyD9BRnmHEKSLpc73jY0FxCWjPbwewblCWE',
							authDomain: 'winter.mplsmallard.com',
							projectId: 'minnesota-winter-league',
							storageBucket: 'minnesota-winter-league.appspot.com',
							messagingSenderId: '756702616854',
							appId: '1:756702616854:web:d44ea341507e8dfd444437',
						},
						_config: {
							name: '[DEFAULT]',
							automaticDataCollectionEnabled: false,
						},
						_name: '[DEFAULT]',
						_automaticDataCollectionEnabled: false,
						_container: { name: '[DEFAULT]', providers: {} },
					},
					databaseId: {
						projectId: 'minnesota-winter-league',
						database: '(default)',
					},
					settings: {
						host: 'firestore.googleapis.com',
						ssl: true,
						ignoreUndefinedProperties: false,
						cacheSizeBytes: 41943040,
						experimentalForceLongPolling: false,
						experimentalAutoDetectLongPolling: true,
						experimentalLongPollingOptions: {},
						useFetchStreams: true,
					},
				},
			},
			creator: 'captain',
			playerName: 'Melinda',
			teamName: 'Fierce Crimson Platypus',
		},
	]

	const handleAccept = (offer: DocumentData) => {
		acceptOffer(offer.id)
			.then(() => {
				toast({
					title: 'Request accepted',
					variant: 'default',
					description: `${offer.playerName} has joined ${offer.teamName}!`,
				})
			})
			.catch(() => {
				toast({
					title: 'Unable to accept',
					variant: 'destructive',
					description: `Please wait a moment and try again.`,
				})
			})
	}
	const handleReject = (offer: DocumentData) => {
		rejectOffer(offer.id)
			.then(() => {
				console.log('rejected', offer)
			})
			.catch(() => {
				toast({
					title: 'Unable to reject',
					variant: 'destructive',
					description: `Please wait a moment and try again.`,
				})
			})
	}

	const [offlineData, setOfflineData] = useState(offlineTestData)

	const outgoingPending = offlineData.filter(
		(offer) => offer.status === 'pending'
	).length
	const getMessage = (length: number | undefined) => {
		if (!length || length === 0) {
			return 'You have no pending invites at this time.'
		}
		if (length > 1) {
			return `You have ${length} invites pending.`
		}

		return `You have one invite pending.`
	}

	const handleCancel = (index: number) => {
		const updatedData = offlineData.filter((_, i) => i !== index)
		setOfflineData(updatedData)
	}

	return (
		<div className="container">
			<div
				className={
					'my-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500'
				}
			>
				Home
			</div>
			<div className={'flex flex-row flex-wrap justify-center gap-8'}>
				<div className=" max-w-[600px] flex-1 basis-80">Players</div>
				<Card className=" max-w-[600px] flex-1 basis-80">
					<CardHeader>
						<CardTitle>Sent Invites</CardTitle>
						<CardDescription>{getMessage(outgoingPending)}</CardDescription>
					</CardHeader>
					<CardContent>
						{offlineData &&
							offlineData.map((offer: DocumentData, index) => {
								const statusColor =
									offer.status === 'pending'
										? 'bg-transparent'
										: 'bg-transparent'

								return (
									<div className="flex items-end gap-2 py-2">
										<span
											className={cn(
												'flex flex-shrink-0 content-center self-start w-2 h-2 mt-2 mr-2 translate-y-1 rounded-full',
												statusColor
											)}
										/>
										<div className="mr-2">
											<p>{offer.playerName}</p>
											<p className="overflow-hidden text-sm max-h-5 text-muted-foreground">
												invite sent to join {offer.teamName}
											</p>
										</div>
										<div className="flex justify-end flex-1 gap-2">
											<Button
												size={'sm'}
												variant={'outline'}
												onClick={() => handleCancel(index)}
											>
												Cancel
											</Button>
										</div>
									</div>
								)
							})}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
