var selectedRow = null

function onStudentFormSubmit() {
    if (validateStudent()) {
        var formData = readStudentFormData();
        if (selectedRow == null) {
            createStudentRecord(formData);
        } else {
            updateStudentRecord(formData);
        }
        resetStudentForm();
    }
}

function readStudentFormData() {
    var formData = {};
    formData["studentID"] = document.getElementById("studentID").value;
    formData["firstName"] = document.getElementById("firstName").value;
    formData["lastName"] = document.getElementById("lastName").value;
    formData["gpa"] = document.getElementById("gpa").value;
    return formData;
}

function createStudentRecord(data) {
    var table = document.getElementById("studentRecordsList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    var studentID = data.studentID;
    newRow.setAttribute("id", studentID);
    var dataTarget = "tr-" + studentID;
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = studentID;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.firstName;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.lastName;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.gpa;
    cell4.setAttribute('id', data.studentID + "-gpa")
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<a onClick="onStudentEdit(this)">Edit</a>
                       <a onClick="onStudentDelete(this)">Delete</a>
                       <a data-bs-toggle="collapse" href="#` + dataTarget + `" role="button" aria-expanded="false" aria-controls="` + dataTarget + `">Class Roster</a>`; 
    createClassRoster(table, studentID);    
}

function createClassRoster(table, studentID) {
    //Row that collapses with class roster for student - used newRow2 for distinction
    var newRow2 = table.insertRow(table.length);
    newRow2.setAttribute("class", "collapse multi-collapse");
    newRow2.setAttribute("id", "tr-" + studentID);
    var cell11 = newRow2.insertCell(0);
    cell11.colSpan = 5;
    var classRoster = cell11.appendChild(document.createElement('table'));
    classRoster.setAttribute("id", studentID + "-classRoster");
    classRoster.setAttribute("class", "table table-dark");
    //Create header row
    var headerRow = classRoster.createTHead();
    var row = headerRow.insertRow(0);
    cell6 = row.insertCell(0);
    cell6.innerHTML = `Class ID`;
    cell7 = row.insertCell(1);
    cell7.innerHTML = `Course ID`;
    cell8 = row.insertCell(2);
    cell8.innerHTML = `Start Date`;
    //Create body
    var body = classRoster.createTBody();
}

// CLEAR STUDENT FORM AND SELECTED ROW VALUES
function resetStudentForm() {
    document.getElementById("studentID").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("gpa").value = "";
    selectedRow = null;
}

function onStudentEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("studentID").value = selectedRow.cells[0].innerHTML;
    document.getElementById("firstName").value = selectedRow.cells[1].innerHTML;
    document.getElementById("lastName").value = selectedRow.cells[2].innerHTML;
    document.getElementById("gpa").value = selectedRow.cells[3].innerHTML;
    resetStudentForm();
}
function updateStudentRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.studentID;
    selectedRow.cells[1].innerHTML = formData.firstName;
    selectedRow.cells[2].innerHTML = formData.lastName;
    selectedRow.cells[3].innerHTML = formData.gpa;
}

function onStudentDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        document.getElementById("studentRecordsList").deleteRow(row.rowIndex);
        resetStudentForm();
    }
}

function validateStudent() {
    isValid = true;
    if (document.getElementById("studentID").value == "") {
        isValid = false;
        document.getElementById("requiredInformationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("requiredInformationError").classList.contains("hide"))
            document.getElementById("requiredInformationError").classList.add("hide");
    }
    return isValid;
}

//onclick REGISTER
function registerStudent(td) {
  selectedRow = td.parentElement.parentElement; //establishing selected row
  //taking in class row data
  var classID = selectedRow.cells[0].innerHTML;
  var courseID = selectedRow.cells[1].innerHTML;
  var startDate = selectedRow.cells[2].innerHTML;

  //prompt for Student ID and turn into number data type
  $('#enterID').modal('show');
  $('#register').click(function() {
      var selectedStudent = document.getElementById('IDinput').value;
      $('#enterID').modal('hide');
      if (selectedStudent != null) {
        var result = confirm("Are you sure you want to register " + selectedStudent + " to " + classID + "?");
        if (result == true) {
            var classRoster = document.getElementById(selectedStudent + "-tr"); //represents the TROW where class roster table expands
        //logic for validating a student has the ability to register
            var gpa = document.getElementById(selectedStudent + "-gpa").value; //get GPA data for student (in fourth column)
            var table = document.getElementById(selectedStudent + "-classRoster");
            var numClasses = table.length;
            var tbody = table.getElementsByTagName('tbody')[0];
            if (gpa < 3.0 && numClasses >= 3) {
                return (alert('Cannot register student.  GPA requirement not met.'))
            } else {
        //placing class data in student table
                newRow = tbody.insertRow(numClasses);
                cell1 = newRow.insertCell(0);
                cell1.innerHTML = classID;
                cell2 = newRow.insertCell(1);
                cell2.innerHTML = courseID;
                cell3 = newRow.insertCell(2);
                cell3.innerHTML = startDate;
                cell4 = newRow.insertCell(3);
                cell4.innerHTML = `<a onClick="onUnregister(this)">Unregister</a>`; 
                selectedRow = null;
                    return (alert('Success!'))
            }
        }
        } else {
            return alert("No Student ID entered.");
        }
})
}

// Unregister from class
function onUnregister(td) {
    if (confirm('Are you sure you want to unregister from this class?')) {
        var row = td.parentElement.parentElement;
        var table = row.parentElement.parentElement;
        var classRoster = table.id;
        document.getElementById(classRoster).deleteRow(row.rowIndex);
    }
}

//CLASS FUNCTIONS
function onClassFormSubmit() {
    if (validateClass()) {
        var formData = readClassFormData();
        if (selectedRow == null)
            createClassRecord(formData);
        else
            updateClassRecord(formData);
        resetStudentForm();
    }
}

function readClassFormData() {
    var formData = {};
    formData["classID"] = document.getElementById("classID").value;
    formData["courseID"] = document.getElementById("courseID").value;
    formData["startDate"] = document.getElementById("startDate").value;
    return formData;
}

function createClassRecord(data) {
    var table = document.getElementById("classRecordsList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.classID;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.courseID;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.startDate;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<a onClick="onClassEdit(this)">Edit</a>
                       <a onClick="onClassDelete(this)">Delete</a>
                       <a onClick="registerStudent(this)">Register</a>`;
    
}

function resetClassForm() {
    document.getElementById("classID").value = "";
    document.getElementById("courseID").value = "";
    document.getElementById("startDate").value = "";
    selectedRow = null;
}

function onClassEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("classID").value = selectedRow.cells[0].innerHTML;
    document.getElementById("courseID").value = selectedRow.cells[1].innerHTML;
    document.getElementById("startDate").value = selectedRow.cells[2].innerHTML;
    resetClassForm();
}
function updateClassRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.classID;
    selectedRow.cells[1].innerHTML = formData.courseID;
    selectedRow.cells[2].innerHTML = formData.startDate;
}

function onClassDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        document.getElementById("classRecordsList").deleteRow(row.rowIndex);
        resetClassForm();
    }
}
function validateClass() {
    isValid = true;
    if (document.getElementById("classID").value == "") {
        isValid = false;
        document.getElementById("requiredInformationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("requiredInformationError").classList.contains("hide"))
            document.getElementById("requiredInformationError").classList.add("hide");
    }
    return isValid;
}
