import json
import os

import boto3

ses = boto3.client("ses", region_name=os.getenv("AWS_REGION", "us-east-1"))


def handler(event, _context):
    source = os.environ["SES_FROM_EMAIL"]

    for record in event.get("Records", []):
        payload = json.loads(record["body"])
        recipient = payload["recipient_email"]
        task_id = payload["task_id"]

        ses.send_email(
            Source=source,
            Destination={"ToAddresses": [recipient]},
            Message={
                "Subject": {"Data": "Uma tarefa foi compartilhada com você"},
                "Body": {
                    "Text": {
                        "Data": (
                            f"A tarefa {task_id} foi compartilhada com você. "
                            "Acesse a aplicação para responder ao convite."
                        )
                    }
                },
            },
        )

    return {"statusCode": 200}
