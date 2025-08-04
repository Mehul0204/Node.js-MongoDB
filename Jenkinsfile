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
                    
                    // Simply add the remote (will fail if already exists)
                    bat """
                        git remote add azure "%AZURE_GIT_REMOTE%"
                    """
                    
                    // Verify
                    bat 'git remote -v'
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
            echo "Pipeline execution completed"
        }
        failure {
            echo """
            DEPLOYMENT FAILED! Possible solutions:
            1. Manually clean workspace before running:
               - Remove 'azure' remote if exists
               - git remote rm azure
            2. Check Azure permissions
            3. Verify branch name ('${env.GIT_BRANCH}')
            """
        }
    }
}
