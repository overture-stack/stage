ElasticSearch is used by Arranger, and version 7.17.11 is deployed using the official [es-operator](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-eck.html). First CustomResourceDefinitions are imported:

`kubectl create -f https://download.elastic.co/downloads/eck/2.7.0/crds.yaml` and then the operator itself is installed: `kubectl apply -f https://download.elastic.co/downloads/eck/2.7.0/operator.yaml`. This gives a new type of object, an ElasticSearch, which coordinates the StatefuleSets and other resources used in an ElasticSearch deployment (to manager master and data servers, etc).

After the es-operator is available, a self-signed cert issuer was created using `kubectl apply -f issuer.yml`. This self-signed issuer is used for the TLS between the ElasticSearch and services using it inside the Kubernetes cluster.

ElasticSearch itself was deployed following the instructions found [here](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-elasticsearch.html)

The ElasticSearch service is available at https://elasticsearch.playground.overture.bio, whose domain name points to the k8s-controller floating IP. Username for login is `elastic`, to get the password run `kubectl get secret playground-es-elastic-user -o go-template='{{.data.elastic | base64decode}}' -n playground`.
