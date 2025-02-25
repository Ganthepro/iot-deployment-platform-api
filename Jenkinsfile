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
        stage('Build & Deploy') {
            steps {
                script {
                    sh 'docker compose up -d --build'
                }
            }
        }
    }
    
    post {
        always {
            sh 'echo y | docker system prune -a'
            cleanWs(cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                notFailBuild: true,
                patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
                           [pattern: '.propsfile', type: 'EXCLUDE']])
        }
    }
}