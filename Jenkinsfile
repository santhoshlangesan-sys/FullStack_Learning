pipeline {
  agent any

  environment {
    NODE_ENV = 'production'
  }

  stages {
    stage('Install dependencies') {
      steps {
        bat 'npm install'
        bat 'cd client && npm install'
        bat 'cd server && npm install'
      }
    }

    stage('Build client') {
      steps {
        bat 'cd client && npm run build'
      }
    }

    stage('Build server') {
      steps {
        bat 'cd server && npm run build'
      }
    }
  }

  post {
    always {
      bat 'echo Jenkins pipeline completed'
    }
  }
}
