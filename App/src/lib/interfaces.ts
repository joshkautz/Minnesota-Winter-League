import { DocumentData, DocumentReference } from '@/firebase/firestore'
import { Timestamp } from '@firebase/firestore'

export interface PlayerData extends DocumentData {
	captain: boolean
	email: string
	firstname: string
	lastname: string
	registered: boolean
	team: DocumentReference<TeamData, DocumentData>
}

export interface ExtendedPlayerData extends PlayerData {
	ref: DocumentReference<PlayerData, DocumentData>
}

export interface TeamData extends DocumentData {
	captains: DocumentReference<PlayerData, DocumentData>[]
	logo: string
	name: string
	registered: boolean
	registeredDate: Timestamp
	roster: DocumentReference<PlayerData, DocumentData>[]
	storagePath: string
}

export interface ExtendedTeamData extends TeamData {
	registeredCount: number
	id: string
	ref: DocumentReference
}

export interface OfferData extends DocumentData {
	creator: string
	player: DocumentReference<PlayerData, DocumentData>
	status: string
	team: DocumentReference<TeamData, DocumentData>
}

export interface ExtendedOfferData extends OfferData {
	playerName: string
	teamName: string
	ref: DocumentReference
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
}

export interface GamesData extends DocumentData {
	away: DocumentReference<TeamData, DocumentData>
	awayScore: number
	date: Timestamp
	field: number
	home: DocumentReference<TeamData, DocumentData>
	homeScore: number
}
