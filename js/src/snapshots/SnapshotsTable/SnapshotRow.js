/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import {
    faCloudArrowDown,
    faUndo,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toLocaleDateString, ThreeDotsMenu } from "foris";
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
    const { number, description, size, created } = snapshot;

    const createdAt = toLocaleDateString(created, {
        inputFormat: "YYYY-MM-DD HH:mm:ss Z",
        outputFormat: "l LT",
    });

    const handleDownloadSnapshot = () => {
        window.location.href = `/snapshot.tar.gz?num=${number}`;
    };

    const threeDotsMenuItems = [
        {
            id: "download",
            onClick: handleDownloadSnapshot,
            icon: faCloudArrowDown,
            text: _("Download"),
        },
        {
            id: "rollback",
            onClick: rollbackSnapshot,
            icon: faUndo,
            text: _("Rollback"),
        },
        {
            id: "delete",
            onClick: deleteSnapshot,
            icon: faTrash,
            text: _("Delete"),
        },
    ];

    return (
        <tr className="text-nowrap">
            <td className="text-center align-middle">{number}</td>
            <td className="align-middle">{description}</td>
            <td className="align-middle">{createdAt}</td>
            <td className="align-middle">{size}</td>
            <td className="text-end align-middle">
                <ThreeDotsMenu>
                    {threeDotsMenuItems.map((item) => (
                        <button
                            type="button"
                            key={item.id}
                            onClick={item.onClick}
                            className="dropdown-item"
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className="me-1"
                                width="1rem"
                                size="sm"
                            />
                            {item.text}
                        </button>
                    ))}
                </ThreeDotsMenu>
            </td>
        </tr>
    );
}
