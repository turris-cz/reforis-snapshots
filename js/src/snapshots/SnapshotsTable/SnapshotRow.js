/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { Button, toLocaleDateString } from "foris";

import { snapshotShape } from "./constants";

SnapshotRow.propTypes = {
    snapshot: snapshotShape.isRequired,
    rollbackSnapshot: PropTypes.func.isRequired,
    deleteSnapshot: PropTypes.func.isRequired,
};
export default function SnapshotRow({ snapshot, rollbackSnapshot, deleteSnapshot }) {
    const createdAt = toLocaleDateString(snapshot.created, {
        inputFormat: "YYYY-MM-DD HH:mm:ss Z",
        outputFormat: "l LT",
    });
    return (
        <tr>
            <td className="text-center">{snapshot.number}</td>
            <td>{snapshot.description}</td>
            <td className="text-center">{createdAt}</td>
            <td className="text-center">{snapshot.size}</td>
            <td className="text-center">
                <div className="btn-group" role="group" aria-label="Actions">
                    <Button className="btn btn-primary" onClick={rollbackSnapshot}>
                        <i className="fa fa-undo" />
                        <p className="disappear-on-sm">{_("Rollback")}</p>
                    </Button>
                    <Button className="btn btn-danger" onClick={deleteSnapshot}>
                        <i className="fa fa-trash-alt" />
                        <p className="disappear-on-sm">{_("Delete")}</p>
                    </Button>
                </div>
            </td>
        </tr>
    );
}
