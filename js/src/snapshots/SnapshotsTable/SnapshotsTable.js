/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

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
        <div className="table-responsive">
            <table className="table table-hover snapshots-table">
                <thead>
                    <tr>
                        <th scope="col" className="text-center">
                            {_("#")}
                        </th>
                        <th scope="col">{_("Description")}</th>
                        <th scope="col" className="snapshots-table-created-at">
                            {_("Created at")}
                        </th>
                        <th scope="col" className="text-center">
                            {_("Size")}
                        </th>
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
                                deleteSnapshot({ suffix: snapshot.number })
                            }
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
