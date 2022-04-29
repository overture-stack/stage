String podSpec = '''
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
'''

pipeline {
  agent {
    kubernetes {
      yaml podSpec
    }
  }

  environment {
    gitHubRegistry = 'ghcr.io'
    gitHubRepo = 'overture-stack/dms-ui'
    githubImageName = "${gitHubRegistry}/${gitHubRepo}"

    commit = sh(
      returnStdout: true,
      script: 'git describe --always'
    ).trim()

    version = sh(
      returnStdout: true,
      script: 'cat ./package.json | ' +
        'grep "version" | ' +
        'cut -d : -f2 | ' +
        "sed \'s:[\",]::g\'"
    ).trim()
  }

  options {
    timeout(time: 30, unit: 'MINUTES')
    timestamps()
  }

  stages {
    stage('Run tests') {
      steps {
        container('node') {
          sh 'npm ci'
          sh 'npm run test'
        }
      }
    }

    stage('Build images') {
      steps {
        container('docker') {
          // DNS error if --network is default
          sh "docker build \
            --build-arg APP_COMMIT=${commit} \
            --build-arg APP_VERSION=${version} \
            --network=host \
            -f Dockerfile \
            -t dms-ui:${commit} ."
        }
      }
    }

    stage('Publish Images') {
      when {
        anyOf {
          branch 'develop'
          branch 'main'
          branch 'master'
          branch 'arranger-rewrite'
        }
      }
      steps {
        container('docker') {
          withCredentials([
            usernamePassword(
              credentialsId:'OvertureBioGithub',
              passwordVariable: 'PASSWORD',
              usernameVariable: 'USERNAME',
            )
          ]) {
            sh "docker login ${gitHubRegistry} -u $USERNAME -p $PASSWORD"

            script {
              if (env.BRANCH_NAME ==~ /(main)/) { // push latest and version tags
                sh "docker tag dms-ui:${commit} ${githubImageName}:${version}"
                sh "docker push ${githubImageName}:${version}"

                sh "docker tag dms-ui:${commit} ${githubImageName}:latest"
                sh "docker push ${githubImageName}:latest"
              } else if (env.BRANCH_NAME ==~ /(arranger-rewrite)/) {
                // TODO: remove this fork path once branch is merged
                sh "docker tag dms-ui:${commit} ${githubImageName}:arranger-rewrite-${commit}"
                sh "docker push ${githubImageName}:arranger-rewrite-${commit}"

                sh "docker tag dms-ui:${commit} ${githubImageName}:arranger-rewrite"
                sh "docker push ${githubImageName}:arranger-rewrite"
              } else { // push commit tags
                sh "docker tag dms-ui:${commit} ${githubImageName}:${commit}"
                sh "docker push ${githubImageName}:${commit}"
              }

              if (env.BRANCH_NAME ==~ /(develop)/) { // push edge tag
                sh "docker tag dms-ui:${commit} ${githubImageName}:edge"
                sh "docker push ${githubImageName}:edge"
              }
            }
          }
        }
      }
    }

    stage('Deploy to overture-qa') {
      when {
        branch 'develop'
      }
      steps {
        build(job: '/Overture.bio/provision/helm', parameters: [
            string(name: 'OVERTURE_ARGS_LINE', value: "--set-string image.tag=${commit}"),
            string(name: 'OVERTURE_CHART_NAME', value: 'dms-ui'),
            string(name: 'OVERTURE_ENV', value: 'qa'),
            string(name: 'OVERTURE_HELM_CHART_VERSION', value: ''), // use latest
            string(name: 'OVERTURE_HELM_REPO_URL', value: 'https://overture-stack.github.io/charts-server/'),
            string(name: 'OVERTURE_HELM_REUSE_VALUES', value: 'false'),
            string(name: 'OVERTURE_RELEASE_NAME', value: 'dms-ui'),
        ])
      }
    }

    stage('Deploy to overture-staging') {
      when {
        anyOf {
          branch 'main'
          branch 'master'
        }
      }
      steps {
        build(job: '/Overture.bio/provision/helm', parameters: [
            string(name: 'OVERTURE_ARGS_LINE', value: "--set-string image.tag=${version}"),
            string(name: 'OVERTURE_CHART_NAME', value: 'dms-ui'),
            string(name: 'OVERTURE_ENV', value: 'staging'),
            string(name: 'OVERTURE_HELM_CHART_VERSION', value: ''), // use latest
            string(name: 'OVERTURE_HELM_REPO_URL', value: 'https://overture-stack.github.io/charts-server/'),
            string(name: 'OVERTURE_HELM_REUSE_VALUES', value: 'false'),
            string(name: 'OVERTURE_RELEASE_NAME', value: 'dms-ui'),
        ])
      }
    }
  }

  // TODO: remove "master" references after renaming the mainstream branch

    post {
      fixed {
        withCredentials([string(
          credentialsId: 'OvertureSlackJenkinsWebhookURL',
          variable: 'fixed_slackChannelURL'
        )]) {
          container('node') {
            script {
              if (env.BRANCH_NAME ==~ /(develop|main|master)/) {
              sh "curl \
                  -X POST \
                  -H 'Content-type: application/json' \
                  --data '{ \
                    \"text\":\"Build Fixed: ${env.JOB_NAME} [Build ${env.BUILD_NUMBER}](${env.BUILD_URL}) \" \
                  }' \
                  ${fixed_slackChannelURL}"
              }
            }
          }
        }
      }

      unsuccessful {
        withCredentials([string(
          credentialsId: 'OvertureSlackJenkinsWebhookURL',
          variable: 'failed_slackChannelURL'
        )]) {
          container('node') {
            script {
              if (env.BRANCH_NAME ==~ /(develop|main|master)/) {
              sh "curl \
                  -X POST \
                  -H 'Content-type: application/json' \
                  --data '{ \
                    \"text\":\"Build Failed: ${env.JOB_NAME} [Build ${env.BUILD_NUMBER}](${env.BUILD_URL}) \" \
                  }' \
                  ${failed_slackChannelURL}"
              }
            }
          }
        }
      }
    }
}
