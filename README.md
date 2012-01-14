1. Change the filename of the project to "PennApps2012S"
2. Set up Postrgresql

a. install psycopg2 and postgres

 
b. Setting up Postgres Users
The postgres install will create a “postgres” user by default that is the superuser for the database server. First thing we want to do is change the password for the “postgres” user this requires changing it within postgres and within the OS.

Changing the postgres users database password:

su postgres -c psql template1
template1=# ALTER USER postgres WITH PASSWORD 'password';
template1=\q
Where “password” is the new password.
Changing the postgres user OS password:

sudo passwd -d postgres
sudo su postgres -c passwd
...
It’s convenient to have the two passwords match, but not required.
Next create a postgres user for your login (this isn’t required but it can be convenient) at the command prompt enter:

sudo -u postgres createuser -P yourloggedinuser
 Answer the questions as it prompts you.
Now create a user for your django app to use for logging into the database. For this user don’t give it any of the super user, create db, create role, priveleges.

sudo -u postgres createuser -P django_login
where “django_login” is the username you’ll use to connect with from your django app. Remember the user name and password as we’ll use those in your django app’s settings.py file For more information on creating users you can refer to the Postgres documentation.
Create the Database
Now we need to create a database that our django app can use. Login into the psql interface

psql template1
Then at the psql prompt enter
CREATE DATABASE django_db OWNER django_login ENCODING 'UTF8';
This creates a database called “django_db” owned by “django_login” (change those values be what you want the database to be called and to the user you created in the previous step).
Configuring Access to the Postgres Server
Who can access the db server and from where is set in the /etc/postgresql/8.3/main/pg_hba.conf file, go ahead and open it up to edit. Postgres again has plenty of documentation on the file and how to set it up. For my case I only allow three users to access the database and all only from locally

local   all         postgres                          ident sameuser
local   all         demo                          ident sameuser
local   django_db    django_login                      md5
The first line you can leave as is as it lets the “postgres” user connect through the unix sockets. Then add the second line (again substituting your username for “demo”) so your user can access the system locally. Finally the last line is to allow your django application to access the system, where “django_db” is the name of the database you created in the step above and “django_user” is the user name you create earlier for your app to use.

