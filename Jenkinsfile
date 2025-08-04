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
                    // Get Azure Git remote URL
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

        stage('Configure Git Remote') {
            steps {
                script {
                    // Remove existing remote if it exists
                    bat """
                        @echo off
                        git remote remove azure 2>nul || echo "No existing azure remote to remove"
                        git remote remove azure 2>nul || echo "No existing azure remote to remove"
                    """
                    
                    // Add the Azure remote
                    bat """
                        @echo off
                        git remote add azure "%AZURE_GIT_REMOTE%"
                    """
                    
                    // Configure git identity
                    bat """
                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins"
                    """
                }
            }
        }

        stage('Deploy via Git') {
            steps {
                script {
                    // Push to Azure with retry logic
                    bat """
                        @echo off
                        set RETRY_COUNT=0
                        :retry
                        git push azure %GIT_BRANCH%:master --force
                        if %ERRORLEVEL% neq 0 (
                            set /a RETRY_COUNT+=1
                            if %RETRY_COUNT% leq 2 (
                                echo Push failed, retrying in 10 seconds...
                                timeout /t 10
                                goto retry
                            ) else (
                                exit 1
                            )
                        )
                    """
                }
            }
        }
    }

    post {
        always {
            // Clean up (optional)
            bat """
                @echo off
                git remote remove azure 2>nul || echo "Cleanup complete"
            """
        }
        
        failure {
            echo """
            Deployment failed. Please check:
            1. Your branch name ('${env.GIT_BRANCH}')
            2. Azure deployment credentials
            3. Git remote URL ('${env.AZURE_GIT_REMOTE}')
            """
        }
    }
}
