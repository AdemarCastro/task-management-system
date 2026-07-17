import json
import uuid

import boto3
from django.conf import settings


class TaskEventPublisher:
    def publish_task_shared(self, share) -> None:
        if not settings.SQS_TASK_EVENTS_URL:
            return

        payload = {
            "event_id": str(uuid.uuid4()),
            "type": "TaskShared",
            "share_id": str(share.id),
            "task_id": str(share.task_id),
            "recipient_email": share.recipient.email,
        }
        client = boto3.client("sqs", region_name=settings.AWS_REGION)
        client.send_message(
            QueueUrl=settings.SQS_TASK_EVENTS_URL,
            MessageBody=json.dumps(payload),
        )
