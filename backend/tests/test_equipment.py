from tests.conftest import auth_header

async def test_list_equipments_requires_authentication(client):
    response = await client.get("/equipments")
    assert response.status_code == 401
    
async def test_list_equipments_any_role(client, seeded_users):
    response = await client.get("/equipments", headers=auth_header(seeded_users["auditor"]))
    assert response.status_code == 200
    
async def test_create_equipment_forbidden(client, seeded_users, seeded_hospital):
    payload = {
        "serial_number": "TEST-001",
        "model": "Test",
        "charge_level": 50,
        "hospital_id": seeded_hospital.id,
        "status": "In-Use",
    }
    response = await client.post("/equipments", json=payload, headers=auth_header(seeded_users["technician"]))
    assert response.status_code == 403


async def test_admin_create_equipment(client, seeded_users, seeded_hospital):
    payload = {
        "serial_number": "TEST-001",
        "model": "Test",
        "charge_level": 50,
        "hospital_id": seeded_hospital.id,
        "status": "In-Use",
    }
    response = await client.post("/equipments", json=payload, headers=auth_header(seeded_users["admin"]))
    assert response.status_code == 200
    assert response.json()["serial_number"] == "TEST-001"