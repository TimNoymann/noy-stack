import { test } from './fixtures/car.fixture';
import {createCarName} from "./utils/test-data";

test('add car', async ({ carPage }) => {
    const carName = createCarName();

    await carPage.goto();
    await carPage.createCar(carName);
    await carPage.expectCarVisible(carName);
});

test('edit car', async ({ carPage, preCreatedCarName }) => {
    const updatedName = preCreatedCarName + '-updated';

    await carPage.editCar(preCreatedCarName, updatedName);
    await carPage.expectCarVisible(updatedName);
});

test('delete car', async ({ carPage, preCreatedCarName }) => {
    await carPage.goto();
    await carPage.deleteCar(preCreatedCarName);
    await carPage.expectCarNotVisible(preCreatedCarName);
});