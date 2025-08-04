pipeline {
    agent {
        label 'windows'
    }

    environment {
        RESOURCE_GROUP = 'nodejs-mongodb-rg-tf'
        WEB_APP_NAME = 'nodejs-mongodb-app-tf-ea635ff7'
    }

    stages {
        stage('Prepare Environment') {
            steps {
                bat 'git --version'
                bat 'az --version'
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
                    echo "Azure Remote URL: ${env.AZURE_GIT_REMOTE}"
                }
            }
        }

        stage('Configure Git') {
            steps {
                script {
                    // Set git identity
                    bat """
                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins"
                    """
                    
                    // Get current branch name
                    env.GIT_BRANCH = bat(
                        script: '@git branch --show-current',
                        returnStdout: true
                    ).trim()
                    echo "Detected branch: ${env.GIT_BRANCH}"
                    
                    // Smart remote handling
                    bat """
                        @echo off
                        git remote add azure "%AZURE_GIT_REMOTE%" 2>nul || (
                            echo "Updating existing azure remote URL"
                            git remote set-url azure "%AZURE_GIT_REMOTE%"
                        )
                    """
                    
                    // Verify configuration
                    bat 'git remote -v'
                    bat 'git log -1'
                }
            }
        }

        stage('Deploy to Azure') {
            steps {
                script {
                    bat """
                        @echo off
                        git push azure %GIT_BRANCH%:master --force
                        if %ERRORLEVEL% neq 0 (
                            echo "Initial push failed - creating empty commit"
                            git commit --allow-empty -m "Initial deployment commit [skip ci]"
                            git push azure %GIT_BRANCH%:master --force
                        )
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Deployment pipeline completed"
            bat 'git remote -v'
            bat 'git log -1 --oneline'
        }
        failure {
            echo """
            DEPLOYMENT FAILED! Check:
            1. Branch: ${env.GIT_BRANCH} -> master
            2. Remote: ${env.AZURE_GIT_REMOTE}
            3. Azure permissions (az account show)
            4. Workspace cleanliness
            """
            bat 'az account show'
        }
    }
}
