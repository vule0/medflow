INSERT INTO hospitals ( id, name, location_region, capacity, supervisor_id) VALUES
    (1, 'Bayview Medical Center', 'Tampa Bay', 450, 1),
    (2, 'Riverside General Hospital', 'Orlando', 320, 1),
    (3, 'Gulf Coast Regional Hospital', 'Fort Myers', 280, 2),
    (4, 'Sunrise Memorial Hospital', 'Miami', 500, 2),
    (5, 'Central Florida Medical', 'Lakeland', 220, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO technicians ( id, name, hospital_id) VALUES
    (1, 'Daniel Carter', 1),
    (2, 'Marcus Thompson', 1),
    (3, 'Emily Rodriguez', 2),
    (4, 'James Wilson', 2),
    (5, 'Sophia Martinez', 3),
    (6, 'Anthony Nguyen', 3),
    (7, 'Kevin Johnson', 4),
    (8, 'Rachel Kim', 4),
    (9, 'Christopher Brown', 5),
    (10, 'Michael Davis', 5)
ON CONFLICT (id) DO NOTHING;



INSERT INTO equipments ( id, serial_number, model, status, charge_level, hospital_id) VALUES
    (1, 'EQ-BMC-0001', 'MedTech VitalScan X1', 'Available', 96, 1),
    (2, 'EQ-BMC-0002', 'MedTech VitalScan X1', 'In-Use', 74, 1),
    (3, 'EQ-BMC-0003', 'MedTech PTView 500', 'Maintenance', 31, 1),
    (4, 'EQ-BMC-0004', 'MedTech InfusionPro 200', 'Offline', 8, 1),

    (5, 'EQ-RGH-0001', 'MedTech VitalScan X2', 'Available', 88, 2),
    (6, 'EQ-RGH-0002', 'MedTech PTView 500', 'In-Use', 67, 2),
    (7, 'EQ-RGH-0003', 'MedTech InfusionPro 200', 'Maintenance', 24, 2),

    (8, 'EQ-GCR-0001', 'MedTech VitalScan X1', 'Available', 93, 3),
    (9, 'EQ-GCR-0002', 'MedTech PTView 500', 'In-Use', 58, 3),
    (10, 'EQ-GCR-0003', 'MedTech InfusionPro 300', 'Offline', 5, 3),

    (11, 'EQ-SMH-0001', 'MedTech VitalScan X2', 'In-Use', 81, 4),
    (12, 'EQ-SMH-0002', 'MedTech PTView 500', 'Available', 97, 4),
    (13, 'EQ-SMH-0003', 'MedTech InfusionPro 300', 'Maintenance', 18, 4),

    (14, 'EQ-CFM-0001', 'MedTech VitalScan X1', 'Available', 91, 5),
    (15, 'EQ-CFM-0002', 'MedTech PTView 500', 'In-Use', 63, 5),
    (16, 'EQ-CFM-0003', 'MedTech InfusionPro 200', 'Offline', 11, 5)
ON CONFLICT (id) DO NOTHING;



INSERT INTO work_orders ( id, title, priority, status, equipment_id, technician_id) VALUES
    (1, 'Routine inspection - VitalScan X1', 'Low', 'Pending', 1, 1),
    (2, 'Battery replacement required', 'Critical', 'In-Progress', 4, 2),
    (3, 'Patient monitor calibration', 'Medium', 'Completed', 3, 1),
    (4, 'Infusion pump diagnostic check', 'Critical', 'Pending', 7, 4),
    (5, 'Preventive maintenance inspection', 'Low', 'Completed', 5, 3),
    (6, 'Patient monitor sensor replacement', 'Medium', 'In-Progress', 6, 4),
    (7, 'Offline equipment investigation', 'Critical', 'Pending', 10, 6),
    (8, 'VitalScan software update', 'Low', 'Completed', 8, 5),
    (9, 'Battery health inspection', 'Medium', 'Pending', 9, 6),
    (10, 'Emergency equipment recovery', 'Critical', 'In-Progress', 13, 8),
    (11, 'Routine patient monitor inspection', 'Low', 'Completed', 12, 7),
    (12, 'Infusion pump power failure', 'Critical', 'Failed', 16, 9),
    (13, 'VitalScan preventive maintenance', 'Medium', 'Pending', 14, 9),
    (14, 'Patient monitor connectivity issue', 'Medium', 'In-Progress', 15, 10),
    (15, 'Offline equipment diagnostic', 'Critical', 'Pending', 16, 10)
ON CONFLICT (id) DO NOTHING;

-- DISCREPANCIES
INSERT INTO work_orders ( id, title, priority, status, equipment_id, technician_id) VALUES
    -- Equipment at Hospital 1 / Technician at Hospital 2
    (16, 'Emergency service - VitalScan X1', 'Critical', 'Pending', 1, 3),

    -- Equipment at Hospital 2 / Technician at Hospital 3
    (17, 'Patient monitor relocation inspection', 'Medium', 'In-Progress', 5, 5),

    -- Equipment at Hospital 3 / Technician at Hospital 4
    (18, 'Infusion pump emergency repair', 'Critical', 'Pending', 10, 7),

    -- Equipment at Hospital 4 / Technician at Hospital 5
    (19, 'Patient monitor diagnostic service', 'Medium', 'Pending', 12, 9),

    -- Equipment at Hospital 5 / Technician at Hospital 1
    (20, 'Offline equipment recovery', 'Critical', 'In-Progress', 16, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO service_reports ( id, work_order_id, file_url, notes, created_at) VALUES
    (
        1,
        3,
        'https://medflow-service-reports.s3/us-east-1.amazonaws/service_reports/3/calibration-report.txt',
        'Patient monitor calibration completed successfully. All sensors are within acceptable operating range.',
        '2026-09-25 09:15:00'
    ),
    (
        2,
        5,
        'https://medflow-service-reports.s3/us-east-1.amazonaws/service_reports/5/inspection-report.txt',
        'Preventive maintenance completed. No hardware issues detected.',
        '2026-09-26 11:30:00'
    ),
    (
        3,
        8,
        'https://medflow-service-reports.s3/us-east-1.amazonaws/service_reports/8/software-update.txt',
        'Software updated to the latest approved version. Device restarted successfully.',
        '2026-09-27 14:20:00'
    ),
    (
        4,
        11,
        'https://medflow-service-reports.s3/us-east-1.amazonaws/service_reports/11/monitor-inspection.txt',
        'Routine inspection completed. Device passed all diagnostic checks.',
        '2026-09-28 10:45:00'
    ),
    (
        5,
        2,
        'https://medflow-service-reports.s3/us-east-1.amazonaws/service_reports/2/battery-replacement.txt',
        'Battery capacity significantly below recommended threshold. Replacement required.',
        '2026-09-29 08:30:00'
    ),
    (
        6,
        10,
        'https://medflow-service-reports.s3/us-east-1.amazonaws/service_reports/10/emergency-recovery.txt',
        'Equipment recovered from offline state. Additional diagnostics recommended.',
        '2026-09-29 16:10:00'
    ),
    (
        7,
        12,
        'https://medflow-service-reports.s3/us-east-1.amazonaws/service_reports/12/power-failure.txt',
        'Unable to restore equipment after power-cycle procedure. Hardware inspection required.',
        '2026-09-30 13:05:00'
    )
ON CONFLICT (id) DO NOTHING;

-- explicit IDs don't advance serial sequences, so we set the sequence so that application records IDs start after our seeded data

SELECT setval(
    pg_get_serial_sequence('hospitals', 'id'),
    COALESCE((SELECT MAX(id) FROM hospitals), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('technicians', 'id'),
    COALESCE((SELECT MAX(id) FROM technicians), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('equipments', 'id'),
    COALESCE((SELECT MAX(id) FROM equipments), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('work_orders', 'id'),
    COALESCE((SELECT MAX(id) FROM work_orders), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('service_reports', 'id'),
    COALESCE((SELECT MAX(id) FROM service_reports), 1),
    true
);