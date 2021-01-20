USE empdb;

INSERT INTO department (name)
VALUES ("C-Suite");
INSERT INTO department (name)
VALUES ("Ninjas");
INSERT INTO department (name)
VALUES ("Customer-Service");
INSERT INTO department (name)
VALUES ("Weapons");
INSERT INTO department (name)
VALUES ("Human-Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Chief-Executive-Ninja", 100, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Assistant-Ninja", 50, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Ninja-Support", 30, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Sword-Sharpener", 40, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Nunchuck-Sander", 20, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("HR-Ninja", 10, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Luke", "Skywalker", 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Darth", "Vader", 2, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Baby", "Yoda", 3, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Obi-Wan", "Kenobi", 4, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jar Jar", "Binks", 4, 5);