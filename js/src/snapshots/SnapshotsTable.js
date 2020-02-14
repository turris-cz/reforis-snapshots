/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { Button } from "foris";

import "./SnapshotsTable.css";

const snapshotShape = PropTypes.shape({
    number: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
});

SnapshotsTable.propTypes = {
    snapshots: PropTypes.arrayOf(snapshotShape).isRequired,
    rollbackSnapshot: PropTypes.func.isRequired,
    deleteSnapshot: PropTypes.func.isRequired,
};

export default function SnapshotsTable({ snapshots, rollbackSnapshot, deleteSnapshot }) {
    return (
        <div className="table-responsive">
            <table className="table table-hover snapshots-table">
                <thead>
                    <tr>
                        <th scope="col" className="text-center">{_("Number")}</th>
                        <th scope="col" className="text-center">{_("Type")}</th>
                        <th scope="col">{_("Description")}</th>
                        <th scope="col" className="snaphots-table-created-at">{_("Created at")}</th>
                        <th scope="col" className="text-center">{_("Size")}</th>
                        <th scope="col" aria-label={_("Rollback")} />
                        <th scope="col" aria-label={_("Delete")} />
                    </tr>
                </thead>
                <tbody>
                    {snapshots.map(
                        (snapshot) => (
                            <SnapshotRow
                                key={snapshot.number}
                                snapshot={snapshot}
                                rollbackSnapshot={() => rollbackSnapshot(snapshot.number)}
                                deleteSnapshot={() => deleteSnapshot({ suffix: snapshot.number })}
                            />
                        ),
                    )}
                </tbody>
            </table>
        </div>
    );
}

SnapshotRow.propTypes = {
    snapshot: snapshotShape.isRequired,
    rollbackSnapshot: PropTypes.func.isRequired,
    deleteSnapshot: PropTypes.func.isRequired,
};

function SnapshotRow({ snapshot, rollbackSnapshot, deleteSnapshot }) {
    return (
        <tr>
            <td className="text-center">{snapshot.number}</td>
            <td className="text-center">{snapshot.type}</td>
            <td>{snapshot.description}</td>
            <td className="text-center">{snapshot.created}</td>
            <td className="text-center">{snapshot.size}</td>
            <td className="text-center">
                <Button className="btn-sm btn-primary" onClick={rollbackSnapshot}>
                    <i className="fa fa-undo mr-2 snapshots-table-delete-icon" />
                    {_("Rollback")}
                </Button>
            </td>
            <td className="text-center">
                <Button className="btn-sm btn-danger" onClick={deleteSnapshot}>
                    <i className="fa fa-trash-alt mr-2 snapshots-table-delete-icon" />
                    {_("Delete")}
                </Button>
            </td>
        </tr>
    );
}
