
import pytest_asyncio

from app.models import Technician, WorkOrder, WorkOrderStatus, WorkOrderPriority, Equipment, EquipmentStatus
from app.schemas.work_order import WorkOrderUpdate
from tests.conftest import auth_header

@pytest_asyncio.fixture
async def seeded_work_order(db_session, seeded_hospital):
    equipment = Equipment(
        serial_number="EX-TEST-001",
        model="TEST MODEL V2",
        status=EquipmentStatus.IN_USE,
        charge_level=67,
        hospital_id=seeded_hospital.id
        )
    
    technician = Technician(name="Test Technician", hospital_id=seeded_hospital.id)
    db_session.add_all([equipment, technician])
    await db_session.commit()
    await db_session.refresh(equipment)
    await db_session.refresh(technician)
    
    work_order = WorkOrder(
        title="Test Work Order",
        priority=WorkOrderPriority.LOW,
        status=WorkOrderStatus.PENDING,
        equipment_id=equipment.id,
        technician_id=technician.id,
    )
    
    db_session.add(work_order)
    await db_session.commit()
    await db_session.refresh(work_order)
    return work_order
    
    
async def test_admin_can_update_status(client, seeded_users, seeded_work_order):
    response = await client.patch(
        f"/work_orders/{seeded_work_order.id}",
        json={"status": "Completed"},
        headers=auth_header(seeded_users["admin"]),
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Completed"
    
async def test_technician_can_update_status(client, seeded_users, seeded_work_order):
    response = await client.patch(
        f"/work_orders/{seeded_work_order.id}",
        json={"status": "Failed"},
        headers=auth_header(seeded_users["technician"]),
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Failed"
    
async def test_auditor_forbidden_from_updating_status(client, seeded_users, seeded_work_order):
    response = await client.patch(
        f"/work_orders/{seeded_work_order.id}",
        json={"status": "Completed"},
        headers=auth_header(seeded_users["auditor"]),
    )
    assert response.status_code == 403
    
    
async def test_nonexistent_work_order_returns_404(client, seeded_users):
    response = await client.patch(
        "/work_orders/999999",
        json={"status": "Completed"},
        headers=auth_header(seeded_users["admin"]),
    )
    assert response.status_code == 404