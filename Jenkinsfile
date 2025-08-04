pipeline {
    agent {
        label 'windows'
    }

    environment {
        // Azure Resource Details
        RESOURCE_GROUP = 'nodejs-mongodb-rg-tf'
        WEB_APP_NAME = 'nodejs-mongodb-app-tf-ea635ff7'

        // Git Configuration
        GIT_REPO = 'https://github.com/Mehul0204/Node.js-MongoDB.git'
        AZURE_GIT_CREDS = credentials('AZURE_GIT_CREDS') // From Jenkins credentials store
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs() // Ensures fresh start
            }
        }

        stage('Checkout Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                    extensions: [
                        [$class: 'LocalBranch', localBranch: 'master'], // Force local branch
                        [$class: 'CleanBeforeCheckout'] // Prevents detached HEAD
                    ],
                    userRemoteConfigs: [[url: env.GIT_REPO]]
                ])
                
                // Verify branch
                bat 'git branch -vv'
            }
        }

        stage('Configure Azure Remote') {
            steps {
                script {
                    // Get Azure Git URL dynamically
                    env.AZURE_GIT_URL = bat(
                        script: """
                            az webapp deployment source config-local-git ^
                            --name %WEB_APP_NAME% ^
                            --resource-group %RESOURCE_GROUP% ^
                            --query url ^
                            --output tsv
                        """,
                        returnStdout: true
                    ).trim()

                    // Configure remote with credentials
                    bat """
                        git remote add azure "%AZURE_GIT_URL%" 2>nul || git remote set-url azure "%AZURE_GIT_URL%"
                        git config --global http.postBuffer 524288000 // Fixes large repo pushes
                    """
                }
            }
        }

        stage('Deploy to Azure') {
            steps {
                retry(3) { // Automatic retry on failure
                    timeout(time: 10, unit: 'MINUTES') {
                        bat """
                            git push https://${AZURE_GIT_CREDS_USR}:${AZURE_GIT_CREDS_PSW}@${env.AZURE_GIT_URL.replace('https://', '')} master:master --force
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            // Cleanup
            bat 'git remote remove azure 2>nul || echo "No azure remote to remove"'
        }
        failure {
            echo """
            ❌ DEPLOYMENT FAILED! Check:
            1. Azure credentials (ID: AZURE_GIT_CREDS)
            2. Branch alignment (local master ↔ remote master)
            3. Network connectivity to Azure
            """
            // Debugging commands
            bat 'git remote -v'
            bat 'az account show'
        }
        success {
            echo "✅ Successfully deployed to Azure Web App!"
        }
    }
}
