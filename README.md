# Building Full-Stack _Hypertriviation_

## Running Locally

### Backend

The backend is built in Python 3.10 with Django REST framework. Tables are structured in SQL databases

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
See the `README.md` in [`/frontend`](/frontend/README.md) for all specifications are running the front end.

To Make new components:
```
npx generate-react-cli component MusicPlayer
```

## Acknowledgements
- Tech with Tim