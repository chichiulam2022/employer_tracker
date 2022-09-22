INSERT INTO
    department (name)
VALUES
    ('Accounting & Finance'),
    ('Sales'),
    ('Marketing'),
    ('IT'),
    ('Human Resources');

INSERT INTO
    role (title, salary, dept_id)
VALUES
    ('Accoutant', 60000, 1),
    ('Marketing Coordinator ', 50000, 3),
    ('Finanical Analyst', 100000, 1),
    ('Software Engineer', 80000, 4),
    ('Recruiter', 40000, 5),
    ('Sales Representative', 30000, 2);

INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ('David', 'Smith', 4, null),
    ('Emily', 'Green', 1, 2),
    ('François', 'Dubois', 5, null),
    ('Crystal', 'Wong', 3, null),
    ('Tyler', 'Moore', 6, null),
    ('Ana', 'García', 4, 3),
    ('Natasha', 'Norman', 5, null),
    ('Helen', 'Goodman', 2, 3);