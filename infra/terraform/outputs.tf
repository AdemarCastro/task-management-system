output "ecr_repository_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "task_events_queue_url" {
  value = aws_sqs_queue.task_events.url
}

output "task_events_dlq_url" {
  value = aws_sqs_queue.task_events_dlq.url
}
