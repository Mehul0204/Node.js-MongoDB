pipeline {
    agent {
        label 'windows'
    }

    environment {
        RESOURCE_GROUP = 'nodejs-mongodb-rg-tf'
        WEB_APP_NAME = 'nodejs-mongodb-app-tf-ea635ff7'
        GIT_BRANCH = 'master' // Change to 'master' if that's your branch name
    }

    stages {
        stage('Prepare Git Deployment') {
            steps {
                script {
                    // Get the Azure Git remote URL
                    def gitRemoteUrl = bat(
                        script: "az webapp deployment source config-local-git --name %WEB_APP_NAME% --resource-group %RESOURCE_GROUP% --query url --output tsv",
                        returnStdout: true
                    ).trim()
                    
                    // Store the URL for later use
                    env.AZURE_GIT_REMOTE = gitRemoteUrl
                }
            }
        }

        stage('Deploy via Git') {
            steps {
                script {
                    // Configure git identity (required for Jenkins)
                    bat """
                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins"
                    """
                    
                    // Add Azure remote (properly formatted command)
                    bat "git remote add azure %AZURE_GIT_REMOTE%"
                    
                    // Push to Azure (using the correct branch name)
                    bat """
                        git push azure %GIT_BRANCH%:master --force
                    """
                }
            }
        }
    }
}
