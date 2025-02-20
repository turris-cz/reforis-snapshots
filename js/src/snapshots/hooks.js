/*
 * Copyright (C) 2020-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect } from "react";

import {
    useAlert,
    useWSForisModule,
    useAPIGet,
    useAPIPost,
    useAPIDelete,
    useAPIPut,
    API_STATE,
    ALERT_TYPES,
} from "foris";

import API_URLs from "API";

export function useGetSnapshots(setSnapshots) {
    const [getSnapshotsResponse, getSnapshots] = useAPIGet(API_URLs.snapshots);

    useEffect(() => {
        getSnapshots();
    }, [getSnapshots]);

    useEffect(() => {
        if (getSnapshotsResponse.state === API_STATE.SUCCESS) {
            setSnapshots(getSnapshotsResponse.data || []);
        }
    }, [getSnapshotsResponse, setSnapshots]);

    return [getSnapshotsResponse.state, getSnapshots];
}

export function useUpdateSnapshotsOnNotification(ws, action, getSnapshots) {
    const [notification] = useWSForisModule(ws, "schnapps", action);

    useEffect(() => {
        if (!notification) {
            return;
        }
        getSnapshots();
    }, [notification, getSnapshots]);
}

function useHandleAPIResponse(apiResponse, successMessage) {
    const [setAlert] = useAlert();

    useEffect(() => {
        if (apiResponse.state === API_STATE.SUCCESS) {
            setAlert(successMessage, ALERT_TYPES.SUCCESS);
        }
        if (apiResponse.state === API_STATE.ERROR) {
            setAlert(apiResponse.data);
        }
    }, [apiResponse, setAlert, successMessage]);
}

export function useCreateSnapshot() {
    const [postSnapshotResponse, postSnapshot] = useAPIPost(
        `${API_URLs.snapshots}`
    );
    useHandleAPIResponse(
        postSnapshotResponse,
        _("Snapshot was created successfully.")
    );
    return [postSnapshotResponse.state, postSnapshot];
}

export function useDeleteSnapshot() {
    const [deleteSnapshotResponse, deleteSnapshot] = useAPIDelete(
        `${API_URLs.snapshots}`
    );
    useHandleAPIResponse(
        deleteSnapshotResponse,
        _("Snapshot was deleted successfully.")
    );
    return [deleteSnapshotResponse.state, deleteSnapshot];
}

export function useRollbackSnapshot() {
    const [putSnapshotResponse, putSnapshot] = useAPIPut(
        `${API_URLs.snapshots}`
    );
    useHandleAPIResponse(
        putSnapshotResponse,
        _("Rollback was successful. Please reboot your device.")
    );

    function rollbackSnapshot(snapshotNumber) {
        return putSnapshot({ suffix: `${snapshotNumber}/rollback` });
    }

    return [putSnapshotResponse.state, rollbackSnapshot];
}
