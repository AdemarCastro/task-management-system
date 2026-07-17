from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="useraccount",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="useraccount",
            name="last_login",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="useraccount",
            name="password",
            field=models.CharField(default="!", max_length=128),
        ),
        migrations.CreateModel(
            name="PasswordResetToken",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("token_hash", models.CharField(max_length=64, unique=True)),
                ("expires_at", models.DateTimeField()),
                ("used_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="password_reset_tokens",
                        to="accounts.useraccount",
                    ),
                ),
            ],
            options={
                "indexes": [models.Index(fields=["user", "expires_at"], name="accounts_pa_user_id_5b11d7_idx")],
            },
        ),
    ]
