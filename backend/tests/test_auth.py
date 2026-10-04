from tests.conftest import auth_header

async def test_login_succeeds_with_correct_credentials(client, seeded_users):
    response = await client.post(
        "/auth/token",
        data={"username": "test_admin", "password": "pw"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


async def test_login_fails_with_wrong_password(client, seeded_users):
    response = await client.post(
        "/auth/token",
        data={"username": "test_admin", "password": "wrong-password"},
    )
    assert response.status_code == 401


async def test_register_requires_admin(client, seeded_users):
    payload = {"username": "new_user", "password": "TestPass123!", "role": "Field Technician"}

    technician_response = await client.post(
        "/auth/register", json=payload, headers=auth_header(seeded_users["technician"])
    )
    assert technician_response.status_code == 403

    admin_response = await client.post(
        "/auth/register", json=payload, headers=auth_header(seeded_users["admin"])
    )
    assert admin_response.status_code == 201


async def test_register_rejects_case_insensitive_duplicate_username(client, seeded_users):
    payload = {"username": "TEST_ADMIN", "password": "SomePass123!", "role": "Field Technician"}
    response = await client.post("/auth/register", json=payload, headers=auth_header(seeded_users["admin"]))
    assert response.status_code == 400