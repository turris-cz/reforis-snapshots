/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";

import { Button, toLocaleDateString } from "foris";
import PropTypes from "prop-types";

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
    const handleDeleteSnapshots = () => {
        setDeletingInProcess(true);
        deleteSnapshot();
    };

    const [rollbackInProcess, setRollbackInProcess] = useState(false);
    const handleRollbackSnapshots = () => {
        setRollbackInProcess(true);
        rollbackSnapshot();
    };

    const handleDonwloadSnapshot = () => {
        window.location.href = `/snapshot.tar.gz?num=${snapshot.number}`;
    };

    const { number, description, size } = snapshot;
    const buttonsIsDisabled = deletingInProcess || rollbackInProcess;

    return (
        <tr>
            <td className="text-center align-middle">{number}</td>
            <td className="align-middle">{description}</td>
            <td className="align-middle">{createdAt}</td>
            <td className="align-middle">{size}</td>
            <td className="text-right align-middle">
                <div
                    className="btn-group btn-group-sm mb-0"
                    role="group"
                    aria-label={_("Actions")}
                >
                    <Button
                        className="btn btn-primary"
                        onClick={handleDonwloadSnapshot}
                        disabled={buttonsIsDisabled}
                    >
                        <span className="d-xl-none">
                            <i className="fas fa-download" />
                        </span>
                        <span className="d-none d-xl-flex">
                            <i className="fas fa-download mr-1" />
                            {_("Download")}
                        </span>
                    </Button>
                    <Button
                        className="btn btn-warning"
                        onClick={handleRollbackSnapshots}
                        loading={rollbackInProcess}
                        disabled={buttonsIsDisabled}
                    >
                        <span className="d-xl-none">
                            <i className="fa fa-undo" />
                        </span>
                        <span className="d-none d-xl-flex">
                            <i className="fa fa-undo mr-1" />
                            {_("Rollback")}
                        </span>
                    </Button>
                    <Button
                        className="btn btn-danger"
                        onClick={handleDeleteSnapshots}
                        loading={deletingInProcess}
                        disabled={buttonsIsDisabled}
                    >
                        <span className="d-xl-none">
                            <i className="fa fa-trash-alt" />
                        </span>
                        <span className="d-none d-xl-flex">
                            <i className="fa fa-trash-alt mr-1" />
                            {_("Delete")}
                        </span>
                    </Button>
                </div>
            </td>
        </tr>
    );
}
