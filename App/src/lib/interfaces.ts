import { DocumentData, DocumentReference } from '@/firebase/firestore'
import { Timestamp } from '@firebase/firestore'

export enum OfferCreator {
	CAPTAIN = 'captain',
	NONCAPTAIN = 'noncaptain',
}

export enum OfferStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
}

export enum OfferType {
	INCOMING = 'incoming',
	OUTGOING = 'outgoing',
}

export interface OfferAction {
	title: string
	action: (
		offerDocumentReference: DocumentReference<OfferData, DocumentData>
	) => void
}

/////////////////////////////////////////////////////////////////
///////////////////////// Document Data /////////////////////////
/////////////////////////////////////////////////////////////////

export interface PlayerData extends DocumentData {
	admin: boolean
	email: string
	firstname: string
	lastname: string
	seasons: {
		captain: boolean
		paid: boolean
		season: DocumentReference<SeasonData, DocumentData>
		signed: boolean
		team: DocumentReference<TeamData, DocumentData> | null
	}[]
}

export interface TeamData extends DocumentData {
	logo: string
	name: string
	placement: number
	registered: boolean
	registeredDate: Timestamp
	roster: {
		captain: boolean
		player: DocumentReference<PlayerData, DocumentData>
	}[]
	season: DocumentReference<SeasonData, DocumentData>
	storagePath: string
	teamId: string
}

export interface SeasonData extends DocumentData {
	dateEnd: Timestamp
	dateStart: Timestamp
	name: string
	registrationEnd: Timestamp
	registrationStart: Timestamp
	teams: DocumentReference<TeamData, DocumentData>[]
}

export interface OfferData extends DocumentData {
	creator: OfferCreator
	creatorName: string
	player: DocumentReference<PlayerData, DocumentData>
	status: OfferStatus
	team: DocumentReference<TeamData, DocumentData>
}

export interface ExtendedOfferData extends OfferData {
	playerName: string
	teamName: string
}

export interface CheckoutSessionData extends DocumentData {
	cancel_url: string
	client: string
	created: Timestamp
	mode: string
	price: string
	sessionId: string
	success_url: string
	url: string
}

export interface StandingsData extends DocumentData {
	wins: number
	losses: number
	pointsFor: number
	pointsAgainst: number
	differential: number
}

export interface GameData extends DocumentData {
	away: DocumentReference<TeamData, DocumentData>
	awayScore: number
	date: Timestamp
	field: number
	home: DocumentReference<TeamData, DocumentData>
	homeScore: number
	season: DocumentReference<SeasonData, DocumentData>
}
