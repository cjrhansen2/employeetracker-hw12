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
            case "Add a Department":
                addDept();
                break;
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
function addDept() {

}
function addRole() {
    
}
function addEmp() {
    
}
function viewDept() {
    
}
function viewRole() {
    
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
    
}

//connect and run the inquirer functions written above
conn_empdb.connect(function (err) {
    if (err) throw err;
    startInq();
});
