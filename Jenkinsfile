pipeline {
    agent {
        label 'windows'
    }

    environment {
        RESOURCE_GROUP = 'nodejs-mongodb-rg-tf'
        WEB_APP_NAME = 'nodejs-mongodb-app-tf-ea635ff7'
        GIT_BRANCH = 'master' // Change to 'master' if needed
    }

    stages {
        stage('Prepare Git Deployment') {
            steps {
                script {
                    // First ensure we're in the workspace directory
                    bat 'cd /d "%WORKSPACE%"'
                    
                    // Get the Azure Git remote URL properly
                    env.AZURE_GIT_REMOTE = bat(
                        script: """
                            @echo off
                            for /f "delims=" %%a in (
                                'az webapp deployment source config-local-git ^
                                --name %WEB_APP_NAME% ^
                                --resource-group %RESOURCE_GROUP% ^
                                --query url ^
                                --output tsv'
                            ) do set AZURE_REMOTE=%%a
                            echo %AZURE_REMOTE%
                        """,
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Configure Git') {
            steps {
                script {
                    // Configure git identity
                    bat """
                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins"
                    """
                    
                    // Add Azure remote (with proper escaping)
                    bat """
                        @echo off
                        git remote add azure "%AZURE_GIT_REMOTE%"
                    """
                }
            }
        }

        stage('Deploy via Git') {
            steps {
                script {
                    // Push to Azure with proper branch mapping
                    bat """
                        @echo off
                        git push azure %GIT_BRANCH%:master --force
                    """
                }
            }
        }
    }

    post {
        failure {
            echo "Deployment failed. Check your:"
            echo "1. Branch name ('${env.GIT_BRANCH}')"
            echo "2. Azure remote URL ('${env.AZURE_GIT_REMOTE}')"
            echo "3. Git credentials in Azure"
        }
    }
}
