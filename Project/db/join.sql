--This part inner joins common_name from the two tables
SELECT
    users.user_id,
    users.common_name AS name,
    users.username,
    fishdata.scientific_name,
    fishdata.average_length_cm,
    fishdata.habitat
FROM users
INNER JOIN fishdata
    ON users.common_name = fishdata.common_name;