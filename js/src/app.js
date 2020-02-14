/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import Snapshots from "./snapshots/Snapshots";

const SnapshotsPlugin = {
    name: _("Snapshots"),
    submenuId: "administration",
    weight: 100,
    path: "/snapshots",
    component: Snapshots,
};

ForisPlugins.push(SnapshotsPlugin);
