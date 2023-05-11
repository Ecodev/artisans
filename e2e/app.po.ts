import {formControlName, graphqlRequest} from './utils';
import {Page} from '@playwright/test';
import {permissionsQuery} from '../client/app/shared/services/permissions.queries';

export class AppPage {
    public constructor(private readonly page: Page) {}

    public async login(login: string): Promise<unknown> {
        await Promise.all([
            // Login page will load for permissions, so we need to be sure we finish that before reseting Apollo store when login
            this.page.waitForResponse(graphqlRequest(permissionsQuery)),
            this.page.goto('login?logout=true'),
        ]);

        await this.page.type(formControlName('login'), login);
        await this.page.type(formControlName('password'), login);

        // Alternative way with a predicate.
        return await Promise.all([
            // Wait for the permissions to be fetched with the new user
            this.page.waitForResponse(graphqlRequest(permissionsQuery)),

            // Triggers the login
            this.page.click('button[type="submit"]'),
        ]);
    }

    public getSnackBar(): Promise<string> {
        return this.page.innerText('simple-snack-bar');
    }
}
