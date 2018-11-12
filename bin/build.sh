#!/usr/bin/env bash

# This script build all assets for production environment

# If the deploy user exists on the machin****e, re-run script with that user
DEPLOY_USER="ichtusch"
if id "$DEPLOY_USER" >/dev/null 2>&1; then

    if [ ! "$DEPLOY_USER" == "$USER" ]; then
        echo "Restarting script with user '$DEPLOY_USER'"
        sudo -H -u $DEPLOY_USER "${BASH_SOURCE}"
        exit
    fi

    # Declare a fake HOME, so that cache and various config files can be created
    export HOME="/tmp/$DEPLOY_USER"
fi

# Try to use PHP 7.2, or fallback to default version
PHP=`which php7.2` || PHP='php'

# Because Travis has several composer installed in parallel we
# cannot prefix it with the correct PHP, but luckily it doesn't matter
# since Travis has only one (accessible) PHP version
if [ -z "$TRAVIS_PHP_VERSION"  ]; then
    COMPOSER="$PHP `which composer`"
else
    COMPOSER="composer"
fi

# Exit script on any error
set -e

# Disable progress
if [ "$1" = '--no-progress' ]; then
    NO_PROGRESS='--no-progress'
    PROGRESS_GIT='--quiet'
    export PROGRESS_NG='--progress false'
else
    NO_PROGRESS=
    PROGRESS_GIT=
    export PROGRESS_NG=
fi

echo "Installing git hooks..."
ln -fs ../../bin/pre-commit.sh .git/hooks/pre-commit

echo "Updating Node.js packages..."
yarn install $NO_PROGRESS

echo "Updating all PHP dependencies via composer..."
$COMPOSER install --classmap-authoritative $NO_PROGRESS

echo "Clear cache"
$COMPOSER clear-config-cache

echo "Updating database..."
$PHP ./vendor/bin/doctrine-migrations migrations:migrate --no-interaction
$PHP ./vendor/bin/doctrine orm:generate-proxies

echo "Building Angular application..."
yarn run prod
