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
                    echo "Azure Remote: ${env.AZURE_GIT_REMOTE}"
                }
            }
        }

        stage('Configure Git') {
            steps {
                script {
                    // 1. Set git identity
                    bat """
                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins"
                    """
                    
                    // 2. DEBUG: Show current remotes
                    bat 'git remote -v'
                    
                    // 3. SAFELY add remote (won't fail if exists)
                    bat """
                        @echo off
                        git remote add azure "%AZURE_GIT_REMOTE%" 2>nul || (
                            echo "Updating existing azure remote URL"
                            git remote set-url azure "%AZURE_GIT_REMOTE%"
                        )
                    """
                    
                    // 4. Verify
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
        failure {
            echo """
            DEPLOYMENT FAILED! Check:
            1. Azure credentials in Jenkins
            2. Git remote: ${env.AZURE_GIT_REMOTE}
            3. Branch: ${env.GIT_BRANCH} -> master
            4. Workspace permissions
            """
            bat 'az account show'
        }
    }
}
