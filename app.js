const inquirer = require("inquirer");
const connection = require("./connection.js");

welcomeSpeech = () => {
  console.log(`
  ***********************************
  Welcome to Use Employee Tracker App
  ***********************************
  `);
  employeeSearchPrompt();
};

const employeeSearchPrompt = () => {
  const allQuestions = [
    {
      type: "rawlist",
      name: "choices",
      message: "Choice one of the following options:",
      loop: "false",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Delete a role",
        "View department budget",
        "Quit",
        new inquirer.Separator("**********************"),
      ],
    },
  ];
  inquirer
    .prompt(allQuestions)
    .then((res) => {
      switch (res.choices) {
        case "View all departments":
          viewAllDepts();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDept();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addNewEmployee();
          break;
        case "Update an employee role":
          updateRole();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "View department budget":
          viewBudgets();
          break;
        case "Quit":
          connection.end();
          break;
        default:
          throw new Error("invalid choice");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//view all departments
viewAllDepts = () => {
  console.log("All departments shown as follows:\n");
  const mySQLquery = `SELECT department.id AS ID, department.name AS Department FROM department`;

  connection.query(mySQLquery, (err, res) => {
    if (err) throw err;
    console.table(res);
    employeeSearchPrompt();
  });
};

//view all roles
viewAllRoles = () => {
  console.log("All roles shown as follows:\n");
  const mySQLquery = `SELECT role.id AS "Role ID", role.title AS Role, role.salary AS Salary, role.dept_id AS "Dept ID" FROM role`;

  connection.query(mySQLquery, (err, res) => {
    if (err) throw err;
    console.table(res);
    employeeSearchPrompt();
  });
};

//view all employees
viewAllEmployees = () => {
  console.log("All roles shown as follows:\n");
  const mySQLquery = `SELECT e.id AS 'Employee ID', e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Position, department.name AS Department, salary AS Salary, IFNULL(CONCAT(em.first_name,' ', em.last_name), 'N/A') AS Manager
  FROM employee AS e
  LEFT JOIN employee AS em
  ON em.id = e.manager_id
  JOIN role
  ON e.role_id = role.id
  JOIN department
  ON role.dept_id = department.id`;

  connection.query(mySQLquery, (err, res) => {
    if (err) throw err;
    console.table(res);
    employeeSearchPrompt();
  });
};

//add a new department
addDept = () => {
  const question = [
    {
      type: "input",
      name: "name",
      message: "Enter the department name you would like to add.",
    },
  ];
  inquirer.prompt(question).then((prompt) => {
    const query = `INSERT INTO department (name) VALUES (?)`;
    connection.query(query, [prompt.name], (err, res) => {
      if (err) throw err;
      console.log(`
      _____________________________________

        ${prompt.name} Successfully Added
      _____________________________________\n`);
      employeeSearchPrompt();
    });
  });
};

// all a new role
addRole = () => {
  //view all departments
  const departments = [];
  connection.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err;

    res.forEach((dept) => {
      const queryObj = {
        name: dept.name,
        value: dept.id,
      };
      departments.push(queryObj);
    });

    //set questions
    
   allQuestions = [
      {
        type: "input",
        name: "title",
        message: "What is the title of the new role?",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary of this role.",
      },
      {
        type: "list",
        name: "dept",
        choices: departments,
        message: "Which department does your role belong to?",
      },
    ];

    inquirer
      .prompt(allQuestions)
      .then((prompt) => {
        const query = `INSERT INTO ROLE (title, salary, dept_id) VALUES (?, ?, ?)`;
        connection.query(
          query,
          [prompt.title, prompt.salary, prompt.dept],
          (err, res) => {
            if (err) throw err;
            console.log(`
          ________________________________

            ${prompt.title} Successfully Added
          ________________________________\n`);
            employeeSearchPrompt();
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// all a new employee
addNewEmployee = () => {
  const showAllRoles = [];
  connection.query(`SELECT * FROM role`, (err, res) => {
    if (err) throw err;
    res.forEach((role) => {
      const queryObj = {
        name: role.title,
        value: role.id,
      };
      showAllRoles.push(queryObj);
    });
  });

  const allQuestions = [
    {
      type: "input",
      name: "first_name",
      message: "Enter the new employee's first name",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the new employee's last name",
    },
    {
      tpye: "list",
      name: "role_id",
      choices: showAllRoles,
    },
  ];

  inquirer
    .prompt(allQuestions)
    .then((prompt) => {
      const query = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
      const values = [prompt.first_name, prompt.last_name, prompt.role_id];
      connection.query(query, values, (err, res) => {
        if (err) throw err;
        console.log(`
        ________________________________

        ${prompt.first_name} ${prompt.last_name} Successfully Added
        ________________________________\n`);
        employeeSearchPrompt();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//delete roles
deleteRole = () => {
  connection.query(`SELECT * FROM ROLE`, (err, res) => {
    if (err) throw err;

    const showAllroles = [];
    res.forEach((role) => {
      const queryObj = {
        name: role.title,
        value: role.id,
      };
      showAllroles.push(queryObj);
    });

    let questions = [
      {
        type: "list",
        name: "id",
        choices: showAllroles,
        message: "Which role would you like to delete?",
      },
    ];

    inquirer
      .prompt(questions)
      .then((prompt) => {
        const query = `DELETE FROM ROLE WHERE id = ?`;
        connection.query(query, [prompt.id], (err, res) => {
          if (err) throw err;
          console.log(`
          ________________________________

          Role ID ${prompt.id} Successfully Deleted
          ________________________________\n`);

          employeeSearchPrompt();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

//update employee role
updateRole = () => {
  //show all employee names
  const employeeSql = `SELECT * FROM employee`;
  const employeeChoice = [];
  connection.query(employeeSql, (err, res) => {
    if (err) throw err;
    res.forEach((employee) => {
      const queryObj = {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
      employeeChoice.push(queryObj);
    });

    const roleSql = `SELECT * FROM role`;
    const roleChoice = [];
    connection.query(roleSql, (err, res) => {
      if (err) throw err;
      res.forEach((role) => {
        const roleQueryObj = {
          name: role.tile,
          value: role.id,
        };
        roleChoice.push(roleQueryObj);
      });

      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: employeeChoice,
          },
          {
            type: "list",
            name: "role_id",
            message: "Choose the following new role",
            choices: roleChoice,
          },
        ])
        .then((prompt) => {
          const updateSql = `UPDATE employee SET role_id = ? WHERE id = ?`;
          const sqlValues = [{ role_id: prompt.role_id }, prompt.id];
          connection.query(updateSql, sqlValues, (err, res) => {
            if (err) throw err;
            console.log(`
          ________________________________

          Role ID ${prompt.role_id} Successfully Updated
          ________________________________\n`);

            employeeSearchPrompt();
          });
        });
    });
  });
};

//view budget
viewBudgets = () => {
  console.log("Department budget shown as follows:\n");
  const mySQLquery = `SELECT sum(role.salary) AS 'Sum of Department Budget (in $)'
  FROM employee
  INNER JOIN role ON employee.role_id = role.id`;

  connection.query(mySQLquery, (err, res) => {
    if (err) throw err;
    console.table(res);
    employeeSearchPrompt();
  });
}
