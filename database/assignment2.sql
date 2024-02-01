INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@nTony', 'Admin');

DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

--This will delete the record for Tony Stark based on the value of the `account_email` column. Note that this will also delete any associated records in other tables that have a foreign key reference to the `account_id` of the Tony Stark record in the `account` table. To avoid this, you can use the `CASCADE` or `RESTRICT` keyword with the `ON DELETE` clause of the foreign key constraint in the `inventory` table.

UPDATE public.inventory
SET inv_description = 'The Hummer gives you a huge interior with an engine to get you out of any muddy or rocky situation.'
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory AS i
INNER JOIN public.classification AS c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/vehicles/images'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/vehicles/images');

UPDATE public.inventory
SET inv_image = REGEXP_REPLACE(inv_image, '/images\M','/images/vehicles','g');
UPDATE public.inventory
SET inv_thumbnail = REGEXP_REPLACE(inv_thumbnail, '/images\M','/images/vehicles', 'g');