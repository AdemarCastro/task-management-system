from datetime import date

import pytest
import responses
from requests import Timeout

from apps.integrations.holidays import HolidayClient


@pytest.mark.django_db
@responses.activate
def test_holiday_client_returns_matching_holiday(settings):
    settings.BRASIL_API_BASE_URL = "https://holidays.test/api"
    responses.add(
        responses.GET,
        "https://holidays.test/api/feriados/v1/2026",
        json=[{"date": "2026-09-07", "name": "Independencia"}],
        status=200,
    )

    holiday = HolidayClient().get_national_holiday(date(2026, 9, 7))

    assert holiday == {"date": "2026-09-07", "name": "Independencia"}


@pytest.mark.django_db
@responses.activate
@pytest.mark.parametrize("body", [Timeout(), "not-json"])
def test_holiday_client_fails_open_for_timeout_or_invalid_payload(settings, body):
    settings.BRASIL_API_BASE_URL = "https://holidays.test/api"
    responses.add(
        responses.GET,
        "https://holidays.test/api/feriados/v1/2026",
        body=body,
        status=200,
    )

    assert HolidayClient().get_national_holiday(date(2026, 9, 7)) is None
