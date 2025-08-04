pipeline {
    agent {
        label 'windows'
    }
    
    environment {
        REPO_URL = 'https://github.com/Mehul0204/Node.js-MongoDB.git'
        AZURE_URL = 'https://Mehul24@nodejs-mongodb-app-tf-ea635ff7.scm.azurewebsites.net/nodejs-mongodb-app-tf-ea635ff7.git'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()  // Jenkins built-in workspace cleaner
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
                    git remote add azure "%AZURE_URL%" 2>nul || git remote set-url azure "%AZURE_URL%"
                    git remote -v
                """
            }
        }

        stage('Deploy') {
            steps {
                bat 'git push azure master:master --force'
            }
        }
    }
}
