# OZmap Challenge: Construindo a Geolocalização do Futuro

Olá desenvolvedor(a)! Bem-vindo(a) ao Desafio Técnico do OZmap. Este é um projeto que simula um cenário real de nossa empresa, onde você irá desempenhar um papel crucial ao desenvolver uma API RESTful robusta para gerenciar usuários e localizações. Estamos muito animados para ver sua abordagem e solução!

## 🌍 **Visão Geral**

Em um mundo conectado e globalizado, a geolocalização se torna cada vez mais essencial. E aqui no OZmap, buscamos sempre otimizar e melhorar nossos sistemas. Assim, você encontrará um protótipo que precisa de sua experiência para ser corrigido, melhorado e levado ao próximo nível.

## 🛠 **Especificações Técnicas**

- **Node.js**: Versão 20 ou superior.
- **Banco de Dados**: Mongo 7+.
- **ORM**: Mongoose / Typegoose.
- **Linguagem**: Typescript.
- **Formatação e Linting**: Eslint + prettier.
- **Comunicação com MongoDB**: Deve ser feita via container.

## 🔍 **Funcionalidades Esperadas**

### Usuários

- **CRUD** completo para usuários.
- Cada usuário deve ter nome, email, endereço e coordenadas.
- Na criação, o usuário pode fornecer endereço ou coordenadas. Haverá erro caso forneça ambos ou nenhum.
- Uso de serviço de geolocalização para resolver endereço ↔ coordenadas.
- Atualização de endereço ou coordenadas deve seguir a mesma lógica.

### Regiões

- **CRUD** completo para regiões.
- Uma região é definida como um polígono em GeoJSON, um formato padrão para representar formas geográficas. Cada região tem um nome, um conjunto de coordenadas que formam o polígono, e um usuário que será o dono da região.
- Listar regiões contendo um ponto específico.
- Listar regiões a uma certa distância de um ponto, com opção de filtrar regiões não pertencentes ao usuário que fez a requisição.
- Exemplo de um polígono simples em GeoJSON:
  ```json
  {
    "type": "Polygon",
    "coordinates": [
      [
        [longitude1, latitude1],
        [longitude2, latitude2],
        [longitude3, latitude3],
        [longitude1, latitude1] // Fecha o polígono
      ]
    ]
  }
  ```

### Testes

- Unitários e de integração.

## 🌟 **Diferenciais**

- Autenticação não é requisito, podendo então o usuário ser fornecido junto do corpo da requisição. Caso implemente autenticação, o usuário deve ser obtido a partir do token.
- Interface básica de usuário.
- Documentação completa da API.
- Internacionalização.
- Cobertura de código.
- Utilização de mongo session

## ⚖ **Critérios de Avaliação**

1. Organização e clareza do código.
2. Estruturação do projeto.
3. Qualidade e eficiência do código.
4. Cobertura e qualidade de testes.
5. Pontos diferenciais citados acima.
6. Tempo de entrega (será considerado apenas o cumprimento do prazo, sem distinção entre entregas feitas no primeiro ou no último dia, com ênfase na qualidade da entrega).
7. Padronização e clareza das mensagens de erro.
8. Organização dos commits.
9. Implementação de logs.
10. Adesão às boas práticas de API RESTful.

## 🚀 **Entrega**

1. Crie um repositório público com a base desse código.
2. Crie uma branch para realizar o seu trabalho.
3. Ao finalizar, faça um pull request para a branch `main` do seu repositório.
4. Envie um email para `rh@ozmap.com.br` informando que o teste foi concluído.
5. Aguarde nosso feedback.

---

Estamos ansiosos para ver sua implementação e criatividade em ação! Boa sorte e que a força do código esteja com você! 🚀



## Deployment

`backend is running on port 3000` **localhost:3000**

`WebUi is running on port 5173` **localhost:5173**

```bash
  git clone git@github.com:BrunoPoiano/ozmap-test.git
  cd ozmap-test
```

### .env
```bash
  cd backend
  cp .env.exemple .env
```
```bash
  cd frontend
  cp .env.exemple .env
```
Add your geocoding api key on both .env


### Docker
```bash
docker compose up
```

### To run manually
```bash
  cd backend
  npm run dev
```

```bash
  cd frontend
  npm run dev
```

### Tests
```bash
  cd backend
  npm run test
```
## API

#### Sign In

```http
  POST /api/signin
```

