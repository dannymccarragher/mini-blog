USE blog;
DROP TABLE IF EXISTS blog;
CREATE table blog_posts(
id INT auto_increment,
author varchar(255),
title varchar(510),


PRIMARY KEY(id)
)