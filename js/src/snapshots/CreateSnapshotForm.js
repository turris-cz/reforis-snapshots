/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";

import {
    SubmitButton,
    SUBMIT_BUTTON_STATES,
    TextInput,
    useForm,
    formFieldsSize,
} from "foris";
import PropTypes from "prop-types";

CreateSnapshotForm.propTypes = {
    createSnapshot: PropTypes.func.isRequired,
};

export default function CreateSnapshotForm({ createSnapshot }) {
    const [formState, formChangeHandler, reloadForm] = useForm(validator);
    const [errorFeedback, setErrorFeedback] = useState(false);
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
            <form onSubmit={handleSubmit} className="mb-3 mb-md-0">
                <h2>{_("Create Snapshot")}</h2>
                <TextInput
                    label={_("Description")}
                    maxLength="50"
                    value={formState.data.description}
                    error={errorFeedback ? formErrors.description : ""}
                    onChange={formChangeHandler((value) => ({
                        description: { $set: value },
                    }))}
                    onFocus={() => setErrorFeedback(true)}
                />
                <div className="text-end">
                    <SubmitButton
                        data-testid="create-snapshot"
                        label={_("Create")}
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
