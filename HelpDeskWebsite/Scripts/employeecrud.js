﻿$(function () { // employeeaddupdate.js 
    let getAll = async (msg) => {
        try {
            $('#status').text('Finding Employee Information...');
            let response = await fetch(`api/employees/`);
            if (!response.ok) // or check for response.status
                throw new Error(`Status - ${response.status}, Text - ${response.statusText}`);
            let data = await response.json(); // this returns a promise, so we await it 
            buildEmployeeList(data);
            (msg === '') ? // are we appending to an existing message
                $('#status').text('Employees Loaded') : $('#status').text(`${msg} - Employees Loaded`);

            // set all departments to local storage
            response = await fetch(`api/departments/`);
            if (!response.ok) // or check for response.status
                throw new Error(`Status - ${response.status}, Text - ${response.statusText}`);
            let depts = await response.json(); // this returns a promise, so we await it 
            localStorage.setItem('alldepartments', JSON.stringify(depts));

        } catch (error) {
            $('#status').text(error.message);
        }
    } // getAll

    const loadDepartmentDDL = (empdept) => {
        html = '';
        $('#ddlDepts').empty();
        let alldepartments = JSON.parse(localStorage.getItem('alldepartments'));
        alldepartments.map(div => html += `<option value="${div.Id}">${div.Name}</option>`);
        $('#ddlDepts').append(html);
        $('#ddlDepts').val(empdept);
    } // load DepartmentDDL

    const setupForUpdate = (Id, data) => {
        $('#actionbutton').val('update');
        $('#modaltitle').html('<h4>update employee</h4>');
        clearModalFields();
        data.map(employee => {
            if (employee.Id === parseInt(Id)) {
                $('#TextBoxTitle').val(employee.Title);
                $('#TextBoxFirstname').val(employee.Firstname);
                $('#TextBoxLastname').val(employee.Lastname);
                $('#TextBoxPhone').val(employee.Phoneno);
                $('#TextBoxEmail').val(employee.Email);
                localStorage.setItem('Id', employee.Id);
                //localStorage.setItem('DepartmentId', employee.DepartmentId);
                loadDepartmentDDL(employee.DepartmentId);
                localStorage.setItem('Timer', employee.Timer);
                $('#modalstatus').text('update data');
                $('#theModal').modal('toggle');
            } // if
        }); // data.map
    } // set up for Update

    const setupForAdd = () => {
        $('#actionbutton').val('add');
        $('#modaltitle').html('<h4>Add Employee </h4>');
        $('#theModal').modal('toggle');
        $('#modalstatus').text('add new employee');
        loadDepartmentDDL(-1); // add this
        clearModalFields();
    }// setupForAdd

    let clearModalFields = () => {
        $('#TextBoxTitle').val('');
        $('#TextBoxFirstname').val('');
        $('#TextBoxLastname').val('');
        $('#TextBoxPhone').val('');
        $('#TextBoxEmail').val('');
        localStorage.removeItem('Id');
        localStorage.removeItem('DepartmentId');
        localStorage.removeItem('Timer');
    } // Clear ModalFields

    let buildEmployeeList = (data) => {
        $('#employeeList').empty();
        div = $(`<div class="list-group-item text-white bg-secondary row d-flex" id="status">Employee Info</div> 
            <div class= "list-group-item row d-flex text-center" id="heading">
            <div class="col-4 h4">Title</div> 
            <div class="col-4 h4">First</div> 
            <div class="col-4 h4">Last</div>
           </div>`);

        div.appendTo($('#employeeList'))
        localStorage.setItem('allemployees', JSON.stringify(data));
        btn = $(`<button class="list-group-item row d-flex" id="0"><div class="col-12 text-left">... click to add employee</div></button>`);
        btn.appendTo($('#employeeList'));
        data.map(emp => {
            btn = $(`<button class="list-group-item row d-flex" id="${emp.Id}">`);
            btn.html(`<div class="col-4" id="employeetitle${emp.Id}">${emp.Title}</div>
                    <div class="col-4" id="employeefname${emp.Id}">${emp.Firstname}</div>
                    <div class="col-4" id="employeelastname${emp.Id}">${emp.Lastname}</div>`
            );
            btn.appendTo($('#employeeList'));
        }); // map
    } // buildEmployeeList

    const update = async () => {
        try {
            emp = new Object();
            emp.Title = $('#TextBoxTitle').val();
            emp.Firstname = $('#TextBoxFirstname').val();
            emp.Lastname = $('#TextBoxLastname').val();
            emp.Phoneno = $('#TextBoxPhone').val();
            emp.Email = $('#TextBoxEmail').val();
            emp.Id = localStorage.getItem('Id');
            //emp.DepartmentId = localStorage.getItem('DepartmentId');
            emp.DepartmentId = $('#ddlDepts').val();
            emp.Timer = localStorage.getItem('Timer');
            // send the updated back to the server asynchronously using PUT
            let response = await fetch('api/employees', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(emp)
            });
            if (response.ok) // or check for response.status
            {
                let data = await response.json();
                getAll(data);

            } else {
                $('#status').text(`${response.status}, Text - ${response.statusText}`);
            } // else
            $('#theModal').modal('toggle');
        } catch (error) {
            $('#status').text(error.message);
        } // try/catch
    }//update

    const add = async () => {
        try {
            emp = new Object();
            emp.Title = $('#TextBoxTitle').val();
            emp.Firstname = $('#TextBoxFirstname').val();
            emp.Lastname = $('#TextBoxLastname').val();
            emp.Phoneno = $('#TextBoxPhone').val();
            emp.Email = $('#TextBoxEmail').val();
            //emp.DepartmentId = 100; // hard code it for now, we'll add a dropdown later
            emp.DepartmentId = $('#ddlDepts').val();
            emp.Id = -1;
            // send the student info to the server asynchronously using POST

            let response = await fetch('api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(emp)
            });
            if (response.ok) // or check for response.status
            {
                let data = await response.json();
                getAll(data);

            } else {
                $('#status').text(`${response.status}, Text - ${response.statusText}`);
            } // else
            $('#theModal').modal('toggle');
        } catch (error) {
            $('#status').text(error.message);
        } // try/catch
    }// add

    let _delete = async () => {
        try {

            let response = await fetch(`api/employees/${localStorage.getItem('Id')}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
            if (response.ok) // or check for response.status
            {
                let data = await response.json();
                getAll(data);

            } else {
                $('#status').text(`${response.status}, Text - ${response.statusText}`);
            } // else
            $('#theModal').modal('toggle');
        } catch (error) {
            $('#status').text(error.message);
        } // try/catch

    }

    $("#actionbutton").click(() => {
        $("#actionbutton").val() === "update" ? update() : add();
    });//actionbutton click

    $('[data-toggle=confirmation]').confirmation({ rootSelector: '[data-toggle=confirmation]' });
    $('#deletebutton').click(() => _delete()); // if yes was chosen

    $('#employeeList').click((e) => {
        if (!e) e = window.event;
        let Id = e.target.parentNode.id;
        if (Id === 'employeeList' || Id === '') {
            Id = e.target.id;
        } // clicked on row somewhere else
        if (Id !== 'status' && Id !== 'heading') {
            let data = JSON.parse(localStorage.getItem('allemployees'));
            Id === '0' ? setupForAdd() : setupForUpdate(Id, data);

        } else {
            return false; // ignore if they clicked on heading or status
        }
    }); // EmployeeListClick

    getAll(''); // first grab the data from the server
});