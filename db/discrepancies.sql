INSERT INTO work_orders
(title, priority, status, equipment_id, technician_id)
VALUES

-- Equipment at Bayview (Hospital 1)
-- Technician belongs to Riverside (Hospital 2)
('Emergency service - VitalScan X1', 'Critical', 'Pending', 1, 3),

-- Equipment at Riverside (Hospital 2)
-- Technician belongs to Gulf Coast (Hospital 3)
('Patient monitor relocation inspection', 'Medium', 'In-Progress', 5, 5),

-- Equipment at Gulf Coast (Hospital 3)
-- Technician belongs to Sunrise Memorial (Hospital 4)
('Infusion pump emergency repair', 'Critical', 'Pending', 10, 7),

-- Equipment at Sunrise Memorial (Hospital 4)
-- Technician belongs to Central Florida Medical Pavilion (Hospital 5)
('Patient monitor diagnostic service', 'Medium', 'Pending', 12, 9),

-- Equipment at Central Florida Medical Pavilion (Hospital 5)
-- Technician belongs to Bayview (Hospital 1)
('Offline equipment recovery', 'Critical', 'In-Progress', 16, 1);