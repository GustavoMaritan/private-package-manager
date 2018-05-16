# Private Packages

> Gerenciamento de pacotes privados

Gerenciar pacotes privados, pelo Bitbucket ou Github -
*Por enquanto só repositórios do bitbucket*

### Instalar

```sh
$ npm install ppk -g
```

### Repositório (Bitbucket)

*PPK irá controlar o versionamento usando as tag geradas pelo git*

- Criar repositório com o package.
- Cada versão disponível para uso deve ser taguiada [TAG(v1.0.0)]

### Use

```sh
$ ppk <command> [options]
```
### Parâmetro

__________
### Comandos

| Comando | Descrição |
| ------- | --------- |
| config | Configuração de segurança e packages utilizados |
| i, install <name> | Instala packages na aplicação |
| l, list | Lista todos packages disponíveis na configuração ativa |
| c, check | Verifica verão dos packages instalados com a versão do servidor |
| u, update [name]| Atualiza package(s) conforme a opção passada (patch-minor-major) |
| r, remove <name> | Remove package informado |

__________
##### Config [options]

Criar arquivo de configuração segurança e packages disponíveis conforme o modelo.
> O arquivo pode ser criado externo e carregado atraves de um diretório ou url
> ou ser criado a partir de um questionário.

```js
{
    "bit_auth": {
        "username": "Login",
        "password": "Senha",
        "client_id": "Código fornecido pela servidor",
        "client_secret": "Código fornecido pela servidor",
        "url_user": "Usuário da url ex:https://bitbucket.org/'URL_USER'/meupackage.git",
        //Opcional caso user clone diferente de user auth
        "bit_clone": {
            "user": "login",
            "pass": "senha"
        }
    },
    "bit_packages": {
        "[nome]": {
            "nome": "[nome] - Definir nome para facilitar seu uso, ou informar nome do package",
            "descricao": "Descrição opcional",
            "repositorio": "Nome do package no repositório"
        },
        .
        .
        .
    }
}
```
> ppk config [options]

| Options | Descrição |
| ------- | --------- |
|-p, --path | Informar caminho arquivo local. |
|-u, --url | Informar url que retorna arquivo de configuração |
|-n, --new <name>| Inicia nova configuração com questionário |
|-l, --list | Lista todas configurações disponíveis do usuário |
|-s, --set <name>| Ativa configução informada|

__________
##### Remove <name>
*Remove package da aplicação*

```sh
> ppk remove nome
```

__________
##### Install <name> [options]
*Instala novo package*

```sh
//Instala última versão disponível
> ppk install nome

//Define versão a ser instalada
> ppk install nome -v x.x.x
```
___________
##### List 
*Lista todos packages da configuração*
```sh
> ppk list
```
___________
##### Check [name]
*Verifica e compara versões na aplicação com servidor*

```sh
// Verifica apenas package informado
> ppk check nome

//Verifica todos packages privados na aplicação
> ppk check
```

___________
##### Update [name] <--option>
*Atualiza versão do package informado ou de todos packages caso [name]=null*

| Options | Descrição |
| ------- | --------- |
|--patch | Atualiza para maior versão patch x.x.[x] |
|--minor | Atualiza para maior versão minor x.[x].x |
|--major | Atualiza para maior versão major [x].x.x |

```sh
// Atualiza somente package informado para ultima versão patch
> ppk update nome --patch

/ Atualiza todos packages para ultima versão patch
> ppk update --patch
```

___________

### Issues

* Local config|config-user 
* Nome Versão bitbucket, Alias na versao ([v]0.0.0)