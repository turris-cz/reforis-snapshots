/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import { API_STATE, Spinner, ErrorMessage } from "foris";

import {
    useGetSnapshots, useUpdateSnapshotsOnAdd, useCreateSnapshot, useDeleteSnapshot,
    useUpdateSnapshotsOnDelete, useRollbackSnapshot, useUpdateSnapshotsOnRollback,
} from "./hooks";
import CreateSnapshotForm from "./CreateSnapshotForm";
import SnapshotsTable from "./SnapshotsTable/SnapshotsTable";

Snapshots.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Snapshots({ ws }) {
    const [snapshots, setSnapshots] = useState([]);

    const [getState, getSnapshots] = useGetSnapshots(setSnapshots);
    useUpdateSnapshotsOnAdd(ws, getSnapshots);

    const [, createSnapshot] = useCreateSnapshot();

    const [, rollbackSnapshot] = useRollbackSnapshot();
    useUpdateSnapshotsOnRollback(ws, getSnapshots);

    const [, deleteSnapshot] = useDeleteSnapshot();
    useUpdateSnapshotsOnDelete(ws, setSnapshots);

    let componentContent;
    if (getState === API_STATE.INIT || [getState].includes(API_STATE.SENDING)) {
        componentContent = <Spinner />;
    } else if (getState === API_STATE.ERROR) {
        componentContent = <ErrorMessage />;
    } else {
        componentContent = (
            <>
                <CreateSnapshotForm createSnapshot={createSnapshot} />
                <h3>{_("Available Snapshots")}</h3>
                <SnapshotsTable
                    snapshots={snapshots}
                    rollbackSnapshot={rollbackSnapshot}
                    deleteSnapshot={deleteSnapshot}
                />
            </>
        );
    }

    return (
        <>
            <h1>{_("Snapshots")}</h1>
            <p
                dangerouslySetInnerHTML={{
                    __html: _("This is an addition to Schnapps command-line utility which can provide more <a href='https://docs.turris.cz/geek/schnapps/schnapps/#what-you-can-do-with-schnapps'>advanced options</a>."),
                }}
            />
            {componentContent}
        </>
    );
}
