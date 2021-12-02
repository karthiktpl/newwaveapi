const sql = require("./db");

const School = function (school){
    this.name = school.name;
    this.address = school.address;
    this.email = school.email;
    this.phone = school.phone;
    this.fax = school.fax;
    this.email = school.email;
    this.created_by = 1;
    // this.created_by = school.created_by;
    //this.created_at = school.created_at;
    this.status = school.status;
};

School.create = (newSchool, result) => {
    sql.query("INSERT INTO schools SET ?", newSchool, (err, res) => {
        if(err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
     /*    console.log("Created School : ", {id: res.insertId, ...newSchool }); */
        result(null, {id: res.insertId, ...newSchool});
    });
};
module.exports = School;