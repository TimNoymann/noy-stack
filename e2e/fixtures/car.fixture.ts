import { test as base } from '@playwright/test';
import { CarPage } from '../pages/car.page';
import { createCarName } from '../utils/test-data';

type CarFixture = {
    carPage: CarPage;
    preCreatedCarName: string;
};

export const test = base.extend<CarFixture>({
    carPage: async ({ page }, use) => {
        await use(new CarPage(page));
    },

    // This fixture is only created if a test requests it
    preCreatedCarName: async ({ carPage }, use) => {
        const carName = createCarName();

        await carPage.goto();
        await carPage.createCar(carName);
        await carPage.expectCarVisible(carName);

        await use(carName);
    },
});