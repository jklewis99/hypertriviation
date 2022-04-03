# Building Full-Stack _Hypertriviation_

## Running Locally


## Getting Started
Ensure you have Python 3.9 installed. You can use pip or anaconda. You can download the latest version [here](https://www.python.org/downloads/).
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

### Backend

The backend is built in Python 3.9 with Django REST framework. Tables are structured in SQL databases

1. Setup environment

    ```
    conda create --name myenv
    conda activate myenv
    ```

2. Install requirements

    ```
    conda install pip
    pip install requirements.txt
    ```

3. Start the backend server

    ```
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

    Username (leave blank to use 'jklew'): 
    Email address: email@email.com
    Password: 
    Password (again): 
    Superuser created successfully.
    ```
    Start server again with `python manage.py runserver` and login!

## Frontend
The frontend is built using React and TypeScript.
See the `README.md` in [`/frontend`](/frontend/README.md) for all specifications for running the front end.

Transpile/Compile code for local browser (after navigating to the root of this folder)
```
# ~/hypertriviation/
cd frontend
npm start
```

## Acknowledgements
- Tech with Tim