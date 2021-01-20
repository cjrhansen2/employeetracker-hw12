//bring in necessary npm packages
const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");
//connect to the employees database, empdb
var conn_empdb = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "empdb"
});

//write the function that will start to inquire the user
function startInq() {
    //fire up the good ol' inquirer
    inquirer.prompt({
        type: "list",
        name: "startmenu",
        message: "Please select the action you would like to carry out: ",
        choices: [
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "View a Department",
            "View a Role",
            "View an Employee",
            "Update Employee Roles",
            "Exit Menu"
        ]
    }).then(function ({ startmenu }) {
        //include all of the options listed in menu, connect with associated function, written below
        switch (startmenu) {
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addEmp();
                break;
            case "View a Department":
                viewDept();
                break;
            case "View a Role":
                viewRole();
                break;
            case "View an Employee":
                viewEmp();
                break;
            case "Update Employee Roles":
                updateEmp();
                break;
            case "Exit Menu":
                conn_empdb.end();
                break;
        }
    });
}

//Now write all the functions listed by startInq for each option that uses the mysql database
function addRole() {
    var mysqlQuery =
        `SELECT dep.id, dep.name, rol.salary
        FROM employee emp
        JOIN role rol
        ON emp.role_id = rol.id
        JOIN department dep
        ON dep.id = rol.department_id
        GROUP BY dep.id, dep.name`
    conn_empdb.query(mysqlQuery, function (err, res) {
        if (err) throw err;
        var depts = res.map(({ id, name }) => ({
            value: id,
            name: `${id} ${name}`
        }));
    console.table(res);
    //prompt user to enter roles
    inquirer.prompt([
        {
            type: "input",
            name: "roleEntry",
            message: "Please enter the name of the role you are adding: "
        },
        {
            type: "input",
            name: "salaryEntry",
            message: "Please enter the salary of the role you are entering"
        },
        {
            type: "list",
            name: "deptEntry",
            message: "Please select the department the role is a part of: ",
            choices: depts
        }
    ]).then(function (answer) {
        var anotherQuery = `INSERT INTO role SET ?`
        conn_empdb.query(anotherQuery, {
            title: answer.roleEntry,
            salary: answer.salaryEntry,
            department_id: answer.deptEntry
        },
        function (err, res) {
            if (err) throw err;
            console.table(res);
            //again, return to first inquirer function
            startInq();
        });
    });
    });
}
function addEmp() {
    var mysqlQuery = `SELECT rol.id, rol.title, rol.salary FROM role rol`

    conn_empdb.query(mysqlQuery, function (err, res) {
        if (err) throw err;
        var roles = res.map( ({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));
        //prompt user with inquirer to ask for inputs about employee to add
        inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "Please enter the employee's first name: "
            },
            {
                type: "input",
                name: "last_name",
                message: "Please enter the employee's last name: "
            },
            {
                type: "list",
                name: "roleInput",
                message: "Please enter the employee's role: ",
                choices: roles
            }
        ]).then(function (answer) {
            var otherQuery = `INSERT INTO employee SET ?`
            conn_empdb.query(otherQuery,
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.roleInput
                },
                function (err, res) {
                    if (err) throw err;
                    //put the results into the table for the console
                    console.table(res);
                    //go back to original function for inquirer
                    startInq();
                });
        });
    });
}
function viewDept() {
    //make mysql query
    var mysqlQuery =
        `SELECT dep.name AS department
        FROM department dep`
    
    conn_empdb.query(mysqlQuery, function (err, res) {
        if (err) throw (err);
        console.table(res);
        //go back to initial function, startInq
        startInq();
    });
}
function viewRole() {
    //make mysql query
    var mysqlQuery =
        `SELECT rol.title
        FROM role rol`
    
    conn_empdb.query(mysqlQuery, function (err, res) {
        if (err) throw (err);
        console.table(res);
        //go back to initial function, startInq
        startInq();
    });    
}
function viewEmp() {
    //make mysql query
    var mysqlQuery =
        `SELECT emp.id, emp.first_name, emp.last_name, rol.title, dep.name AS department, rol.salary, CONCAT(man.first_name, ' ', man.last_name) AS manager
        FROM employee emp
        LEFT JOIN role rol
            ON emp.role_id = rol.id
        LEFT JOIN department dep
            ON dep.id = rol.department_id
        LEFT JOIN employee man
            ON man.id = emp.manager_id`

    conn_empdb.query(mysqlQuery, function (err, res) {
        if (err) throw (err);
        console.table(res);
        //go back to initial function, startInq
        startInq();
    });
}
function updateEmp() {
    var mysqlQuery =
        `SELECT emp.id, emp.first_name, emp.last_name, rol.title, dep.name AS department, rol.salary, CONCAT(man.first_name, ' ', man.last_name) AS manager
        FROM employee emp
        JOIN role rol
            ON emp.role_id = rol.id
        JOIN department dep
            ON dep.id = rol.department_id
        JOIN employee man
            ON man.id = emp.manager_id`

        conn_empdb.query(mysqlQuery, function (err, res) {
            if (err) throw err;
            var employees = res.map(({ id, first_name, last_name}) => ({
                value: id,
                name: `${first_name} ${last_name}`
            }));
        console.table(res);

        var diffQuery = `SELECT rol.id, rol.title, rol.salary FROM role rol`
// accessing different lists from the databases in order to properly update the employees
        conn_empdb.query(mysqlQuery, function (err, res) {
            if (err) throw err;

            rolesSelect = res.map(({ id, title, salary }) =>({
                value: id,
                title: `${title}`,
                salary: `${salary}`
            }));
        console.table(res);

        inquirer.prompt([
            {
                type: "list",
                name: "empSelect",
                message: "Please select the employee you wish to update: ",
                choices: employees
            },
            {
                type: "list",
                name: "roleSelect",
                message: "Please select the role you are updating",
                choices: rolesSelect
            }
        ]).then(function (answer) {
            var oneMoreQuery = `UPDATE employee SET role_id = ? WHERE id = ?`
            conn_empdb.query(oneMoreQuery,
                [answer.roleSelect,
                answer.empSelect],
                function (err, res) {
                    if (err) throw err;
                    console.table(res);

                //back to the first function, startInq
                    startInq();
                });
        });
        });
        });
}

//connect and run the inquirer functions written above
conn_empdb.connect(function (err) {
    if (err) throw err;
    startInq();
});
