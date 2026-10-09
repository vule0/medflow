from enum import Enum

class EquipmentStatus(str, Enum):
    AVAILABLE = "Available"
    IN_USE = "In-Use"
    MAINTENANCE = "Maintenance"
    OFFLINE = "Offline"
    
class WorkOrderPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    CRITICAL = "Critical"
    
class WorkOrderStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In-Progress"
    COMPLETED = "Completed"
    FAILED = "Failed"
    
class UserRole(str, Enum):
    CLINICAL_ADMIN = "Clinical Admin"
    FIELD_TECHNICIAN = "Field Technician"
    AUDITOR = "Auditor"

class Permissions(str, Enum):
    EQUIPMENT_READ = "equipment:read"
    EQUIPMENT_WRITE = "equipment:write"
    
    
    HOSPITAL_READ = "hospital:read"
    HOSPITAL_WRITE = "hospital:write"
    
    WORK_ORDER_READ = "work_order:read"
    WORK_ORDER_WRITE = "work_order:write"
    WORK_ORDER_DELETE = "work_order:delete"
    WORK_ORDER_UPDATE_STATUS = "work_order:update_status"
    
    REPORT_READ = "report:read"
    REPORT_WRITE = "report:write"
    REPORT_DELETE = "report:delete"
    
    TECHNICIAN_READ = "technician:read"
    TECHNICIAN_WRITE = "technician:write"
    
    ANALYTICS_READ = "analytics:read"
    
    USER_READ = "user:read"
    USER_WRITE = "user:write"
    
    ADMIN_ROLE = "admin:role"
    ROLE_MANAGE = "role:manage"