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
                    bat """
                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins"
                    """
                    
                    // This is the critical change - handle remote add differently
                    bat """
                        @echo off
                        git remote add azure "%AZURE_GIT_REMOTE%" 2>nul || (
                            echo "Remote already exists, updating URL"
                            git remote set-url azure "%AZURE_GIT_REMOTE%"
                        )
                    """
                    
                    bat 'git remote -v'
                }
            }
        }

        stage('Deploy to Azure') {
            steps {
                bat """
                    git push azure %GIT_BRANCH%:master --force
                """
            }
        }
    }

    post {
        always {
            echo "Pipeline execution completed"
            bat 'git remote -v'
        }
        failure {
            echo """
            DEPLOYMENT FAILED! Check:
            1. Azure credentials in Jenkins
            2. Git remote URL: ${env.AZURE_GIT_REMOTE}
            3. Branch name: ${env.GIT_BRANCH}
            4. Workspace permissions
            """
        }
    }
}
