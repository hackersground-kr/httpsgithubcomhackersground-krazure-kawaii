#!/bin/bash

# Variables
read -p "리소스 그룹 이름을 입력하세요: " RESOURCE_GROUP_NAME
read -p "백엔드 웹 앱 이름을 입력하세요: " WEBAPP_NAME_BACKEND
read -p "프론트엔드 웹 앱 이름을 입력하세요: " WEBAPP_NAME_FRONTEND
read -p "위치를 입력하세요: " LOCATION
read -p "App Service 계획 이름을 입력하세요: " APP_SERVICE_PLAN
read -p "MySQL 서버 이름을 입력하세요: " MYSQL_SERVER_NAME
read -p "MySQL 사용자 이름을 입력하세요: " MYSQL_USERNAME
read -p "MySQL 암호를 입력하세요: " MYSQL_PASSWORD
read -p "Node.js 버전을 입력하세요: " NODE_VERSION
read -p "퍼블릭 액세스 시작 IP를 입력하세요: " PUBLIC_ACCESS_START_IP
read -p "퍼블릭 액세스 종료 IP를 입력하세요: " PUBLIC_ACCESS_END_IP
read -p "데이터베이스 이름을 입력하세요: " DB_NAME
read -p "GitHub 사용자 이름을 입력하세요: " GITHUB_USERNAME
read -p "GitHub 리포지토리 이름을 입력하세요: " GITHUB_REPOSITORY


# Create a resource group
az group create --name $RESOURCE_GROUP_NAME --location $LOCATION

# Create an App Service plan
az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP_NAME --location $LOCATION --sku B1 --is-linux

# Create a MySQL server
az mysql flexible-server create --resource-group $RESOURCE_GROUP_NAME --name $MYSQL_SERVER_NAME --location $LOCATION --admin-user $MYSQL_USERNAME --admin-password $MYSQL_PASSWORD --sku-name "Standard_B1s" --tier "Burstable" --public-access $PUBLIC_ACCESS_START_IP-$PUBLIC_ACCESS_END_IP
az mysql flexible-server db create --resource-group $RESOURCE_GROUP_NAME --server-name $MYSQL_SERVER_NAME --database-name $DB_NAME

# Create a Node.js web app
az webapp create --name $WEBAPP_NAME_BACKEND --plan $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP_NAME --runtime "$NODE_RUNTIME"
az webapp create --name $WEBAPP_NAME_FRONTEND --plan $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP_NAME --runtime "$NODE_RUNTIME"

# Configure the Node.js version
az webapp config appsettings set --name $WEBAPP_NAME_BACKEND --resource-group $RESOURCE_GROUP_NAME --settings WEBSITE_NODE_DEFAULT_VERSION=$NODE_VERSION
az webapp config appsettings set --name $WEBAPP_NAME_FRONTEND --resource-group $RESOURCE_GROUP_NAME --settings WEBSITE_NODE_DEFAULT_VERSION=$NODE_VERSION

az webapp config set --name $WEBAPP_NAME_BACKEND --resource-group $RESOURCE_GROUP_NAME --startup-file "node ./backend/."  # 웹 앱의 시작 명령을 "python main.py"로 설정
az webapp config set --name $WEBAPP_NAME_FRONTEND --resource-group $RESOURCE_GROUP_NAME --startup-file "cd ./frontend && npm run dev"  # 웹 앱의 시작 명령을 "npm start"로 설정

MYSQL_DNS=$(az mysql server show --resource-group "$RESOURCE_GROUP_NAME" --name "$MYSQL_SERVER_NAME" --query fullyQualifiedDomainName -o tsv)

az webapp deployment list-publishing-profiles --name $WEBAPP_NAME_BACKEND --resource-group $RESOURCE_GROUP_NAME --xml > back_publish_profile.xml
az webapp deployment list-publishing-profiles --name $WEBAPP_NAME_FRONTEND --resource-group $RESOURCE_GROUP_NAME --xml > front_publish_profile.xml

gh secret set BACKEND_APP_NAME --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY --body $WEBAPP_NAME_BACKEND
gh secret set FRONTEND_APP_NAME --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY --body $WEBAPP_NAME_FRONTEND
gh secret set MYSQL_DNS --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY --body $MYSQL_DNS

cat ./back_publish_profile.xml | gh secret set BACKEND_WEBAPP_PUBLISH_PROFILE --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY
cat ./front_publish_profile.xml | gh secret set FRONTEND_WEBAPP_PUBLISH_PROFILE --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY

gh auth login

gh workflow run "Backend Deploy" --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY
gh workflow run "Front Deploy" --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY
