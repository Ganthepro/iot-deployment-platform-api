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
                    sh 'docker run -e DOTENV_KEY=$DOTENV_KEY -p 3000:3000 -d $JOB_NAME:latest'
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