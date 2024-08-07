#!/bin/sh

pass=true

files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|json|html|md|scss|ts)$')
if [ "$files" != "" ]; then

    # Run prettier before commit
    echo "$files" | xargs ./node_modules/.bin/prettier --write
    if [ $? -ne 0 ]; then
        pass=false
    fi

    # Automatically add files that may have been fixed by prettier
    echo "$files" | xargs git add
fi

files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E 'client/.*\.(html|ts)$')
if [ "$files" != "" ]; then

    # Run eslint before commit
    printf -- '--lint-file-patterns %s\n' $files | xargs ./node_modules/.bin/ng lint --fix
    if [ $? -ne 0 ]; then
        pass=false
    fi

    # Automatically add files that may have been fixed by eslint
    echo "$files" | xargs git add
fi

files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(php|phtml)$')
if [ "$files" != "" ]; then

    # Run php syntax check before commit
    for file in ${files}; do
        php -l ${file}
        if [ $? -ne 0 ]; then
            pass=false
        fi
    done

    # Run php-cs-fixer validation before commit
    echo "$files" | xargs php ./vendor/bin/php-cs-fixer fix --diff --config .php-cs-fixer.dist.php
    if [ $? -ne 0 ]; then
        pass=false
    fi

    # Automatically add files that may have been fixed by php-cs-fixer
    echo "$files" | xargs git add
fi

if $pass; then
    exit 0
else
    echo ""
    echo "PRE-COMMIT HOOK FAILED:"
    echo "Code style validation failed. Please fix errors and try committing again."
    exit 1
fi
