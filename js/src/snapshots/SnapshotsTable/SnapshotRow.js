/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, toLocaleDateString } from "foris";

import { snapshotShape } from "./constants";

SnapshotRow.propTypes = {
    snapshot: snapshotShape.isRequired,
    rollbackSnapshot: PropTypes.func.isRequired,
    deleteSnapshot: PropTypes.func.isRequired,
};
export default function SnapshotRow({
    snapshot,
    rollbackSnapshot,
    deleteSnapshot,
}) {
    const createdAt = toLocaleDateString(snapshot.created, {
        inputFormat: "YYYY-MM-DD HH:mm:ss Z",
        outputFormat: "l LT",
    });

    const [deletingInProcess, setDeletingInProcess] = useState(false);
    function handleDeleteSnapshots() {
        setDeletingInProcess(true);
        deleteSnapshot();
    }

    const [rollbackInProcess, setRollbackInProcess] = useState(false);
    function handleRollbackSnapshots() {
        setRollbackInProcess(true);
        rollbackSnapshot();
    }

    const buttonsIsDisabled = deletingInProcess || rollbackInProcess;
    return (
        <tr>
            <td className="text-center">{snapshot.number}</td>
            <td>{snapshot.description}</td>
            <td>{createdAt}</td>
            <td>{snapshot.size}</td>
            <td className="text-right">
                <div
                    className="btn-group btn-group-sm"
                    role="group"
                    aria-label="Actions"
                >
                    <Button
                        className="btn btn-primary"
                        onClick={handleRollbackSnapshots}
                        loading={rollbackInProcess}
                        disabled={buttonsIsDisabled}
                    >
                        <i className="fa fa-undo" />
                        <p className="disappear-on-sm">{_("Rollback")}</p>
                    </Button>
                    <Button
                        className="btn btn-danger"
                        onClick={handleDeleteSnapshots}
                        loading={deletingInProcess}
                        disabled={buttonsIsDisabled}
                    >
                        <i className="fa fa-trash-alt" />
                        <p className="disappear-on-sm">{_("Delete")}</p>
                    </Button>
                </div>
            </td>
        </tr>
    );
}
