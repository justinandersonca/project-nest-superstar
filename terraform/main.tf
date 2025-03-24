terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "movie-theater-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC and Network Configuration
module "vpc" {
  source = "./modules/vpc"
  
  environment = var.environment
  project     = var.project
}

# ECS Cluster and Service
module "ecs" {
  source = "./modules/ecs"
  
  environment     = var.environment
  project         = var.project
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  public_subnets  = module.vpc.public_subnets
  
  depends_on = [module.vpc]
}

# RDS Database
module "rds" {
  source = "./modules/rds"
  
  environment     = var.environment
  project         = var.project
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  
  depends_on = [module.vpc]
}

# ECR Repository
module "ecr" {
  source = "./modules/ecr"
  
  environment = var.environment
  project     = var.project
}

# S3 Bucket for Terraform State
module "s3" {
  source = "./modules/s3"
  
  environment = var.environment
  project     = var.project
} 