pipeline {
    agent {
        label 'windows'
    }

    environment {
        RESOURCE_GROUP = 'nodejs-mongodb-rg-tf'
        WEB_APP_NAME = 'nodejs-mongodb-app-tf-ea635ff7'
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    // Verify tools
                    bat 'git --version'
                    bat 'az --version'
                    
                    // Get current branch (works for detached HEAD too)
                    env.GIT_BRANCH = bat(
                        script: '@git rev-parse --abbrev-ref HEAD || echo "main"',
                        returnStdout: true
                    ).trim()
                    echo "Using branch: ${env.GIT_BRANCH}"
                    
                    // Get Azure remote URL
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
                }
            }
        }

        stage('Prepare Repository') {
            steps {
                script {
                    // Configure git
                    bat """
                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins"
                    """
                    
                    // Ensure we have a local branch
                    bat """
                        @echo off
                        git checkout -B ${env.GIT_BRANCH} 2>nul || (
                            echo "Creating new branch ${env.GIT_BRANCH}"
                            git checkout --orphan ${env.GIT_BRANCH}
                            git commit --allow-empty -m "Initial commit"
                        )
                    """
                    
                    // Configure remote
                    bat """
                        @echo off
                        git remote remove azure 2>nul
                        git remote add azure "%AZURE_GIT_REMOTE%"
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Ensure there's content to push
                    bat """
                        @echo off
                        if not exist * (
                            echo "No files detected - creating empty commit"
                            git commit --allow-empty -m "Initial deployment [skip ci]"
                        )
                    """
                    
                    // Push with retry logic
                    bat """
                        @echo off
                        set RETRY=0
                        :push_retry
                        git push azure %GIT_BRANCH%:master --force
                        if %ERRORLEVEL% neq 0 (
                            set /a RETRY+=1
                            if %RETRY% leq 2 (
                                echo "Push failed, retrying in 5 seconds..."
                                timeout /t 5
                                goto push_retry
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
            echo "Deployment process completed"
            bat 'git log -1 --oneline'
            bat 'git remote -v'
        }
        failure {
            echo """
            DEPLOYMENT FAILURE ANALYSIS:
            1. Branch: ${env.GIT_BRANCH} (local) → master (Azure)
            2. Remote: ${env.AZURE_GIT_REMOTE}
            3. Verify Azure permissions with: az account show
            4. Workspace contents: dir
            """
            bat 'az account show'
            bat 'dir'
        }
    }
}
