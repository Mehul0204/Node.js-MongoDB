pipeline {
    agent {
        label 'windows'
    }

    environment {
        RESOURCE_GROUP = 'nodejs-mongodb-rg-tf'
        WEB_APP_NAME = 'nodejs-mongodb-app-tf-ea635ff7'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'refs/heads/master']], // Explicitly checkout master
                    extensions: [[
                        $class: 'LocalBranch',
                        localBranch: 'master' // Ensure local branch exists
                    ]],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Mehul0204/Node.js-MongoDB.git'
                    ]]
                ])
                
                // Verify branch state
                bat 'git branch -a'
                bat 'git status'
            }
        }

        stage('Configure Azure Remote') {
            steps {
                script {
                    // Get Azure remote URL
                    env.AZURE_GIT_REMOTE = bat(
                        script: """
                            az webapp deployment source config-local-git ^
                            --name %WEB_APP_NAME% ^
                            --resource-group %RESOURCE_GROUP% ^
                            --query url ^
                            --output tsv
                        """,
                        returnStdout: true
                    ).trim()
                    
                    // Add/update remote
                    bat """
                        git remote add azure "%AZURE_GIT_REMOTE%" 2>nul || git remote set-url azure "%AZURE_GIT_REMOTE%"
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                bat 'git push azure master:master --force'
            }
        }
    }
}
