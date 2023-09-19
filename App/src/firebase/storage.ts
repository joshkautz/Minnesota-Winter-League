import {
	ref,
	getStorage,
	deleteObject,
	StorageReference,
} from 'firebase/storage'

const storage = getStorage()

const deleteImage = (ref: StorageReference) => {
	return deleteObject(ref)
}

export { storage, ref, deleteImage, type StorageReference }
