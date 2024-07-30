# Enables Firebase services for the new project created above.
# This action essentially "creates a Firebase project" and allows the project to use
# Firebase services (like Firebase Authentication) and
# Firebase tooling (like the Firebase console).
resource "google_firebase_project" "development" {
  # Use the provider that performs quota checks from now on
  provider = google-beta
  project  = google_project.default.project_id

  # Waits for the required APIs to be enabled.
  depends_on = [
    google_project_service.default
  ]
}

# Provisions the Firestore database instance.
resource "google_firestore_database" "development" {
  provider                    = google-beta
  project                     = google_project.default.project_id
  name                        = "(default)"
  # See available locations: https://firebase.google.com/docs/projects/locations#default-cloud-location
  location_id                 = "nam5"
  # "FIRESTORE_NATIVE" is required to use Firestore with Firebase SDKs, authentication, and Firebase Security Rules.
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode            = "OPTIMISTIC"

  # Wait for Firebase to be enabled in the Google Cloud project before initializing Firestore.
  depends_on = [
    google_firebase_project.development,
  ]
}

# Creates a Firebase Web App in the new project created above.
resource "google_firebase_web_app" "development" {
  provider     = google-beta
  project      = google_project.default.project_id
  display_name = "Minneapolis Winter League"

  # The other App types (Android and Apple) use "DELETE" by default.
  # Web apps don't use "DELETE" by default due to backward-compatibility.
  deletion_policy = "DELETE"

  # Wait for Firebase to be enabled in the Google Cloud project before creating this App.
  depends_on = [
    google_firebase_project.development,
  ]
}