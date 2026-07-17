from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    request = context.get("request")
    request_id = getattr(request, "request_id", None)
    detail = response.data
    message = detail.get("detail", detail) if isinstance(detail, dict) else detail
    response.data = {
        "error": {
            "code": getattr(exc, "default_code", "api_error"),
            "message": str(message),
            "request_id": request_id,
            "details": detail if isinstance(detail, dict) else {},
        }
    }
    return response
