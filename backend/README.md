# Sirjana Polyclinic API

Django backend for clinic content management and appointment requests. The React app stays in `../frontend`.

## Local setup (Windows PowerShell)

From the repository root:

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/Activate.ps1
python -m pip install -r backend/requirements.txt
Copy-Item backend/.env.example backend/.env
```

Set local environment values in PowerShell before starting (or use your preferred environment-variable loader):

```powershell
$env:DJANGO_DEBUG = "true"
$env:DJANGO_SECRET_KEY = "replace-with-a-random-local-secret"
$env:FRONTEND_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
```

Then create the database and the first administrator:

```powershell
Set-Location backend
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The admin is at `http://127.0.0.1:8000/admin/`; the API health check is `http://127.0.0.1:8000/api/health/`.
Configure `frontend/.env` from `frontend/.env.example` when running the Vite site locally. For deployment, set `VITE_API_BASE_URL` to the public backend API URL and add the deployed frontend origin to the backend's `FRONTEND_ORIGINS`.

## Public API

- `GET /api/doctors/` and `GET /api/doctors/{slug}/`
- `GET /api/services/`
- `GET /api/facilities/`
- `GET /api/offers/` (published and within their date range)
- `GET /api/notices/` and `GET /api/notices/featured/` (published, unexpired notices)
- `GET /api/notices/first-visit/` (published notices approved for first-visit display)
- `GET /api/gallery/`
- `POST /api/appointments/`

Appointment JSON accepts `patient_name`, `phone`, `appointment_date` (`YYYY-MM-DD`), and `preferred_time`; optional fields are `email`, `age`, `gender`, `doctor` (published doctor's slug), and `reason`. Requests are validated, limited to five per hour per anonymous client, saved in the database, and then emailed when email settings are configured. An email does not confirm a booked appointment; clinic staff must contact the patient.

## Deployment configuration

Use environment variables in the backend hosting provider. Configure a strong `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, `DJANGO_ALLOWED_HOSTS`, and the exact deployed frontend origin in `FRONTEND_ORIGINS`. Set `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` for PostgreSQL. The appointment recipient and Gmail SMTP host/port/sender are prefilled in `.env.example`; set `EMAIL_HOST_PASSWORD` to an authorized Gmail App Password (or use an approved mail provider's SMTP settings) to enable delivery. Google requires 2-Step Verification for App Passwords. Never put the App Password in React or commit it to Git; store it only in the backend `.env` for local use or the backend host's secret environment settings for deployment.

Never commit `.env`, database credentials, SMTP passwords, or real patient data. Create staff accounts through Django admin/user management and grant only the permissions each staff member needs. Configure persistent media storage for doctor photos, offers, notices, and gallery images before production deployment.
