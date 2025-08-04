pipeline {
    agent any

    environment {
        RESOURCE_GROUP = 'nodejs-mongodb-rg-tf'
        WEB_APP_NAME = 'nodejs-mongodb-app-tf-ea635ff7'
    }

    stages {
        stage('Deploy via Local Git') {
            steps {
                script {
                    // Set up deployment credentials if not already done
                    bat """
                        az webapp deployment user set ^
                        --user-name "azureuser" ^
                        --password "YourSecurePassword123!"
                    """

                    // Configure local git deployment
                    bat """
                        az webapp deployment source config-local-git ^
                        --name %WEB_APP_NAME% ^
                        --resource-group %RESOURCE_GROUP% ^
                        --query url ^
                        --output tsv
                    """

                    // Get the git remote URL
                    def gitRemoteUrl = bat(
                        script: "az webapp deployment source config-local-git --name %WEB_APP_NAME% --resource-group %RESOURCE_GROUP% --query url --output tsv",
                        returnStdout: true
                    ).trim()

                    // Push to Azure (would typically be in a different pipeline)
                    bat """
                        git remote add azure %gitRemoteUrl%
                        git push azure master
                    """
                }
            }
        }
    }
}
