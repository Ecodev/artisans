#!/usr/bin/env bash

# Default flags
IS_PRODUCTION=1
NO_PROGRESS=

# Arguments parsing
for arg
do
    case "$arg" in
        --dev)
            IS_PRODUCTION=0
            ;;
        --no-progress)
            NO_PROGRESS='--no-progress'
            ;;
        *)
            echo "Unknown argument: $arg"
            exit 1
            ;;
     esac
done

# This script build all assets for production environment

# If the deploy user exists on the machine, re-run script with that user
DEPLOY_USER="artisansdelatransitionorg"
if id "$DEPLOY_USER" >/dev/null 2>&1; then

    if [ ! "$DEPLOY_USER" == "$USER" ]; then
        echo "Restarting script with user '$DEPLOY_USER'"
        sudo -EH -u $DEPLOY_USER "${BASH_SOURCE}"
        exit
    fi

    # Declare a fake HOME, so that cache and various config files can be created
    export HOME="/tmp/$DEPLOY_USER"
fi

# Try to use PHP 8.1, or fallback to default version
PHP=`which php8.1` || PHP='php'
COMPOSER="$PHP `which composer` --no-interaction --no-plugins"

# Exit script on any error
set -e

echo "Installing git hooks..."
ln -fs ../../bin/pre-commit.sh .git/hooks/pre-commit

echo "Updating Node.js packages..."
yarn install $NO_PROGRESS

echo "Updating all PHP dependencies via composer..."
$COMPOSER install --classmap-authoritative $NO_PROGRESS

echo "Clear cache"
$PHP ./bin/clear-config-cache.php

echo "Updating database..."
$PHP ./bin/doctrine migrations:migrate --no-interaction
$PHP ./bin/doctrine orm:generate-proxies
$PHP ./bin/create-triggers.php

echo "Delete old logs..."
$PHP ./bin/delete-old-log.php

if [ $IS_PRODUCTION -eq 1 ]; then
    echo "Building Angular application..."
    yarn run prod
else
    echo "Running Angular dev server..."
    yarn run dev
fi
