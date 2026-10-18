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

Appointment JSON accepts `patient_name`, `phone`, `appointment_date` (`YYYY-MM-DD`), and `preferred_time`; optional fields are `email`, `age`, `gender`, `doctor` (published doctor's slug), and `reason`. Requests are validated, limited to five per hour per anonymous client, saved in the database, and then emailed when email settings are configured. On Railway Trial/Hobby, configure Resend's HTTPS API because outbound SMTP is unavailable. An email does not confirm a booked appointment; clinic staff must contact the patient.

## Deployment configuration

Use environment variables in the backend hosting provider. Configure a strong `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, `DJANGO_ALLOWED_HOSTS`, and the exact deployed frontend origin in `FRONTEND_ORIGINS`. Set `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` for PostgreSQL. For Railway Trial/Hobby, set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` using a sending-only Resend key and a verified sender address. On hosts that permit SMTP, set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, and `EMAIL_USE_TLS`. Never put mail credentials in React or commit them; store them only in backend secret settings.

Never commit `.env`, database credentials, SMTP passwords, or real patient data. Create staff accounts through Django admin/user management and grant only the permissions each staff member needs. Configure persistent media storage for doctor photos, offers, notices, and gallery images before production deployment.

## Railway demo deployment

Create a Railway project from the GitHub repository, then configure its Django service:

1. Set the service root directory to `/backend`.
2. Add a Railway PostgreSQL service. Set the Django service's `DATABASE_URL` to the Postgres service's `DATABASE_URL` reference.
3. Set the build command to `python manage.py collectstatic --no-input`.
4. Set the start command to `bash railway-start.sh`. It applies migrations, creates the configured superuser if missing, and starts Gunicorn on Railway's assigned port.
5. Generate a public domain, then set `DJANGO_ALLOWED_HOSTS` to that exact host without `https://` or a trailing slash.
6. Add a persistent volume mounted at `/app/media` so uploaded photos and documents survive restarts. The backend uses Railway's `RAILWAY_VOLUME_MOUNT_PATH` automatically when `MEDIA_ROOT` is not explicitly set.
7. Set `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, `FRONTEND_ORIGINS=https://hospital-rose-nu.vercel.app`, `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_PASSWORD`, and `DJANGO_SUPERUSER_EMAIL`. For appointment email notifications on Trial/Hobby, add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in Railway after setting up Resend and verifying the sender domain. Enter secrets directly in Railway; do not commit them.
8. Confirm `https://<railway-domain>/api/health/` returns `{"status":"ok"}` before changing Vercel's `VITE_API_BASE_URL` to `https://<railway-domain>/api` and redeploying the frontend.

The Railway database starts empty. Existing Render records and uploaded files are not copied by this deployment setup.
