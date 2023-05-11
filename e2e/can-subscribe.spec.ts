import {expect, test} from '@playwright/test';
import {buttonLabel, formControlName, naturalSelect, runSql} from './utils';
import {AppPage} from './app.po';

test.describe('as anonymous', () => {
    let app: AppPage;
    test.beforeEach(async ({page}) => {
        app = new AppPage(page);
    });

    test('should subscribe, confirm and be logged in', async ({page}) => {
        await page.goto('/');
        await page.click(`//a[contains(., 'Mon compte')]`);
        await page.click(`//a[contains(., 'Créer un compte')]`);

        const unique = '' + Date.now();
        const login = `e2e-${unique}`;
        const email = `${login}@example.com`;

        await page.type(formControlName('email'), email);
        await page.click(buttonLabel('Créer votre compte'));

        expect(await app.getSnackBar()).toMatch(/Un email avec des instructions a été envoyé/);

        const token = '09876543210987654321098765432109';
        runSql(`UPDATE user
                SET token = NULL
                WHERE token = '${token}'`);
        runSql(`UPDATE user
                SET token               = '${token}',
                    token_creation_date = NOW()
                WHERE email = '${email}'`);

        await page.goto(`user/confirm/${token}`);

        await page.type(formControlName('password'), unique);
        await page.type(formControlName('confirmPassword'), unique);
        await page.type(formControlName('firstName'), 'e2e-firstname');
        await page.type(formControlName('lastName'), 'e2e-lastName');
        await page.type(formControlName('street'), 'e2e-street');
        await page.type(formControlName('locality'), 'e2e-locality');
        await page.type(formControlName('postcode'), '2000');
        await naturalSelect(page, formControlName('country'), 'Suisse');

        await page.click(buttonLabel('Créer votre compte'));

        expect(await app.getSnackBar()).toMatch(/Merci d'avoir confirmé votre compte/);
        expect(await page.innerText('app-profile')).toMatch(/Bonjour e2e-firstname,/);
    });
});
