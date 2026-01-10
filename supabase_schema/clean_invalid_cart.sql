-- ================================================
-- CLEAN INVALID CART ITEMS
-- Run this to remove cart items that reference 
-- non-existent services (after reseeding)
-- ================================================

-- Delete cart items where the service no longer exists
DELETE FROM cart_items 
WHERE service_id NOT IN (SELECT id FROM services);

-- Show remaining cart items
SELECT 
  ci.id, 
  ci.session_id, 
  ci.service_id, 
  s.name as service_name,
  ci.qty 
FROM cart_items ci
LEFT JOIN services s ON ci.service_id = s.id;

SELECT 'Cart cleaned. Invalid items removed.' as status;
