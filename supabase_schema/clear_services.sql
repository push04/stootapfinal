-- ================================================
-- STOOTAP - CLEAR ALL SERVICES DATA
-- Run this FIRST before running the new seed file
-- ================================================

-- Delete all services (cascade deletes related data)
DELETE FROM services;
DELETE FROM categories;

-- Confirm deletion
SELECT 'All services and categories deleted successfully!' as status;
