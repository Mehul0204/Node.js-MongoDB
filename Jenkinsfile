pipeline {
    agent {
        label 'windows' // Uses Windows agent
    }

    environment {
        // Load credentials from Jenkins
        MONGODB_URI = credentials('mongodb-uri')
        NODEJS_HOME = "${tool 'NodeJS_18'}" // Make sure NodeJS 18+ is installed in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/Mehul0204/Node.js-MongoDB.git' // Replace with your repo
            }
        }

        stage('Install') {
            steps {
                bat '''
                    npm install
                    npm install -g nodemon
                '''
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('Deploy') {
            when {
                branch 'master' 
            }
            steps {
                bat '''
                    set PORT=8080
                    start /B nodemon ./bin/www
                '''
            }
        }
    }

    post {
        always {
            bat 'taskkill /F /IM node.exe /T' // Cleanup Node processes
        }
        success {
            slackSend color: 'good', message: "Build ${BUILD_NUMBER} succeeded"
        }
        failure {
            slackSend color: 'danger', message: "Build ${BUILD_NUMBER} failed"
        }
    }
}
