/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import {
    SubmitButton,
    SUBMIT_BUTTON_STATES,
    TextInput,
    useForm,
    formFieldsSize,
} from "foris";

CreateSnapshotForm.propTypes = {
    createSnapshot: PropTypes.func.isRequired,
};

export default function CreateSnapshotForm({ createSnapshot }) {
    const [formState, formChangeHandler, reloadForm] = useForm(validator);
    const formData = formState.data;
    const formErrors = formState.errors || {};
    useEffect(() => {
        reloadForm({ description: "" });
    }, [reloadForm]);

    function handleSubmit(event) {
        event.preventDefault();
        createSnapshot({ data: { description: formState.data.description } });
    }

    if (!formData) {
        return null;
    }

    return (
        <div className={formFieldsSize}>
            <form onSubmit={handleSubmit}>
                <h3>{_("Create new snapshot")}</h3>
                <TextInput
                    label={_("Description")}
                    maxLength="50"
                    value={formState.data.description}
                    error={formErrors.description}
                    onChange={formChangeHandler((value) => ({
                        description: { $set: value },
                    }))}
                />
                <div className="text-right">
                    <SubmitButton
                        disabled={Object.keys(formErrors).length > 0}
                        state={SUBMIT_BUTTON_STATES.READY}
                    />
                </div>
            </form>
        </div>
    );
}

function validator(formData) {
    if (!formData.description) {
        return { description: _("Description is required.") };
    }
    return undefined;
}
