# Backend for Hypertriviation

## Getting Authentication Started
1. set up a super user

2. (you may have to comment the lines 
```
path('admin/', admin.site.urls),
```
 in backend urls.py
and 
```
'django.contrib.admin',
```
under `INSTALLED_APPS` in the settings.py file
)

3. run server after migrating

4. run curl with super user credentials
```
curl --header "Content-Type: application/json" -X 
POST http://127.0.0.1:8000/authapi/token/obtain/ --data '{"username":"username","password":"password"}'
```
or go to  [http://127.0.0.1:8000/authapi/token/obtain/](http://127.0.0.1:8000/authapi/token/obtain/) and type in credentials there

5. Try refreshing