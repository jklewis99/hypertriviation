# Building Full-Stack _Hypertriviation_

## Running Locally
Prerequisites:
- Python (3.9.x)
- Node (14.17.x)
- Docker (20.10.x)

## Getting Started
Ensure you have Python 3.9 installed. You can use pip or anaconda. You can download the latest version [here](https://www.python.org/downloads/).
Also ensure you have Docker installed. You can download the latest version [for Windows](https://docs.docker.com/desktop/windows/install/)
### 1. Clone the repository
Navigate to the folder in which you want to store this repository. Then clone the repository and change directory to the repository:
```
https://github.com/jklewis99/hypertriviation.git
cd hypertriviation
```
### 2. Activate a virtual environment (optional, but recommended):
#### With pip:
_Windows_
```
py -m venv [ENV_NAME]
.\[ENV_NAME]\Scripts\activate
```

_Linux/Mac_
```
python3 -m venv [ENV_NAME]
source [ENV_NAME]/bin/activate
```

#### With conda:
```
conda update conda
conda create -n [ENV_NAME]
conda activate [ENV_NAME]
conda install pip # install pip to allow easy requirements.txt install
```
### 3. Install the requirements:

```
# ~/hypertriviation/
cd backend
pip install -r requirements.txt
```

### 4. Generating Django Secret Key
Secret keys for spotify and django are stored in a file called `appsettings.py`. You will need to create this file on your local machine:

(On Windows)
```
cd backend
echo appsettings.py
```

(On Mac)
```
cd backend
touch appsettings.py
```

Now generate your Django secret key. Make sure your environent is activated if you are using one.
Execute the following command (You may need to change `python` to `python3` for Mac):
```
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```
Save the key that is printed.

In the `appsettings.py`, paste the following, replacing YOUR_SECRET_KEY with your secret key.
```
# appsettings.py
DJANGO_SECRET_KEY = "YOUR_SECRET_KEY"
```

You will also need to add values for the following if you want Spotify authentication to work. To connect this app to your Spotify, navigate to [Spotify For Developers](https://developer.spotify.com/dashboard/).
```
# appsettings.py
...
# these two values will be generated in the Spotify developer dashboard for your app
CLIENT_ID = "SPOTIFY_CLIENT_ID" 
CLIENT_SECRET = "SPOTIFY_CLIENT_SECRET"
# assuming you are not specifying the port when you run the server, you can leave the following,
# but make sure it matches the value in your Spotify Developer dashboard
REDIRECT_URI = "http://127.0.0.1:8000/spotify/redirect"
```
### Backend

The backend is built in Python 3.9 with Django REST framework. Tables are structured in SQL databases

1. Activate environment (if you created one)

    ```
    conda activate myenv
    ```

2. Start the redis cache with Docker:

    ```
    docker run -p 6379:6379 -d redis:5
    ```

2. Start the backend server

    ```
    cd backend
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```

4. (Optional) Register Models with Admin Site

    Models for this application have already been registered with the admin site.
    If you wish to alter or add more, then insert the following in `myapi/admin.py`:

    ```
    from django.contrib import admin
    from .models import <ModelName>, ...
    admin.site.register(<ModelName>)
    ...
    admin.site.register(...)
    ```

    Django’s pretty admin interface used to review the data in our database.
    ```
    python manage.py createsuperuser

    Username (leave blank to use 'NAME'): 
    Email address: email@email.com
    Password: 
    Password (again): 
    Superuser created successfully.
    ```
    Start server again with `python manage.py runserver`, navigate to `http://127.0.0.1:8000/admin` in your browser and login!

## Frontend
The frontend is built using React and TypeScript.
See the `README.md` in [`/frontend`](/frontend/README.md) for all specifications for running the front end. You will need [Node.js](https://nodejs.org/en/) version 14 or later. I use `v14.17.0`. You will also need npm version 6 or later. I use `6.14.13`.

Download all node_modules:
```
cd frontend
npm install
```

Transpile/Compile code for local browser (after navigating to the root of this folder)
```
cd frontend
npm start
```

## Acknowledgements
- Tech with Tim