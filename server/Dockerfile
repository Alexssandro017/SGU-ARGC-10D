#Servir imagen de backend con maven
FROM maven:3.9.9-eclipse-temurin-21

#Establecer directorio trabajo
WORKDIR /app

#Copia todos los archivos del proyecto en el directorio de trabajo
COPY . . 

#Ejecutar
#   1.- Limpiar y compilar el JAR del backend
#   2.- Copiar el resultane al directorio de trabajo
#       Dskiptest es para que no trate de ejecutar las clases
# 2. CORREGIDO: Lo copiamos a 'app.jar' (con extensión)
RUN mvn clean package -DskipTests && cp target/*.jar app.jar

# 1. CORREGIDO: Exponer el puerto interno 8080
EXPOSE 8080

#Servir el JAR
# 2. CORREGIDO: Ejecutamos 'app.jar' (con extensión)
ENTRYPOINT ["java","-jar","app.jar"]