#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from http import HTTPStatus
from reforis.test_utils import mock_backend_response


SNAPSHOTS_URL = '/snapshots/api/snapshots'
SNAPSHOT_URL = f"{SNAPSHOTS_URL}/1234"
ROLLBACK_SNAPSHOT_URL = f"{SNAPSHOTS_URL}/1234/rollback"
FACTORY_RESET_URL = f"{SNAPSHOTS_URL}/factory_reset"


@mock_backend_response({'schnapps': {'list': {'snapshots': ['foo', 'bar']}}})
def test_get_snapshots(client):
    response = client.get(SNAPSHOTS_URL)
    assert response.status_code == HTTPStatus.OK
    assert response.json == ['foo', 'bar']


@mock_backend_response({'schnapps': {'create': {'result': True}}})
def test_post_snapshot(client):
    response = client.post(
        SNAPSHOTS_URL, json={'description': 'Lorem ipsum dolor sit amet.'},
    )
    assert response.status_code == HTTPStatus.ACCEPTED
    assert response.json == {'result': True}


def test_post_snapshot_missing_description(client):
    response = client.post(
        SNAPSHOTS_URL, json={'foo': 'Lorem ipsum dolor sit amet.'},
    )
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {'description': 'Missing data for required field.'}


@mock_backend_response({'schnapps': {'create': {'result': True}}})
def test_post_snapshot_invalid_json(client):
    response = client.post(
        SNAPSHOTS_URL, json={'foo': 'Lorem ipsum dolor sit amet.'},
    )
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {'description': 'Missing data for required field.'}


@mock_backend_response({'schnapps': {'create': {'result': False}}})
def test_post_snapshot_backend_error(client):
    response = client.post(
        SNAPSHOTS_URL, json={'description': 'Lorem ipsum dolor sit amet.'},
    )
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot create snapshot.'


@mock_backend_response({'schnapps': {'delete': {'result': True}}})
def test_delete_device(client):
    response = client.delete(SNAPSHOT_URL)
    assert response.status_code == HTTPStatus.NO_CONTENT


@mock_backend_response({'schnapps': {'delete': {'result': False}}})
def test_delete_device_backend_error(client):
    response = client.delete(SNAPSHOT_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot delete snapshot.'


@mock_backend_response({'schnapps': {'rollback': {'result': True}}})
def test_rollback_snapshot(client):
    response = client.put(ROLLBACK_SNAPSHOT_URL)
    assert response.status_code == HTTPStatus.NO_CONTENT


@mock_backend_response({'schnapps': {'rollback': {'result': False}}})
def test_rollback_snapshot_backend_error(client):
    response = client.put(ROLLBACK_SNAPSHOT_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot rollback to snapshot.'


@mock_backend_response({'schnapps': {'factory_reset': {'result': True}}})
def test_factory_reset_snapshot(client):
    response = client.put(FACTORY_RESET_URL)
    assert response.status_code == HTTPStatus.NO_CONTENT


@mock_backend_response({'schnapps': {'factory_reset': {'result': False}}})
def test_factory_reset_snapshot_backend_error(client):
    response = client.put(FACTORY_RESET_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot perfom factory reset.'
