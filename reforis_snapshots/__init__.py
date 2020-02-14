#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from pathlib import Path
from http import HTTPStatus

from flask import Blueprint, current_app, jsonify, request
from flask_babel import gettext as _

from reforis.foris_controller_api.utils import log_error, validate_json, APIError

# pylint: disable=invalid-name
blueprint = Blueprint(
    'Snapshots',
    __name__,
    url_prefix='/snapshots/api',
)

BASE_DIR = Path(__file__).parent

# pylint: disable=invalid-name
snapshots = {
    'blueprint': blueprint,
    # Define {python_module_name}/js/app.min.js
    # See https://gitlab.labs.nic.cz/turris/reforis/reforis-distutils/blob/master/reforis_distutils/__init__.py#L11
    'js_app_path': 'reforis_snapshots/js/app.min.js',
    'translations_path': BASE_DIR / 'translations',
}


@blueprint.route('/snapshots', methods=['GET'])
def get_snapshots():
    return jsonify(current_app.backend.perform('schnapps', 'list')['snapshots'])


@blueprint.route('/snapshots', methods=['POST'])
def create_snapshot():
    validate_json(request.json, {'description': str})

    response = current_app.backend.perform('schnapps', 'create', request.json)
    if response.get('result') is not True:
        raise APIError(_('Cannot create snapshot.'), HTTPStatus.INTERNAL_SERVER_ERROR)

    return jsonify(response), HTTPStatus.ACCEPTED


@blueprint.route('/snapshots/<int:snapshot_number>', methods=['DELETE'])
def delete_snapshot(snapshot_number):
    response = current_app.backend.perform('schnapps', 'delete', {'number': snapshot_number})
    if response.get('result') is not True:
        raise APIError(_('Cannot delete snapshot.'), HTTPStatus.INTERNAL_SERVER_ERROR)

    return '', HTTPStatus.NO_CONTENT


@blueprint.route('/snapshots/<int:snapshot_number>/rollback', methods=['PUT'])
def rollback_to_snapshot(snapshot_number):
    response = current_app.backend.perform('schnapps', 'rollback', {'number': snapshot_number})
    if response.get('result') is not True:
        raise APIError(_('Cannot rollback to snapshot.'), HTTPStatus.INTERNAL_SERVER_ERROR)

    return '', HTTPStatus.NO_CONTENT
