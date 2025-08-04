pipeline {
    agent {
        label 'windows'
    }

    environment {
        RESOURCE_GROUP = 'nodejs-mongodb-rg-tf'
        WEB_APP_NAME = 'nodejs-mongodb-app-tf-ea635ff7'
        GIT_BRANCH = 'master'
    }

    stages {
        stage('Prepare Environment') {
            steps {
                script {
                    // Verify Git installation
                    bat 'git --version'
                    
                    // Clean workspace (optional)
                    bat 'git clean -fd'
                    bat 'git reset --hard'
                }
            }
        }

        stage('Get Azure Git URL') {
            steps {
                script {
                    env.AZURE_GIT_REMOTE = bat(
                        script: """
                            @echo off
                            az webapp deployment source config-local-git ^
                            --name %WEB_APP_NAME% ^
                            --resource-group %RESOURCE_GROUP% ^
                            --query url ^
                            --output tsv
                        """,
                        returnStdout: true
                    ).trim()
                    
                    echo "Azure Git Remote: ${env.AZURE_GIT_REMOTE}"
                }
            }
        }

        stage('Configure Git Remote') {
            steps {
                script {
                    // List current remotes
                    bat 'git remote -v'
                    
                    // Remove azure remote if exists (with error suppression)
                    bat """
                        @echo off
                        git remote rm azure 2>nul
                        if errorlevel 1 (
                            echo No existing azure remote found
                            exit 0
                        ) else (
                            echo Successfully removed existing azure remote
                        )
                    """
                    
                    // Add new remote
                    bat """
                        @echo off
                        git remote add azure "%AZURE_GIT_REMOTE%"
                        if errorlevel 1 (
                            echo Failed to add azure remote
                            exit 1
                        )
                        echo Successfully added azure remote
                    """
                    
                    // Verify
                    bat 'git remote -v'
                }
            }
        }

        stage('Deploy to Azure') {
            steps {
                script {
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
                                echo Push failed after 3 attempts
                                exit 1
                            )
                        )
                        echo Successfully deployed to Azure
                    """
                }
            }
        }
    }

    post {
        always {
            bat 'git remote -v'
            echo "Pipeline completed - cleaning up"
        }
        failure {
            echo """
            DEPLOYMENT FAILED! Check:
            1. Azure credentials in Jenkins
            2. Git remote URL: ${env.AZURE_GIT_REMOTE}
            3. Branch name: ${env.GIT_BRANCH}
            4. Azure CLI permissions
            """
            bat 'az account show'
        }
    }
}
