pipeline {
    // 1. CORRECCIÓN #1: Forzar el agente 'master' (Windows)
    //    Esto soluciona el error 'bat: command not found'
    agent any

    stages {
        // 2. CORRECCIÓN #2: Usar el nombre de proyecto VÁLIDO 'sgu-project'
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
                // 3. CORRECCIÓN #3: Quitar el comentario '//' que rompe 'bat'
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