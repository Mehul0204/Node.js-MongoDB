pipeline {
    agent {
        label 'windows'
    }

    environment {
        RESOURCE_GROUP = 'nodejs-mongodb-rg-tf'
        WEB_APP_NAME = 'nodejs-mongodb-app-tf-ea635ff7'
        GIT_BRANCH = 'master' // Using 'master' based on your logs
    }

    stages {
        stage('Get Azure Git URL') {
            steps {
                script {
                    // Get Azure deployment git URL
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

        stage('Configure Git') {
            steps {
                script {
                    // Set git identity (required for push)
                    bat """
                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins"
                    """
                    
                    // Add Azure remote (without checking if it exists)
                    bat """
                        git remote add azure "%AZURE_GIT_REMOTE%"
                    """
                    
                    // Verify remotes
                    bat "git remote -v"
                }
            }
        }

        stage('Deploy to Azure') {
            steps {
                script {
                    // Force push to Azure
                    bat """
                        git push azure %GIT_BRANCH%:master --force
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Deployment process completed"
            bat "git remote -v" // Final verification
        }
        failure {
            echo """
            DEPLOYMENT FAILED! Possible issues:
            1. Azure remote already exists (try cleaning workspace)
            2. Incorrect permissions
            3. Branch mismatch (trying to push ${env.GIT_BRANCH} to master)
            """
        }
    }
}
