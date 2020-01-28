/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import Schnapps from "./schnapps/Schnapps";

const SchnappsPlugin = {
    name: _("Schnapps"),
    submenuId: "administration",
    weight: 100,
    path: "/schnapps",
    component: Schnapps,
};

ForisPlugins.push(SchnappsPlugin);
