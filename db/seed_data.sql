INSERT INTO hospitals (name, location_region, capacity, supervisor_id) 
VALUES 
('Bayview Medical Center', 'Tampa Bay', 450, 1), 
('Riverside General Hospital', 'Orlando', 320, 1), 
('Gulf Coast Regional Hospital', 'Fort Myers', 280, 2), 
('Sunrise Memorial Hospital', 'Miami', 500, 2), 
('Central Florida Medical', 'Lakeland', 220, 3); 


INSERT INTO technicians (name, hospital_id) 
VALUES 
('Daniel Carter', 1), 
('Marcus Thompson', 1), 
('Emily Rodriguez', 2), 
('James Wilson', 2), 
('Sophia Martinez', 3), 
('Anthony Nguyen', 3), 
('Kevin Johnson', 4), 
('Rachel Kim', 4), 
('Christopher Brown', 5), 
('Michael Davis', 5); 


INSERT INTO equipments 
(serial_number, model, status, charge_level, hospital_id) 
VALUES 
('EQ-BMC-0001', 'MedTech VitalScan X1', 'Available', 96, 1), 
('EQ-BMC-0002', 'MedTech VitalScan X1', 'In-Use', 74, 1), 
('EQ-BMC-0003', 'MedTech PTView 500', 'Maintenance', 31, 1), 
('EQ-BMC-0004', 'MedTech InfusionPro 200', 'Offline', 8, 1), 

('EQ-RGH-0001', 'MedTech VitalScan X2', 'Available', 88, 2), 
('EQ-RGH-0002', 'MedTech PTView 500', 'In-Use', 67, 2), 
('EQ-RGH-0003', 'MedTech InfusionPro 200', 'Maintenance', 24, 2), 

('EQ-GCR-0001', 'MedTech VitalScan X1', 'Available', 93, 3), 
('EQ-GCR-0002', 'MedTech PTView 500', 'In-Use', 58, 3), 
('EQ-GCR-0003', 'MedTech InfusionPro 300', 'Offline', 5, 3), 

('EQ-SMH-0001', 'MedTech VitalScan X2', 'In-Use', 81, 4), 
('EQ-SMH-0002', 'MedTech PTView 500', 'Available', 97, 4), 
('EQ-SMH-0003', 'MedTech InfusionPro 300', 'Maintenance', 18, 4), 

('EQ-CFM-0001', 'MedTech VitalScan X1', 'Available', 91, 5), 
('EQ-CFM-0002', 'MedTech PTView 500', 'In-Use', 63, 5), 
('EQ-CFM-0003', 'MedTech InfusionPro 200', 'Offline', 11, 5); 


INSERT INTO work_orders 
(title, priority, status, equipment_id, technician_id) 
VALUES 
('Routine inspection - VitalScan X1', 'Low', 'Pending', 1, 1), 
('Battery replacement required', 'Critical', 'In-Progress', 4, 2), 
('Patient monitor calibration', 'Medium', 'Completed', 3, 1), 
('Infusion pump diagnostic check', 'Critical', 'Pending', 7, 4), 
('Preventive maintenance inspection', 'Low', 'Completed', 5, 3), 
('Patient monitor sensor replacement', 'Medium', 'In-Progress', 6, 4), 
('Offline equipment investigation', 'Critical', 'Pending', 10, 6), 
('VitalScan software update', 'Low', 'Completed', 8, 5), 
('Battery health inspection', 'Medium', 'Pending', 9, 6), 
('Emergency equipment recovery', 'Critical', 'In-Progress', 13, 8), 
('Routine patient monitor inspection', 'Low', 'Completed', 12, 7), 
('Infusion pump power failure', 'Critical', 'Failed', 16, 9), 
('VitalScan preventive maintenance', 'Medium', 'Pending', 14, 9), 
('Patient monitor connectivity issue', 'Medium', 'In-Progress', 15, 10), 
('Offline equipment diagnostic', 'Critical', 'Pending', 16, 10); 


INSERT INTO service_reports 
(work_order_id, file_url, notes, created_at) 
VALUES 
(3, 
 's3://medflow-service-reports/reports/3/calibration-report.txt', 
 'Patient monitor calibration completed successfully. All sensors are within acceptable operating range.', 
 '2026-09-25 09:15:00'), 

(5, 
 's3://medflow-service-reports/reports/5/inspection-report.txt', 
 'Preventive maintenance completed. No hardware issues detected.', 
 '2026-09-26 11:30:00'), 

(8, 
 's3://medflow-service-reports/reports/8/software-update.txt', 
 'Software updated to the latest approved version. Device restarted successfully.', 
 '2026-09-27 14:20:00'), 

(11, 
 's3://medflow-service-reports/reports/11/monitor-inspection.txt', 
 'Routine inspection completed. Device passed all diagnostic checks.', 
 '2026-09-28 10:45:00'), 

(2, 
 's3://medflow-service-reports/reports/2/battery-replacement.txt', 
 'Battery capacity significantly below recommended threshold. Replacement required.', 
 '2026-09-29 08:30:00'), 

(10, 
 's3://medflow-service-reports/reports/10/emergency-recovery.txt', 
 'Equipment recovered from offline state. Additional diagnostics recommended.', 
 '2026-09-29 16:10:00'), 

(12, 
 's3://medflow-service-reports/reports/12/power-failure.txt', 
 'Unable to restore equipment after power-cycle procedure. Hardware inspection required.', 
 '2026-09-30 13:05:00');