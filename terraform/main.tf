# Terraform configuration to set up providers by version.
terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
  }
}

# Configures the provider to use the resource block's specified project for quota checks.
provider "google-beta" {
  user_project_override = true
}

# Configures the provider to not use the resource block's specified project for quota checks.
# This provider should only be used during project creation and initializing services.
provider "google-beta" {
  alias = "no_user_project_override"
  user_project_override = false
}

# Creates a new Google Cloud project.
resource "google_project" "default" {
  # Use the provider that enables the setup of quota checks for a new project
  provider   = google-beta.no_user_project_override

  name       = "Minnesota Winter League"
  project_id = "minnesota-winter-league"
  # Required for any service that requires the Blaze pricing plan
  # (like Firebase Authentication with GCIP)
  billing_account = "017704-8640FF-929502"

  # Required for the project to display in any list of Firebase projects.
  labels = {
    "firebase" = "enabled"
  }
}

# Enables required APIs.
resource "google_project_service" "default" {
  # Use the provider without quota checks for enabling APIS
  provider = google-beta.no_user_project_override
  project  = google_project.default.project_id
  for_each = toset([
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    "serviceusage.googleapis.com", # Enabling the ServiceUsage API allows the new project to be quota checked from now on.
    "identitytoolkit.googleapis.com",
    "firestore.googleapis.com",
    "firebaserules.googleapis.com",
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

# Enables Firebase services for the new project created above.
# This action essentially "creates a Firebase project" and allows the project to use
# Firebase services (like Firebase Authentication) and
# Firebase tooling (like the Firebase console).
resource "google_firebase_project" "default" {
  # Use the provider that performs quota checks from now on
  provider = google-beta

  project  = google_project.default.project_id

  # Waits for the required APIs to be enabled.
  depends_on = [
    google_project_service.default
  ]
}

# Creates an Identity Platform config.
# Also enables Firebase Authentication with Identity Platform in the project if not.
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  # For example, you can configure to auto-delete Anonymous users.
  autodelete_anonymous_users = false

  # Wait for identitytoolkit.googleapis.com to be enabled before initializing Authentication.
  depends_on = [
    google_project_service.default,
  ]
}

# Adds more configurations, like for the email/password sign-in provider.
resource "google_identity_platform_project_default_config" "default" {
  provider = google-beta
  project  = google_project.default.project_id
  sign_in {
    allow_duplicate_emails = false

    anonymous {
      enabled = false
    }

    email {
      enabled           = true
      password_required = false
    }
  }

  # Wait for Authentication to be initialized before enabling email/password.
  depends_on = [
    google_identity_platform_config.default
  ]
}

# Provisions the Firestore database instance.
resource "google_firestore_database" "default" {
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
    google_firebase_project.default,
  ]
}

# Creates a Firebase Web App in the new project created above.
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = google_project.default.project_id
  display_name = "Minnesota Winter League"

  # The other App types (Android and Apple) use "DELETE" by default.
  # Web apps don't use "DELETE" by default due to backward-compatibility.
  deletion_policy = "DELETE"

  # Wait for Firebase to be enabled in the Google Cloud project before creating this App.
  depends_on = [
    google_firebase_project.default,
  ]
}