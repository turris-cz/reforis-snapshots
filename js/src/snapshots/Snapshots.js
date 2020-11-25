/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import { API_STATE, Spinner, ErrorMessage, formFieldsSize } from "foris";

import {
    useGetSnapshots,
    useUpdateSnapshotsOnAdd,
    useCreateSnapshot,
    useDeleteSnapshot,
    useUpdateSnapshotsOnDelete,
    useRollbackSnapshot,
    useUpdateSnapshotsOnRollback,
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
            <div className={formFieldsSize}>
                <CreateSnapshotForm createSnapshot={createSnapshot} />
                <h2>{_("Available Snapshots")}</h2>
                <SnapshotsTable
                    snapshots={snapshots}
                    rollbackSnapshot={rollbackSnapshot}
                    deleteSnapshot={deleteSnapshot}
                />
            </div>
        );
    }

    return (
        <>
            <h1>{_("Snapshots")}</h1>
            <p
                dangerouslySetInnerHTML={{
                    __html: _(
                        "This is an addition to Schnapps command-line utility which can provide more <a href='https://docs.turris.cz/geek/schnapps/schnapps/#what-you-can-do-with-schnapps' target='_blank' rel='noopener noreferrer'>advanced options<sup><i class='fas fa-external-link-alt link-outside-icon fa-xs'></i></a>."
                    ),
                }}
            />
            {componentContent}
        </>
    );
}
