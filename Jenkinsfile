pipeline {
  environment {
		registry = "agiletechvietnam/estoryc-admin"
		registryCredential = 'dockerhub'
    dockerImage = ''

    serverUser = 'jenkins'
    serverIp = '35.247.171.153'
    uatServerIp = '34.67.72.96'
    deployPath = '/opt/estoryc/admin'

    projectKey = 'eStoryc-frontend'
    sonarHost = 'https://sonar.agiletech.vn'
    sonarLogin = 'f9d86cbe066de725023b2a1e777e39cb8ec87ccc'

    ESTORY_API_URL = 'http://35.247.171.153:8080'
	}

  agent any

  stages {
    stage('Build') {
        when {
        anyOf {
          branch 'master'
          branch 'develop'
          branch 'uat'
        }
      }
      steps {
        script {
          if (env.BRANCH_NAME == 'uat') {
            ESTORY_API_URL = 'https://api-p7.agiletech.vn'
          }
          mattermostSend(color: 'good', icon: 'https://jenkins.io/images/logos/jenkins/jenkins.png', message: "Start to build W7 web admin branch: $BRANCH_NAME", channel: 'jenkins')
          dockerImage = docker.build(registry + ":$BRANCH_NAME.$BUILD_NUMBER", "--build-arg APP_BUILD_ID=${env.BUILD_NUMBER} --build-arg API_URL=${ESTORY_API_URL} -f Dockerfile .")
        }
      }
    }
    stage('Push image') {
      when {
        anyOf {
          branch 'master'
          branch 'develop'
          branch 'uat'
        }
      }
      steps {
        script {
          docker.withRegistry( '', registryCredential ) {
            dockerImage.push()
          }
        }
      }
    }
    stage('Deploy') {
      when {
        anyOf {
          branch 'master'
          branch 'develop'
        }
      }
      steps {
        script {
          withCredentials([sshUserPrivateKey(credentialsId: "estoryc-jenkins", keyFileVariable: 'keyfile'),
            usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'dockerUser', passwordVariable: 'dockerPass')]) {

            sh "scp -o StrictHostKeyChecking=no -i ${keyfile} -r -v docker/* ${serverUser}@${serverIp}:${deployPath}"
            sh "scp -o StrictHostKeyChecking=no -i ${keyfile} -r -v docker/.env ${serverUser}@${serverIp}:${deployPath}"
            sh "ssh -o StrictHostKeyChecking=no -i ${keyfile} ${serverUser}@${serverIp} \"cd ${deployPath} && sudo docker-compose down\""
            sh "ssh -o StrictHostKeyChecking=no -i ${keyfile} ${serverUser}@${serverIp} \"sudo docker login -u ${dockerUser} -p ${dockerPass}\""
            sh "ssh -o StrictHostKeyChecking=no -i ${keyfile} ${serverUser}@${serverIp} \"cd ${deployPath} && sudo sed -i 's/agiletechvietnam\\/estoryc-admin:latest/agiletechvietnam\\/estoryc-admin:$BRANCH_NAME.$BUILD_NUMBER/g' .env\""
            sh "ssh -o StrictHostKeyChecking=no -i ${keyfile} ${serverUser}@${serverIp} \"cd ${deployPath} && sudo docker-compose build --pull && sudo docker-compose up -d\""

          }
        }
      }
    }
    stage('Deploy UAT') {
      when {
        anyOf {
          branch 'uat'
        }
      }
      steps {
        script {
          withCredentials([sshUserPrivateKey(credentialsId: "estoryc-jenkins", keyFileVariable: 'keyfile'),
            usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'dockerUser', passwordVariable: 'dockerPass')]) {

            sh "scp -o StrictHostKeyChecking=no -i ${keyfile} -r -v docker/* ${serverUser}@${uatServerIp}:${deployPath}"
            sh "scp -o StrictHostKeyChecking=no -i ${keyfile} -r -v docker/.env ${serverUser}@${uatServerIp}:${deployPath}"
            sh "ssh -o StrictHostKeyChecking=no -i ${keyfile} ${serverUser}@${uatServerIp} \"cd ${deployPath} && sudo docker-compose down\""
            sh "ssh -o StrictHostKeyChecking=no -i ${keyfile} ${serverUser}@${uatServerIp} \"sudo docker login -u ${dockerUser} -p ${dockerPass}\""
            sh "ssh -o StrictHostKeyChecking=no -i ${keyfile} ${serverUser}@${uatServerIp} \"cd ${deployPath} && sudo sed -i 's/agiletechvietnam\\/estoryc-admin:latest/agiletechvietnam\\/estoryc-admin:$BRANCH_NAME.$BUILD_NUMBER/g' .env\""
            sh "ssh -o StrictHostKeyChecking=no -i ${keyfile} ${serverUser}@${uatServerIp} \"cd ${deployPath} && sudo docker-compose build --pull && sudo docker-compose up -d\""

          }
        }
      }
    }
    stage('Sonar checking') {
      when {
        branch 'develop'
      }
      steps {
        script {
          withDockerContainer("agiletechvietnam/sonar-scanner-typescript:latest") {
            sh "sonar-scanner -Dsonar.projectKey=${projectKey} -Dsonar.sources=. -Dsonar.host.url=${sonarHost} -Dsonar.login=${sonarLogin} -Dsonar.exclusions=public/**"
          }
        }
      }
    }
  }
  post {
    success {
      mattermostSend(color: 'good', icon: 'https://jenkins.io/images/logos/jenkins/jenkins.png', message: "Build web admin branch: $BRANCH_NAME succeed", channel: 'jenkins')
    }
    failure {
      mattermostSend(color: 'danger', icon: 'https://jenkins.io/images/logos/jenkins/jenkins.png', message: "Build web admin branch: $BRANCH_NAME failed", channel: 'jenkins')
    }
    aborted {
      mattermostSend(color: 'danger', icon: 'https://jenkins.io/images/logos/jenkins/jenkins.png', message: "Build web admin branch: $BRANCH_NAME aborted", channel: 'jenkins')
    }
    fixed {
      mattermostSend(color: 'good', icon: 'https://jenkins.io/images/logos/jenkins/jenkins.png', message: "Build web admin branch: $BRANCH_NAME fixed", channel: 'jenkins')
    }
  }
}
