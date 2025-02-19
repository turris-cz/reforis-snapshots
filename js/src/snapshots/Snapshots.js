/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";

import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    API_STATE,
    Spinner,
    ErrorMessage,
    useCustomizationContext,
} from "foris";
import PropTypes from "prop-types";

import {
    useGetSnapshots,
    useCreateSnapshot,
    useDeleteSnapshot,
    useRollbackSnapshot,
    useUpdateSnapshotsOnNotification,
} from "./hooks";
import SnapshotsForm from "./SnapshotsForm";
import SnapshotsTable from "./SnapshotsTable";

Snapshots.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Snapshots({ ws }) {
    const [snapshots, setSnapshots] = useState([]);
    const { isCustomized } = useCustomizationContext();

    const [getState, getSnapshots] = useGetSnapshots(setSnapshots);

    const [, createSnapshot] = useCreateSnapshot();
    const [, rollbackSnapshot] = useRollbackSnapshot();
    const [, deleteSnapshot] = useDeleteSnapshot();

    useUpdateSnapshotsOnNotification(ws, "create", getSnapshots);
    useUpdateSnapshotsOnNotification(ws, "delete", getSnapshots);
    useUpdateSnapshotsOnNotification(ws, "rollback", getSnapshots);

    let componentContent;
    if (getState === API_STATE.INIT || getState === API_STATE.SENDING) {
        componentContent = <Spinner />;
    } else if (getState === API_STATE.ERROR) {
        componentContent = <ErrorMessage />;
    } else {
        componentContent = (
            <>
                <SnapshotsForm createSnapshot={createSnapshot} />
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
                <p>
                    {_("This is an addition to Schnapps command-line utility.")}
                </p>
            ) : (
                <p>
                    {_(
                        "This is an addition to Schnapps command-line utility which can provide more "
                    )}
                    <a
                        href="https://docs.turris.cz/geek/schnapps/schnapps/#what-you-can-do-with-schnapps"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {_("advanced options")}
                        <sup>
                            <FontAwesomeIcon
                                icon={faExternalLinkAlt}
                                className="fa-xs ms-1"
                            />
                        </sup>
                    </a>
                    .
                </p>
            )}
            {componentContent}
        </>
    );
}
