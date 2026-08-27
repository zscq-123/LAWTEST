# 后端多阶段构建：Maven 打包 → JRE 运行
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# 先复制 pom 并预下载依赖，利用 Docker 层缓存
COPY backend/pom.xml .
RUN mvn -q dependency:go-offline

COPY backend/src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /build/target/lawtest-backend.jar app.jar

EXPOSE 8080
ENV TZ=Asia/Shanghai
ENTRYPOINT ["java", "-jar", "app.jar"]
