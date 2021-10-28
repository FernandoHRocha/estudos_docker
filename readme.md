# GUIA PESSOAL DO DOCKER

---

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

## Preparação da Imagem (Dockerfile) - Comandos
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
Indica o diretório em que o processo principal será executado.

### ENTRYPOINT
Especifica o processo inicial do container.

### CMD
Indica parâmetros para o ENTRYPOINT.

### USER
Especifica qual o usuário que será usado para execução do processo no container (ENTRYPOINT e CMD) e instruções RUN durante o build.

### VOLUME
Instrui a execução do container a criar um volume para um diretório indicado e copia todo o conteúdo do diretório na imagem para o volume criado. Isto simplificará no futuro, processos de compartilhamento destes dados para backup por exemplo.

---

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

__-d__ Para executar no modo daemon

__docker-compose ps__ Para listar os processos em execução

---

### Executando comandos juntos da inicialização do docker-compose

__docker-compose exec **servico e comandos**__ Executar comandos dentro de serviços especificos.

Exemplo:

__docker-compose exec db psql -U usuario -c '\l' -f diretorio/arquivo.sql__

- Dentro do arquivo .yml foi declarado um serviço nomeado de db que executa uma imagem do **POSTGRES**.
- Seta o usuário a partir do comando -U usuario
- Executa o comando '\l' dentro do serviço do postgres utilizando o comando -c para listar as tabelas contidas dentro do banco de dados.
- Execute o arquivo.sql pelo comando -f.

### Scripts do POSTGRE

\l              - lista as tabelas contidas no banco
\c email_sender - conecta-se ao banco de dados
\d emails       - descreve a tabela emails