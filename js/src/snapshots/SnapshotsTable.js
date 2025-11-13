/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
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
import { formFieldsSize, RichTable, ThreeDotsMenu } from "foris";
import moment from "moment";
import PropTypes from "prop-types";

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
    const columns = [
        {
            accessorKey: "number",
            header: "#",
        },
        {
            accessorKey: "description",
            header: _("Description"),
        },
        {
            accessorKey: "created",
            header: _("Created at"),
            cell: ({ getValue }) => {
                const time = getValue();
                return moment(time, "YYYY-MM-DD HH:mm:ss Z")
                    .locale(ForisTranslations.locale)
                    .format("l LT");
            },
        },
        {
            accessorKey: "size",
            header: _("Size"),
        },
        {
            accessorKey: "actions",
            header: _("Actions"),
            headerIsHidden: true,
            className: "text-end",
            cell: renderThreeDotsMenu.bind(
                null,
                rollbackSnapshot,
                deleteSnapshot
            ),
        },
    ];

    const sortedSnapshots = snapshots
        .map((snapshot) => ({
            number: snapshot.number,
            description: snapshot.description,
            created: snapshot.created,
            size: snapshot.size,
        }))
        .sort((a, b) => new Date(b.created) - new Date(a.created));

    return (
        <div className={formFieldsSize}>
            <h2>{_("Available Snapshots")}</h2>
            {snapshots.length === 0 ? (
                <p className="text-muted text-center">
                    {_("No snapshots found.")}
                </p>
            ) : (
                <RichTable
                    data={sortedSnapshots}
                    columns={columns}
                    withPagination
                />
            )}
        </div>
    );
}

function renderThreeDotsMenu(rollbackSnapshot, deleteSnapshot, { row }) {
    const { number } = row.original;

    const handleDownloadSnapshot = () => {
        window.location.href = `/snapshots/snapshot.tar.gz?num=${number}`;
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
            onClick: rollbackSnapshot.bind(null, number),
            icon: faUndo,
            text: _("Rollback"),
        },
        {
            id: "delete",
            onClick: deleteSnapshot.bind(null, { suffix: number }),
            icon: faTrash,
            text: _("Delete"),
        },
    ];

    return (
        <ThreeDotsMenu data-testid="three-dots-menu">
            {threeDotsMenuItems.map((item) => (
                <button
                    type="button"
                    key={item.id}
                    onClick={item.onClick}
                    className="dropdown-item"
                    data-testid={`three-dots-menu-${item.id}`}
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
    );
}
