# ShortLink

ShortLink is a URL shortening service where you enter a URL, it returns a short URL. Visiting the shortened URL should redirect the user to the long URL

### Features

- Shorten a url (encode)
- Visit short url and get redirected to the long url
- Get relevant statistis for each shortened url

### Tech Stack

- Nodejs
- Express
- Sqlite (Database)
- Sequelize (ORM)

### Set up the application

1.  Clone the repository by running the following on your terminal

```
    git clone https://github.com/cleave3/ShortLink.git
```

2.  On the terminal cd into root directory of the project and install app dependencies

```
    npm install
```

3. Migrate the database run

```
    npm run migration
```

4.  Start the Application

```
    npm run start
```

### Testing the application

On postman test out the following endpoints

BASE_URL = localhost:8080

```
headers: {
    "content-Type": "application/json"
}

```

1. /encode

method: `POST`

```json
body

{
    "long_url": "string" // a valid url
}

success response
{
    "status": true,
    "code": 200,
    "message": "url encoded sucessfully",
    "data": {
        "short_url": "string"
    }
}

failure response

{
    "status": false,
    "code": 400 || 404 || 500,
    "error": "error message"
}

```

2. /decode

method: `POST`

```json
body

{
    "short_url": "string" // a shortened url
}

success response
{
    "status": true,
    "code": 200,
    "message": "url encoded sucessfully",
    "data": {
        "short_url": "string"
    }
}

failure response

{
    "status": false,
    "code": 400 || 404 || 500,
    "error": "error message"
}
```

2. /statistic/{url_path}

method: `GET`

```json
success response
{
    "status": true,
    "code": 200,
    "message": "stats retrieved",
    "data": {
        "id": 1,
        "short_url": "string",
        "long_url": "string",
        "created_at": "string",
        "totalclicks": 8,
        "visitors": {
            "uniquevisitors": 4,
            "browsers": [
                {
                    "browser": "Chrome",
                    "count": 7
                },
                {
                    "browser": "Microsoft Edge",
                    "count": 1
                }
            ],
            "platforms": [
                {
                    "os": "Windows",
                    "count": 8
                }
            ],
            "devices": [
                {
                    "device": "desktop",
                    "count": 8
                }
            ],
            "countries": [
                {
                    "country": "NG",
                    "count": 1
                },
                {
                    "country": "US",
                    "count": 1
                }
            ],
            "timezones": [
                {
                    "timezone": "Africa/Lagos",
                    "count": 1
                },
                {
                    "timezone": "America/Chicago",
                    "count": 1
                }
            ],
            "cities": [
                {
                    "city": "",
                    "count": 1
                },
                {
                    "city": "Lagos",
                    "count": 1
                }
            ]
        }
    }
}

failure response

{
    "status": false,
    "code": 400 || 404 || 500,
    "error": "error message"
}
```
