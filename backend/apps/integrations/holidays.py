import requests
from django.conf import settings


class HolidayClient:
    def get_national_holiday(self, date):
        year = date.year
        url = f"{settings.BRASIL_API_BASE_URL}/feriados/v1/{year}"
        try:
            response = requests.get(url, timeout=settings.BRASIL_API_TIMEOUT_SECONDS)
            response.raise_for_status()
        except requests.RequestException:
            return None

        date_iso = date.isoformat()
        return next((item for item in response.json() if item.get("date") == date_iso), None)
