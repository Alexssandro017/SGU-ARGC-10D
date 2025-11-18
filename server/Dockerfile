# 1. CORREGIDO: Cambiamos de JDK 21 a JDK 17 (LTS) para evitar el error de módulos
FROM maven:3.9-eclipse-temurin-17

#Establecer directorio trabajo
WORKDIR /app

#Copia todos los archivos del proyecto en el directorio de trabajo
COPY . . 

#Ejecutar
#   1.- Limpiar y compilar el JAR del backend
#   2.- Copiar el resultane al directorio de trabajo
#       Dskiptest es para que no trate de ejecutar las clases
RUN mvn clean package -DskipTests && cp target/*.jar app.jar

#Exponer el puerto interno
EXPOSE 8080

#Servir el JAR
ENTRYPOINT ["java","-jar","app.jar"]