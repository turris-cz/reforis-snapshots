/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";

import {
    API_STATE,
    Spinner,
    ErrorMessage,
    useCustomizationContext,
} from "foris";

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

const SNAPSHOTS_INTRO = _(
    "This is an addition to Schnapps command-line utility which can provide more <a href='https://docs.turris.cz/geek/schnapps/schnapps/#what-you-can-do-with-schnapps' target='_blank' rel='noopener noreferrer'>advanced options<sup><i class='fas fa-external-link-alt link-outside-icon fa-xs'></i></a>."
);

const SNAPSHOTS_INTRO_CUSTOM = _(
    "This is an addition to Schnapps command-line utility."
);

export default function Snapshots({ ws }) {
    const [snapshots, setSnapshots] = useState([]);

    const [getState, getSnapshots] = useGetSnapshots(setSnapshots);
    useUpdateSnapshotsOnAdd(ws, getSnapshots);

    const [, createSnapshot] = useCreateSnapshot();

    const [, rollbackSnapshot] = useRollbackSnapshot();
    useUpdateSnapshotsOnRollback(ws, getSnapshots);

    const [, deleteSnapshot] = useDeleteSnapshot();
    useUpdateSnapshotsOnDelete(ws, setSnapshots);

    const { isCustomized } = useCustomizationContext();

    let componentContent;
    if (getState === API_STATE.INIT || [getState].includes(API_STATE.SENDING)) {
        componentContent = <Spinner />;
    } else if (getState === API_STATE.ERROR) {
        componentContent = <ErrorMessage />;
    } else {
        componentContent = (
            <>
                <CreateSnapshotForm createSnapshot={createSnapshot} />
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
            {isCustomized ? (
                <p>{SNAPSHOTS_INTRO_CUSTOM}</p>
            ) : (
                <p
                    dangerouslySetInnerHTML={{
                        __html: SNAPSHOTS_INTRO,
                    }}
                />
            )}
            {componentContent}
        </>
    );
}