| Parameter     | type                | Description       |
| :----------   | :----------         | :----------       |
| `email`       | `string`            | **required**      |
| `name`        | `string`            | **required**      |
| `password`    | `string`            | **required**      |
| `address`     | `string`            | **not required**  |
| `coordinates` | `[number, number]`  | **not required**  |

**Send the coordinates or address, not both**


#### Log In

```http
  POST /api/login
```
| Parameter     | type                | Description       |
| :----------   | :----------         | :----------       |
| `email`       | `string`            | **required**      |
| `password`    | `string`            | **required**      |

**returns a token**


#### Update logged User
```http
  PUT /api/user
```
| Header        | type                | Description                     |
| :----------   | :----------         | :----------                     |
| `Content-Type`| `string`            | **required** `application/json` |
| `token`       | `string`            | **required** `Bearer token`     |

| Parameter     | type                | Description       |
| :----------   | :----------         | :----------       |
| `email`       | `string`            | **required**      |
| `name`        | `string`            | **required**      |
| `password`    | `string`            | **not required**  |
| `address`     | `string`            | **not required**  |
| `coordinates` | `[number, number]`  | **not required**  |

**Send the coordinates or address, not both**

#### Return logged User

```http
  GET /api/user
```
| Header        | type                | Description                     |
| :----------   | :----------         | :----------                     |
| `Content-Type`| `string`            | **required** `application/json` |
| `token`       | `string`            | **required** `Bearer token`     |

#### Delete logged User

```http
  DELETE /api/user
```
| Header        | type                | Description                     |
| :----------   | :----------         | :----------                     |
| `Content-Type`| `string`            | **required** `application/json` |
| `token`       | `string`            | **required** `Bearer token`     |


#### List Region
```http
  GET /api/region
```
| Header        | type                | Description                     |
| :----------   | :----------         | :----------                     |
| `Content-Type`| `string`            | **required** `application/json` |
| `token`       | `string`            | **required** `Bearer token`     |

| Parameter     | type        | Description       |
| :----------   | :---------- | :----------       |
| `search`      | `string`    | **not required**  |


#### List regions on a specific point
```http
  GET /api/region/find
```
| Header        | type                | Description                     |
| :----------   | :----------         | :----------                     |
| `Content-Type`| `string`            | **required** `application/json` |
| `token`       | `string`            | **required** `Bearer token`     |

| Parameter     | type        | Description   |
| :----------   | :---------- | :----------   |
| `latitude`    | `number`    | **required**  |
| `longitude`   | `number`    | **required**  |


#### List regions near specific point
```http
  GET /api/region/find-near
```
| Header        | type                | Description                     |
| :----------   | :----------         | :----------                     |
| `Content-Type`| `string`            | **required** `application/json` |
| `token`       | `string`            | **required** `Bearer token`     |

| Parameter     | type        | Description                       |
| :----------   | :---------- | :----------                       |
| `latitude`    | `number`    | **required**                      |
| `longitude`   | `number`    | **required**                      |
| `distance`    | `number`    | **not required** `default: 1000`  |
| `searchAll`   | `boolean`   | **not required** `default: false` |


#### Create Region
```http
  POST /api/region
```
| Header        | type                | Description                     |
| :----------   | :----------         | :----------                     |
| `Content-Type`| `string`            | **required** `application/json` |
| `token`       | `string`            | **required** `Bearer token`     |

| Parameter     | type                            | Description   |
| :----------   | :----------                     | :----------   |
| `name`        | `string`                        | **required**  |
| `coordinates` | `Array<Array<[number, number]>>`| **required**  |


#### Edit Region
```http
  PUT /api/region/{_id}
```
| Header        | type                | Description                     |
| :----------   | :----------         | :----------                     |
| `Content-Type`| `string`            | **required** `application/json` |
| `token`       | `string`            | **required** `Bearer token`     |

| Parameter     | type                            | Description   |
| :----------   | :----------                     | :----------   |
| `name`        | `string`                        | **required**  |
| `coordinates` | `Array<Array<[number, number]>>`| **required**  |


#### Delete Region
```http
  DELETE /api/region/{_id}
```
| Header        | type                | Description                     |
| :----------   | :----------         | :----------                     |
| `Content-Type`| `string`            | **required** `application/json` |
| `token`       | `string`            | **required** `Bearer token`     |



https://github.com/user-attachments/assets/04610487-8359-486f-81b5-569c98e5d161
