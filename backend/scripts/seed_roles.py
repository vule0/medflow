import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionLocal
from app.models import Role, RolePermissions, UserRole, Permissions
from app.permissions import ROLE_PERMISSIONS

async def seed_roles():
    async with AsyncSessionLocal() as db:

        for user_role, permissions in ROLE_PERMISSIONS.items():

            # Check whether role already exists
            result = await db.execute(
                select(Role).where(Role.name == user_role.value)
            )

            role = result.scalar_one_or_none()

            # Create role if it doesn't exist
            if role is None:
                role = Role(
                    name=user_role.value
                )

                db.add(role)
                await db.flush()

                print(f"Created role: {role.name}")

            else:
                print(f"Role already exists: {role.name}")

            # Get existing permissions
            result = await db.execute(
                select(RolePermissions).where(
                    RolePermissions.role_id == role.id
                )
            )

            existing_permissions = {
                role_permission.permission
                for role_permission in result.scalars().all()
            }

            # Add missing permissions
            for permission in permissions:

                if permission not in existing_permissions:
                    db.add(
                        RolePermissions(
                            role_id=role.id,
                            permission=permission,
                        )
                    )

                    print(
                        f"  Added permission: {permission.value}"
                    )

        await db.commit()



if __name__ == "__main__":
    asyncio.run(seed_roles())