const filterFiller = (dict) => {
    var { name, gender, city, department, date_created } = dict;
  
    if (!name || !name[0]) {
        name = "SELECT name FROM user";
    }
    else {
        name = "'" + name.join("', '") + "'";
    }
  
    if (!gender || !gender[0]) {
        gender = "SELECT gender FROM user";
    }
    else {
        gender = "'" + gender.join("', '") + "'";
    }
  
    if (!city || !city[0]) {
        city = "SELECT city FROM user";
    }
    else {
        city = "'" + city.join("', '") + "'";
    }
  
    if (!department || !department[0]) {
        department = "SELECT department FROM user";
    }
    else {
        department = "'" + department.join("', '") + "'";
    }
  
    if (!date_created || !date_created[0]) {
      date_created = "IN (SELECT date_created FROM user)";
    }
    else if (date_created[1] == "after") {
        date_created = `> '${date_created[0]}'`;
    }
    else if (date_created[1] == "before") {
        date_created = `< '${date_created[0]}'`;
    }
    else if (date_created[1] == "at") {
        date_created = `= '${date_created[0]}'`;
    }
    else {
        date_created = `BETWEEN '${date_created[0]}' AND '${date_created[1]}'`;
    }
  
    return { name, gender, city, department, date_created };
  };
  
  module.exports = filterFiller;