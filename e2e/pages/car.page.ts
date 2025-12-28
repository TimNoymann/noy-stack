import { Page, Locator, expect } from '@playwright/test';

export class CarPage {
    readonly page: Page;
    readonly nameInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator('input[formcontrolname="name"]');
    }

    async goto() {
        await this.page.goto('/');
    }

    async createCar(name: string) {
        await this.page.getByRole('button', { name: 'Add Car' }).click();
        await this.nameInput.fill(name);
        await this.page.getByRole('button', { name: 'Create car' }).click();
    }

    async editCar(oldName: string, newName: string) {
        const row = this.carRow(oldName);
        await row.getByRole('button', { name: 'Edit' }).click();
        await this.nameInput.fill(newName);
        await this.page.getByRole('button', { name: 'Save changes' }).click();
    }

    async deleteCar(name: string) {
        const row = this.carRow(name);
        await row.getByRole('button', { name: 'Delete' }).click();

        const dialog = this.page.getByRole('dialog', { name: 'Delete car' });
        await dialog.getByRole('button', { name: 'Delete' }).click();
    }

    carRow(name: string): Locator {
        return this.page.getByRole('row', { name });
    }

    async expectCarVisible(name: string) {
        await expect(this.carRow(name)).toBeVisible();
    }

    async expectCarNotVisible(name: string) {
        await expect(this.carRow(name)).not.toBeVisible();
    }
}
