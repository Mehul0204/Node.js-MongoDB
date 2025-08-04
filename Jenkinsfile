pipeline {
    agent {
        label 'windows'
    }
    
    environment {
        REPO_URL = 'https://github.com/Mehul0204/Node.js-MongoDB.git'
        AZURE_URL = 'https://nodejs-mongodb-app-tf-ea635ff7.scm.azurewebsites.net/nodejs-mongodb-app-tf-ea635ff7.git' // Removed username
        AZURE_CREDS = credentials('AZURE_GIT_CREDS') // Jenkins credential ID
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        
        stage('Fresh Clone') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                    extensions: [
                        [$class: 'LocalBranch', localBranch: 'master'],
                        [$class: 'CleanBeforeCheckout']
                    ],
                    userRemoteConfigs: [[url: env.REPO_URL]]
                ])
            }
        }

        stage('Configure Azure') {
            steps {
                bat """
                    git remote add azure "https://${AZURE_CREDS_USR}:${AZURE_CREDS_PSW}@${env.AZURE_URL.replace('https://', '')}" 2>nul || git remote set-url azure "https://${AZURE_CREDS_USR}:${AZURE_CREDS_PSW}@${env.AZURE_URL.replace('https://', '')}"
                    git remote -v
                """
            }
        }

        stage('Deploy') {
            steps {
                bat """
                    git push azure master:master --force
                """
            }
        }
    }
}
