pipeline {
    agent any

    stages {
        stage('Parando servicios SGU...') {
            steps {
                bat 'docker compose -p sgu-project down || exit /b 0'
            }
        }

        stage('Limpiando imágenes SGU...') {
            steps {
                bat '''
                    for /f "tokens=*" %%i in ('docker images --filter "label=com.docker.compose.project=sgu-project" -q') do (
                        docker rmi -f %%i
                    )
                '''
            }
        }

        stage('Obteniendo código...') {
            steps {
                checkout scm
            }
        }

        stage('Desplegando SGU...') {
            steps {
                bat 'docker compose -p sgu-project up --build -d'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline SGU finalizado'
        }
    }
}