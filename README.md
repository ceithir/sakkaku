# Sakkaku

## Backend

[Laravel](https://laravel.com/) with [Jetstream](https://jetstream.laravel.com/) for user management.

Virtually no change from default.

## Server

### Configuration

Project is natively configured for deployment on [AWS Beanstalk](https://aws.amazon.com/elasticbeanstalk/).

The following envvars need to be manually set (through `eb setenv`):

-   APP_KEY
-   APP_URL
-   SANCTUM_STATEFUL_DOMAINS

### HTTPS

HTTPS is enabled per default in production. This behavior is defined in the files `app/Providers/AppServiceProvider.php` and `.platform/nginx/conf.d/elasticbeanstalk/laravel.conf` should you need to disable it.

### Mail

[AWS SES](https://aws.amazon.com/ses/) is used as the default mailer. This can be overriden through envvars.

Envvars (set, once again, through `eb setenv`) are also used to configure mail sending. See [Laravel's official documentation](https://laravel.com/docs/8.x/mail#configuration) for more.

### Known issues

Note: The command `php artisan config:cache` is missing from the deployment process as it didn't work out of the box and I got lazy. It should theoretically provide a slight performance boost should anyone manage to make it work.
