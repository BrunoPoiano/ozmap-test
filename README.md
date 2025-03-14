# GeoJson project
written in nodejs (typescript) and vuejs (typescript)

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
