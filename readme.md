# GUIA PESSOAL DO DOCKER

---

## Execuções em containers

__sudo docker start nome_do_container__

Executa um container montado, que encontra-se fora de execução.

__sudo docker stop nome_do_container__

Encerra a execução de container em execução.

__sudo docker exec nome_do_container__

Utilizado para executar um comando dentro do container em execução.


## Preparação de Imagem (build) - comandos

### docker image pull <tag>

Baixa a imagem solicitada, este comando pode ser executado implicitamente, quando o docker precisa de uma imagem para outra operação e não consegue localiza-la no cache local.

### docker image ls

Lista todas as imagens já baixadas, é possível ainda usar a sintaxe antiga: docker images

### docker image rm <tag>

Remove uma imagem do cache local.

### docker image inspect <tag>

Extrai diversas informações utilizando um formato JSON da imagem indicada.

### docker image tag <source> <tag>

Cria uma nova tag baseada em uma tag anterior ou hash.

### docker image build -t <tag>

Permite a criação de uma nova imagem.

### docker image push <tag>

Permite o envio de uma imagem ou tag local para um registry.

## Dockerfile
### FROM
Especifica a imagem base a ser utilizada pela nova imagem. Importando todas as layers nela contida.

### LABEL
Especifica vários metadados para a imgaem como o mantenedor. A especificação do mantenedor era deita usando a instrição específica MAINTAINER e substituída por LABEL

### ENV
Especifica variáveis de ambiente a serem utilizadas durante o build.

### ARG
Define argumentos que podem ser informados no momento do build através do parâmetro __--build-arg__.

Para a utilização de argumentos, se faz necessário a declaração da variável com a sintaxe a seguir:

__VAR=${VAR}__

De modo que o nome da variável contenha o prefixo **$** e esteja dentro de colchetes.

### COPY
Copia arquivos e diretórios para dentro da imagem.

### ADD
Similar ao COPY, mas com suporte extendido a URLs. Somente deve ser usado nos casos que a instrução COPY não atenda.

### RUN
Executa ações/comandos durante o build dentro da imagem.

### EXPOSE
Expõe determinadas portas remapeadas no container. A exposição da porta não é obrigatória a partir do uso do recurso de redes internas do Docker. Porém a exposição não só ajuda a documentar como permite o mapeamento rápido através do parâmetro -P do docker container run.

**-p nova_porta:porta_para_redirecionar**

### WORKDIR
Configura o diretório de atuação para a execução dos próximos comandos, quando se tratar de uma referencia relativa, será em relação a referência WORKDIR anteriormente configurada.
[Documentação do Docker sobre WORKDIR](https://docs.docker.com/engine/reference/builder/#workdir)

### ENTRYPOINT
Especifica o processo inicial do container.

### CMD
Indica parâmetros para o ENTRYPOINT.

### USER
Especifica qual o usuário que será usado para execução do processo no container (ENTRYPOINT e CMD) e instruções RUN durante o build.

### VOLUME
Instrui a execução do container a criar um volume para um diretório indicado e copia todo o conteúdo do diretório na imagem para o volume criado. Isto simplificará no futuro, processos de compartilhamento destes dados para backup por exemplo.

---

## Composição pelo arquivo .yml

É possível carregar configurações de inicialização para os containers criados pelo docker, o processo acontece a partir do arquivo .yml contido na pasta raiz do projeto.

Pode-se ainda sobrescrever os valores do arquivo de composição .yml inicial através de um arquivo .override.yml.

### VOLUMES
Faz a conexão entre os repositórios do host e do container.

### SERVICES
Declara os serviços que serão utilizados dentro da composição.
Para executar um container a partir de imagens criadas utiliza-se a declaração **image:**
Para montar um container com base em um documento Dockerfile usamos **build:**

### NETWORKS
Usado para declarar as redes a serem utilizadas pelos serviços, e posteriormente devem ser definidas dentro do serviço, quais redes ele terá acesso.

### ENVIRONMENT
Utilizado dentro dos serviços para configuração do ambiente de execução do serviço.

## REDE

Existem 4 possibilidades de redes para serem aplicadas com o docker, sendo configurado com:

__docker container --net none/host/bridge/overlay__

Quando não especificado o comando --net, será aplicado o modo bridge.

As configurações de rede são:

### None
O container não permite o acesso a internet, sem fornecer uma interface de rede para comunicação externa, e se mantendo isolado até mesmo de outros containers.

Caso de Uso: Manipulação de arquivos, como backup de arquivos.

### Host
A conexão dos containers à internet é realizada diretamente pela conexão presente no host.

### Bridge
Modelo padrão aplicado aos Containers do Docker, onde é gerado uma ponte entre a conexão do host e os containers.

### Overlay

---

### Criação de rede

__docker network create --driver none/bridge/host/overlay__

---

### Associação de container a uma rede

__docker container run --net **nome_da_rede**__

Cria um container associado a uma rede.

---

### Conexão de um container a uma rede diferente

__docker network connect **nome_da_rede nome_do_container**__

A partir da execução o container começará a ter conexão com a rede indicada e os containers que a utilizam.

__docker network disconnect **nome_da_rede nome_do_container**__

A partir da execução o container não mais terá conexão com a rede indicada e os containers que a utilizam.


## Compose

Executar o comando a seguir faz com que sejam inicializados os serviços declarados no arquivo .yml contidos no diretório atual.

__docker-compose up__

__-d__ Para executar no modo detach, liberando o uso do terminal.

__docker-compose ps__ Para listar os processos em execução

---

### Executando comandos juntos da inicialização do docker-compose

__docker-compose exec **servico e comandos**__ Executar comandos dentro de serviços especificos.

Exemplo:

__docker-compose exec db psql -U usuario -c '\l' -f diretorio/arquivo.sql__

- Dentro do arquivo .yml foi declarado um serviço nomeado de db que executa uma imagem do **POSTGRES**.
- Seta o usuário a partir do comando __-U nome_usuario__
- Executa o comando __'\l'__ dentro do serviço do postgres utilizando o comando -c para listar as tabelas contidas dentro do banco de dados.
- Execute o arquivo.sql pelo comando __-f__.
- Execute o comando __-d nome_do_banco__ para entrar no banco 

### Escalabilidade de processos

__docker-compose up -d --scale nome_do_servico=numero_de_instancias__
Utilizado para definir quantas instancias do mesmo serviço deverão ser executados.

### Scripts do POSTGRE

\l              - lista as tabelas contidas no banco
\c email_sender - conecta-se ao banco de dados
\d emails       - descreve a tabela emails