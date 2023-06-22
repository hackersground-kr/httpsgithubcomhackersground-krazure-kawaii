#!/bin/bash

# Variables
$RESOURCE_GROUP_NAME = "rg-hg-httpsgithubcomhackersground-krazure-kawaii"
$WEBAPP_NAME_BACKEND = "pyl-webapp-backend-prod"
$WEBAPP_NAME_FRONTEND = "pyl-webapp-frontend-pord"
$LOCATION = "koreacentral"
$APP_SERVICE_PLAN = "pyl-plan"
$MYSQL_SERVER_NAME = "pyl-database-prod"
$MYSQL_USERNAME = "pyl"
$MYSQL_PASSWORD = "Password1234"
$NODE_VERSION = "16"
$NODE_RUNTIME = "node|16-lts"
$PUBLIC_ACCESS_START_IP="0.0.0.0"
$PUBLIC_ACCESS_END_IP="255.255.255.255"
$DB_NAME="pyl"


$GITHUB_USERNAME="hackersground-kr"
$GITHUB_REPOSITORY="httpsgithubcomhackersground-krazure-kawaii"


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

az webapp config set --name $WEBAPP_NAME_BACKEND --resource-group $RESOURCE_GROUP_NAME --startup-file "./index.js"  # 웹 앱의 시작 명령을 "python main.py"로 설정
az webapp config set --name $WEBAPP_NAME_FRONTEND --resource-group $RESOURCE_GROUP_NAME --startup-file "cd ./frontend && npm run dev"  # 웹 앱의 시작 명령을 "npm start"로 설정

az webapp deployment list-publishing-profiles --name $WEBAPP_NAME_BACKEND --resource-group $RESOURCE_GROUP_NAME --xml > back_publish_profile.xml
az webapp deployment list-publishing-profiles --name $WEBAPP_NAME_FRONTEND --resource-group $RESOURCE_GROUP_NAME --xml > front_publish_profile.xml

gh secret set BACKEND_APP_NAME --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY --body $WEBAPP_NAME_BACKEND
gh secret set FRONTEND_APP_NAME --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY --body $WEBAPP_NAME_FRONTEND

cat ./back_publish_profile.xml | gh secret set BACKEND_WEBAPP_PUBLISH_PROFILE --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY
cat ./front_publish_profile.xml | gh secret set FRONTEND_WEBAPP_PUBLISH_PROFILE --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY

gh auth login

gh workflow run "Backend Deploy" --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY
gh workflow run "Front Deploy" --repo $GITHUB_USERNAME/$GITHUB_REPOSITORY
