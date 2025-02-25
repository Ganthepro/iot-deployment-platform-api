pipeline {
    agent {
        node {
            label 'iot-platform'
        }
    }

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        DOTENV_KEY = credentials('iot-platform-dotenv-key')
        AZURE_CLIENT_ID = credentials('AZURE_CLIENT_ID')
        AZURE_TENANT_ID = credentials('AZURE_TENANT_ID')
        AZURE_CLIENT_SECRET = credentials('AZURE_CLIENT_SECRET')
    }

    stages {
        stage('Build') {
            steps {
                script {
                    sh 'docker build --no-cache -t $JOB_NAME:latest .'
                }
            }
        }

        stage('Deployment') {
            steps {
                script {
                    sh 'docker run -e DOTENV_KEY=$DOTENV_KEY -e AZURE_CLIENT_ID=$AZURE_CLIENT_ID -e AZURE_TENANT_ID=$AZURE_TENANT_ID -e AZURE_CLIENT_SECRET=$AZURE_CLIENT_SECRET -p 3000:3000 -d --name $JOB_NAME $JOB_NAME:latest'
                }
            }
        }
    }
    
    post {
        always {
            cleanWs(cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                notFailBuild: true,
                patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
                           [pattern: '.propsfile', type: 'EXCLUDE']])
        }
    }
}