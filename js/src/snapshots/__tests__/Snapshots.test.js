/*
 * Copyright (C) 2020-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import mockAxios from "jest-mock-axios";
import {
    render,
    wait,
    getAllByText,
    queryByText,
    getByText,
    getByLabelText,
    queryByRole,
    getByRole,
    act,
    fireEvent,
    getByTestId,
} from "foris/testUtils/customTestRender";
import { mockJSONError } from "foris/testUtils/network";
import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { WebSockets } from "foris";

import Snapshots from "../Snapshots";

const SNAPSHOTS = [
    {
        number: 1,
        type: "single",
        description: "Whatever",
        created: "2020-01-30T10:27:34Z",
        size: "808 kB",
    },
    {
        number: 2,
        type: "rollback",
        description: "Something",
        created: "2020-01-31T10:27:34Z",
        size: "909 kB",
    },
];

function creteSnapshot(number, description) {
    return {
        number,
        type: "single",
        description,
        created: "2020-01-30T10:27:34Z",
        size: "808 kB",
    };
}

describe("<Snapshots />", () => {
    let container;
    let webSockets;

    beforeEach(() => {
        webSockets = new WebSockets();
        ({ container } = render(<Snapshots ws={webSockets} />));
    });

    it("should render spinner", () => {
        expect(container).toMatchSnapshot();
    });

    it("should render table", async () => {
        expect(mockAxios.get).toBeCalledWith(
            "/reforis/snapshots/api/snapshots",
            expect.anything()
        );
        mockAxios.mockResponse({ data: SNAPSHOTS });
        await wait(() => getByText(container, SNAPSHOTS[0].description));
        expect(container).toMatchSnapshot();
    });

    it("should handle GET error", async () => {
        mockJSONError();
        await wait(() =>
            expect(
                getByText(container, "An error occurred while fetching data.")
            ).toBeTruthy()
        );
    });

    it("should display spinner while snapshot is being added", async () => {
        // Prepare table
        mockAxios.mockResponse({ data: SNAPSHOTS });
        // Initially there's no spinner
        await wait(() => expect(queryByRole(container, "status")).toBeNull());

        // Create new snapshot
        act(() =>
            webSockets.dispatch({
                module: "schnapps",
                action: "create",
                data: {},
            })
        );
        // Spinner should appear
        await wait(() => getByRole(container, "status"));
    });

    it("should display spinner when snapshot is being removed", async () => {
        // Prepare table
        mockAxios.mockResponse({ data: SNAPSHOTS });
        // Initially there's no spinner
        await wait(() => expect(queryByRole(container, "status")).toBeNull());

        // Delete device
        fireEvent.click(getAllByText(container, "Delete")[0]);
        // Spinner should appear
        await wait(() => getByRole(container, "status"));
    });

    it("should display spinner while rolling back to snapshot", async () => {
        // Prepare table
        mockAxios.mockResponse({ data: SNAPSHOTS });
        // Initially there's no spinner
        await wait(() => expect(queryByRole(container, "status")).toBeNull());

        // Delete device
        fireEvent.click(getAllByText(container, "Rollback")[0]);
        // Spinner should appear
        await wait(() => getByRole(container, "status"));
    });

    describe("with table prepared", () => {
        beforeEach(async () => {
            // Prepare table
            mockAxios.mockResponse({ data: SNAPSHOTS });
            await wait(() => getByText(container, SNAPSHOTS[0].description));
        });

        it("should refresh table after new snapshot is added", async () => {
            // Create new snapshot
            const newDescription = "Nothing";
            act(() =>
                webSockets.dispatch({
                    module: "schnapps",
                    action: "create",
                    data: {},
                })
            );
            expect(mockAxios.get).toHaveBeenNthCalledWith(
                2,
                "/reforis/snapshots/api/snapshots",
                expect.anything()
            );
            mockAxios.mockResponse({
                data: [...SNAPSHOTS, creteSnapshot(3, newDescription)],
            });
            // New snapshot should appear
            await wait(() => getByText(container, newDescription));
        });

        it("should refresh table after snapshot is removed", async () => {
            // Delete snapshot
            const deletedNumber = SNAPSHOTS[0].number;
            fireEvent.click(getAllByText(container, "Delete")[0]);
            expect(mockAxios.delete).toBeCalledWith(
                `/reforis/snapshots/api/snapshots/${deletedNumber}`,
                expect.anything()
            );
            mockAxios.mockResponse({ data: {} });

            act(() =>
                webSockets.dispatch({
                    module: "schnapps",
                    action: "delete",
                    data: { number: deletedNumber },
                })
            );
            // Device should disappear
            await wait(() =>
                expect(
                    queryByText(container, SNAPSHOTS[0].description)
                ).toBeNull()
            );
        });

        it("should handle error on removal", async () => {
            // Delete device
            fireEvent.click(getAllByText(container, "Delete")[0]);
            // Handle error
            const errorMessage = "API didn't handle this well";
            mockJSONError(errorMessage);
            await wait(() => {
                expect(mockSetAlert).toHaveBeenCalledWith(errorMessage);
            });
        });

        it("should refresh table after rolling back to snapshot", async () => {
            // Rollback to snapshot
            const rollbackToNumber = SNAPSHOTS[0].number;
            fireEvent.click(getAllByText(container, "Rollback")[0]);
            expect(mockAxios.put).toBeCalledWith(
                `/reforis/snapshots/api/snapshots/${rollbackToNumber}/rollback`,
                undefined,
                expect.anything()
            );
            mockAxios.mockResponse({ data: {} });

            act(() =>
                webSockets.dispatch({
                    module: "schnapps",
                    action: "rollback",
                    data: {},
                })
            );

            const newDescription = `Rollback to ${rollbackToNumber}`;
            expect(mockAxios.get).toHaveBeenNthCalledWith(
                2,
                "/reforis/snapshots/api/snapshots",
                expect.anything()
            );
            mockAxios.mockResponse({
                data: [...SNAPSHOTS, creteSnapshot(3, newDescription)],
            });
            // New snapshot should appear
            await wait(() => getByText(container, newDescription));
        });

        it("should handle error on rollback", async () => {
            // Delete device
            fireEvent.click(getAllByText(container, "Rollback")[0]);
            // Handle error
            const errorMessage = "API didn't handle this well";
            mockJSONError(errorMessage);
            await wait(() => {
                expect(mockSetAlert).toHaveBeenCalledWith(errorMessage);
            });
        });

        describe("create snapshot form", () => {
            let descriptionInput;
            let submitButton;

            beforeEach(async () => {
                descriptionInput = getByLabelText(container, "Description");
                submitButton = getByTestId(container, "create-snapshot");
            });

            it("should send request to create new snapshot", async () => {
                // Prepare form
                const description = "Discovery";
                expect(submitButton.disabled).toBe(true);
                fireEvent.change(descriptionInput, {
                    target: { value: description },
                });
                expect(submitButton.disabled).toBe(false);

                // Create new snapshot
                fireEvent.click(submitButton);
                expect(mockAxios.post).toBeCalledWith(
                    "/reforis/snapshots/api/snapshots",
                    { description },
                    expect.anything()
                );
            });

            it("should handle API error on creating snapshot", async () => {
                // Request new snapshot
                fireEvent.change(descriptionInput, {
                    target: { value: "qwe" },
                });
                fireEvent.click(submitButton);

                // Handle error
                const errorMessage = "API didn't handle this well";
                mockJSONError(errorMessage);
                await wait(() => {
                    expect(mockSetAlert).toHaveBeenCalledWith(errorMessage);
                });
            });

            it("should validate new snapshot description", async () => {
                fireEvent.change(descriptionInput, { target: { value: "" } });
                expect(
                    getByText(container, "Description is required.")
                ).toBeDefined();
                expect(submitButton.disabled).toBe(true);
            });
        });
    });
});
