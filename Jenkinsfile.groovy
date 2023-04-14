pipeline {
    agent {
        kubernetes {
            label 'dms-ui-executor'
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:lts
    tty: true
  - name: docker
    image: docker:18-git
    tty: true
    env:
    - name: DOCKER_HOST
      value: tcp://localhost:2375
    - name: HOME
      value: /home/jenkins/agent
  - name: helm
    image: alpine/helm:3.1.0
    command:
    - cat
    tty: true
  - name: dind-daemon
    image: docker:18.06-dind
    securityContext:
      privileged: true
      runAsUser: 0
    volumeMounts:
    - name: docker-graph-storage
      mountPath: /var/lib/docker
  securityContext:
    runAsUser: 1000
  volumes:
  - name: docker-graph-storage
    emptyDir: {}
"""
        }
    }


    environment {
        gitHubRegistry = 'ghcr.io'
        gitHubRepo = 'overture-stack/dms-ui'
        gitHubImageName = "${gitHubRegistry}/${gitHubRepo}"
        dockerHubImageName = 'overture/dms-ui'
        DEPLOY_TO_DEV = false
        PUBLISH_IMAGE = false

        commit = sh(
            returnStdout: true,
            script: 'git describe --always'
        ).trim()

        version = sh(
            returnStdout: true,
            script:
                'cat ./package.json | ' +
                'grep "version" | ' +
                'cut -d : -f2 | ' +
                "sed \'s:[\",]::g\'"
        ).trim()
        slackNotificationsUrl = credentials('OvertureSlackJenkinsWebhookURL')

    }

    parameters {
        booleanParam(
            name: 'DEPLOY_TO_DEV',
            defaultValue: "${env.DEPLOY_TO_DEV}",
            description: 'Deploys your branch to argo-dev'
        )
        booleanParam(
            name: 'PUBLISH_IMAGE',
            defaultValue: "${env.PUBLISH_IMAGE ?: params.DEPLOY_TO_DEV}",
            description: 'Publishes an image with {git commit} tag'
        )
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('Test') {
            steps {
                container('node') {
                    sh "npm ci"
                    sh "npm run test"
                }
            }
        }

        stage('Build image') {
            steps {
                container('docker') {
                    sh "docker build --network=host -f Dockerfile . -t ${gitHubImageName}:${commit}"
                }
            }
        }

        stage('Publish images') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'main'
                    expression { return params.PUBLISH_IMAGE }
                }
            }
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId:'OvertureBioGithub',
                        passwordVariable: 'PASSWORD',
                        usernameVariable: 'USERNAME'
                    )]) {
                        sh "docker login ${gitHubRegistry} -u $USERNAME -p $PASSWORD"

                        script {
                            if (env.BRANCH_NAME ==~ 'main') { //push edge and commit tags
                                sh "docker tag ${gitHubImageName}:${commit} ${gitHubImageName}:${version}"
                                sh "docker push ${gitHubImageName}:${version}"

                                sh "docker tag ${gitHubImageName}:${commit} ${gitHubImageName}:latest"
                                sh "docker push ${gitHubImageName}:latest"
                            } else { // push commit tag
                                sh "docker tag ${gitHubImageName}:${commit} ${gitHubImageName}:${version}-${commit}"
                                sh "docker push ${gitHubImageName}:${version}-${commit}"
                            }

                            if (env.BRANCH_NAME ==~ 'develop') { // push edge tag
                                sh "docker tag ${gitHubImageName}:${commit} ${gitHubImageName}:edge"
                                sh "docker push ${gitHubImageName}:edge"
                            }
                        }
                    }
                }
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId:'OvertureDockerHub',
                        passwordVariable: 'PASSWORD',
                        usernameVariable: 'USERNAME'
                    )]) {
                        sh "docker login -u $USERNAME -p $PASSWORD"

                        script {
                            if (env.BRANCH_NAME ==~ 'main') { //push edge and commit tags
                                sh "docker tag ${gitHubImageName}:${commit} ${dockerHubImageName}:${version}"
                                sh "docker push ${dockerHubImageName}:${version}"

                                sh "docker tag ${gitHubImageName}:${commit} ${dockerHubImageName}:latest"
                                sh "docker push ${dockerHubImageName}:latest"
                            } else { // push commit tag
                                sh "docker tag ${gitHubImageName}:${commit} ${dockerHubImageName}:${version}-${commit}"
                                sh "docker push ${dockerHubImageName}:${version}-${commit}"
                            }

                            if (env.BRANCH_NAME ==~ 'develop') { // push edge tag
                                sh "docker tag ${gitHubImageName}:${commit} ${dockerHubImageName}:edge"
                                sh "docker push ${dockerHubImageName}:edge"
                            }
                        }
                    }
                }
            }
        }

        stage('Publish tag to github') {
            when {
                branch 'main'
            }
            steps {
                container('node') {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'OvertureBioGithub',
                            passwordVariable: 'GIT_PASSWORD',
                            usernameVariable: 'GIT_USERNAME'
                        ),
                    ]) {
                        script {
                            // we still want to run the platform deploy even if this fails, hence try-catch
                            try {
                                sh "git tag ${version}"
                                sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/${gitHubRepo} --tags"
                                sh "curl \
                                -X POST \
                                -H 'Content-type: application/json' \
                                    --data '{ \
                                        \"text\":\"New ${gitHubRepo} published succesfully: v.${version}\
                                        \n[Build ${env.BUILD_NUMBER}] (${env.BUILD_URL})\" \
                                    }' \
                                ${slackNotificationsUrl}"
                            } catch (err) {
                                echo 'There was an error while publishing packages'
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy to overture-qa') {
            when {
                anyOf {
                    branch 'develop'
                    expression { return params.DEPLOY_TO_DEV }
                }
            }
            steps {
                build(job: "/Overture.bio/provision/helm", parameters: [
                    [$class: 'StringParameterValue', name: 'OVERTURE_ENV', value: 'qa' ],
                    [$class: 'StringParameterValue', name: 'OVERTURE_CHART_NAME', value: 'dms-ui'],
                    [$class: 'StringParameterValue', name: 'OVERTURE_RELEASE_NAME', value: 'dms-ui'],
                    [$class: 'StringParameterValue', name: 'OVERTURE_HELM_CHART_VERSION', value: ''], // use latest
                    [$class: 'StringParameterValue', name: 'OVERTURE_HELM_REPO_URL', value: "https://overture-stack.github.io/charts-server/"],
                    [$class: 'StringParameterValue', name: 'OVERTURE_HELM_REUSE_VALUES', value: "false" ],
                    [$class: 'StringParameterValue', name: 'OVERTURE_ARGS_LINE', value: "--set-string image.tag=${version}-${commit}"]
                ])
            }
        }

        stage('Deploy to overture-staging') {
            when {
                anyOf {
                    branch 'main'
                }
            }
            steps {
                build(job: "/Overture.bio/provision/helm", parameters: [
                    [$class: 'StringParameterValue', name: 'OVERTURE_ENV', value: 'staging' ],
                    [$class: 'StringParameterValue', name: 'OVERTURE_CHART_NAME', value: 'dms-ui'],
                    [$class: 'StringParameterValue', name: 'OVERTURE_RELEASE_NAME', value: 'dms-ui'],
                    [$class: 'StringParameterValue', name: 'OVERTURE_HELM_CHART_VERSION', value: ''], // use latest
                    [$class: 'StringParameterValue', name: 'OVERTURE_HELM_REPO_URL', value: "https://overture-stack.github.io/charts-server/"],
                    [$class: 'StringParameterValue', name: 'OVERTURE_HELM_REUSE_VALUES', value: "false" ],
                    [$class: 'StringParameterValue', name: 'OVERTURE_ARGS_LINE', value: "--set-string image.tag=${version}"]
                ])
            }
        }
  }

   post {
        fixed {
            script {
                if (env.BRANCH_NAME ==~ /(develop|main|test\S*)/) {
                    sh "curl \
                        -X POST \
                        -H 'Content-type: application/json' \
                        --data '{ \
                            \"text\":\"Build Fixed: ${env.JOB_NAME}#${commit} \
                            \n[Build ${env.BUILD_NUMBER}] (${env.BUILD_URL})\" \
                        }' \
                        ${slackNotificationsUrl}"
                }
            }
        }

        success {
            script {
                if (env.BRANCH_NAME ==~ /(test\S*)/) {
                    sh "curl \
                        -X POST \
                        -H 'Content-type: application/json' \
                        --data '{ \
                            \"text\":\"Build tested: ${env.JOB_NAME}#${commit} \
                            \n[Build ${env.BUILD_NUMBER}] (${env.BUILD_URL})\" \
                        }' \
                        ${slackNotificationsUrl}"
                }
            }
        }

        unsuccessful {
            script {
                if (env.BRANCH_NAME ==~ /(develop|main|test\S*)/) {
                    sh "curl \
                        -X POST \
                        -H 'Content-type: application/json' \
                        --data '{ \
                            \"text\":\"Build Failed: ${env.JOB_NAME}#${commit} \
                            \n[Build ${env.BUILD_NUMBER}] (${env.BUILD_URL})\" \
                        }' \
                        ${slackNotificationsUrl}"
                }
            }
        }
    }
}
