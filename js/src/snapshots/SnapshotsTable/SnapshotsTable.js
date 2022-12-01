/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";
import { formFieldsSize } from "foris";

import "./SnapshotsTable.css";
import SnapshotRow from "./SnapshotRow";
import { snapshotShape } from "./constants";

SnapshotsTable.propTypes = {
    snapshots: PropTypes.arrayOf(snapshotShape).isRequired,
    rollbackSnapshot: PropTypes.func.isRequired,
    deleteSnapshot: PropTypes.func.isRequired,
};

export default function SnapshotsTable({
    snapshots,
    rollbackSnapshot,
    deleteSnapshot,
}) {
    return (
        <div className={formFieldsSize}>
            <h2>{_("Available Snapshots")}</h2>
            {snapshots.length === 0 ? (
                <p className="text-muted text-center">
                    {_("No snapshots found.")}
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover snapshots-table">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col" className="text-center">
                                    {_("#")}
                                </th>
                                <th scope="col">{_("Description")}</th>
                                <th scope="col">{_("Created at")}</th>
                                <th scope="col">{_("Size")}</th>
                                <th scope="col" aria-label={_("Actions")} />
                            </tr>
                        </thead>
                        <tbody>
                            {snapshots.map((snapshot) => (
                                <SnapshotRow
                                    key={snapshot.number}
                                    snapshot={snapshot}
                                    rollbackSnapshot={() =>
                                        rollbackSnapshot(snapshot.number)
                                    }
                                    deleteSnapshot={() =>
                                        deleteSnapshot({
                                            suffix: snapshot.number,
                                        })
                                    }
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
