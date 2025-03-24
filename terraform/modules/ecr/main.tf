# ECR Repository
resource "aws_ecr_repository" "app" {
  name = "${var.project}-${var.environment}-repo"

  image_scanning_configuration {
    scan_on_push = true
  }

  image_tag_mutability = "MUTABLE"

  tags = {
    Name        = "${var.project}-${var.environment}-repo"
    Environment = var.environment
    Project     = var.project
  }
}

# Lifecycle Policy
resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name

  policy = jsonencode({
    rules = [
      {
        action = {
          type = "expire"
        }
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 14
        }
        description = "Remove untagged images after 14 days"
      },
      {
        action = {
          type = "expire"
        }
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["dev-"]
          countType     = "sinceImagePushed"
          countUnit     = "days"
          countNumber   = 7
        }
        description = "Remove dev- tagged images after 7 days"
      }
    ]
  })
}

# Outputs
output "repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "repository_name" {
  value = aws_ecr_repository.app.name
} 