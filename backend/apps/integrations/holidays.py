import requests
from django.conf import settings


class HolidayClient:
    def get_national_holiday(self, date):
        year = date.year
        url = f"{settings.BRASIL_API_BASE_URL}/feriados/v1/{year}"
        try:
            response = requests.get(url, timeout=settings.BRASIL_API_TIMEOUT_SECONDS)
            response.raise_for_status()
            holidays = response.json()
        except (requests.RequestException, ValueError):
            return None

        if not isinstance(holidays, list):
            return None

        date_iso = date.isoformat()
        return next((item for item in holidays if item.get("date") == date_iso), None)
