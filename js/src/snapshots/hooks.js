/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect, useCallback } from "react";

import {
    useAlert,
    useWSForisModule,
    useAPIGet,
    useAPIPost,
    useAPIDelete,
    useAPIPut,
    API_STATE,
} from "foris";

import API_URLs from "API";

export function useGetSnapshots(setSnapshots) {
    const [getSnapshotsResponse, getSnapshots] = useAPIGet(API_URLs.snapshots);

    useEffect(() => {
        getSnapshots();
    }, [getSnapshots]);

    useEffect(() => {
        if (getSnapshotsResponse.state === API_STATE.SUCCESS) {
            setSnapshots(getSnapshotsResponse.data);
        }
    }, [getSnapshotsResponse, setSnapshots]);

    return [getSnapshotsResponse.state, getSnapshots];
}

export function useUpdateSnapshotsOnAdd(ws, getSnapshots) {
    const [addNotification] = useWSForisModule(ws, "schnapps", "create");
    useEffect(() => {
        if (!addNotification) {
            return;
        }
        // Unfortunately, foris-controller-schnapps module doesn't provide all info about new
        // snapshot when it's created. Thus we need to refresh whole list to get a new one.
        getSnapshots();
    }, [addNotification, getSnapshots]);
}

export function useCreateSnapshot() {
    const [setAlert] = useAlert();

    const [postSnapshotResponse, postSnapshot] = useAPIPost(
        `${API_URLs.snapshots}`
    );
    useEffect(() => {
        if (postSnapshotResponse.state === API_STATE.ERROR) {
            setAlert(postSnapshotResponse.data);
        }
    }, [postSnapshotResponse, setAlert]);

    return [postSnapshotResponse.state, postSnapshot];
}

export function useDeleteSnapshot() {
    const [setAlert] = useAlert();

    const [deleteSnapshotResponse, deleteSnapshot] = useAPIDelete(
        `${API_URLs.snapshots}`
    );
    useEffect(() => {
        if (deleteSnapshotResponse.state === API_STATE.ERROR) {
            setAlert(deleteSnapshotResponse.data);
        }
    }, [deleteSnapshotResponse, setAlert]);

    return [deleteSnapshotResponse.state, deleteSnapshot];
}

export function useUpdateSnapshotsOnDelete(ws, setSnapshots) {
    const [deleteNotification] = useWSForisModule(ws, "schnapps", "delete");

    const removeSnapshotFromTable = useCallback(
        (number) => {
            setSnapshots((previousDevices) => {
                const snapshots = [...previousDevices];
                const deleteIndex = snapshots.findIndex(
                    (snapshot) => snapshot.number === number
                );
                if (deleteIndex !== -1) {
                    snapshots.splice(deleteIndex, 1);
                }
                return snapshots;
            });
        },
        [setSnapshots]
    );

    useEffect(() => {
        if (!deleteNotification) {
            return;
        }
        removeSnapshotFromTable(deleteNotification.number);
    }, [removeSnapshotFromTable, deleteNotification]);
}

export function useRollbackSnapshot() {
    const [setAlert] = useAlert();

    const [putSnapshotResponse, putSnapshot] = useAPIPut(
        `${API_URLs.snapshots}`
    );
    useEffect(() => {
        if (putSnapshotResponse.state === API_STATE.ERROR) {
            setAlert(putSnapshotResponse.data);
        }
    }, [putSnapshotResponse, setAlert]);

    function rollbackSnapshot(snapshotNumber) {
        return putSnapshot({ suffix: `${snapshotNumber}/rollback` });
    }

    return [putSnapshotResponse.state, rollbackSnapshot];
}

export function useUpdateSnapshotsOnRollback(ws, getSnapshots) {
    const [addNotification] = useWSForisModule(ws, "schnapps", "rollback");
    useEffect(() => {
        if (!addNotification) {
            return;
        }
        getSnapshots();
    }, [addNotification, getSnapshots]);
}
