from app.models import UserRole, Permissions


ROLE_PERMISSIONS: dict[UserRole, set[Permissions]] = {
    UserRole.CLINICAL_ADMIN: {
        Permissions.EQUIPMENT_READ,
        Permissions.EQUIPMENT_WRITE,
        
        Permissions.HOSPITAL_READ,
        Permissions.HOSPITAL_WRITE,
        
        Permissions.WORK_ORDER_READ,
        Permissions.WORK_ORDER_WRITE,
        Permissions.WORK_ORDER_DELETE,

        Permissions.REPORT_READ,
        Permissions.REPORT_WRITE,
        Permissions.REPORT_DELETE,
        
        Permissions.TECHNICIAN_READ,
        Permissions.TECHNICIAN_WRITE,
        
        Permissions.ANALYTICS_READ,
        Permissions.USER_READ,
        Permissions.USER_WRITE,
        Permissions.ROLE_MANAGE,
    },

    UserRole.FIELD_TECHNICIAN: {
        Permissions.EQUIPMENT_READ,
        Permissions.WORK_ORDER_READ,
        Permissions.WORK_ORDER_WRITE,
        Permissions.WORK_ORDER_UPDATE_STATUS,
        Permissions.REPORT_READ,
        Permissions.REPORT_WRITE,
        Permissions.ANALYTICS_READ
    },

    UserRole.AUDITOR: {
        Permissions.EQUIPMENT_READ,
        Permissions.WORK_ORDER_READ,
        Permissions.ANALYTICS_READ,
        Permissions.REPORT_READ,
        Permissions.HOSPITAL_READ,
        Permissions.TECHNICIAN_READ
    },
}