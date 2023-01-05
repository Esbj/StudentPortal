'use strict'
/*

  ett student-portal-objekt

    lagra info om alla studenter
      förnamn, efternamn, kurser, personnummer

      student-portal = objekt //lägg metoder för att interagera med student objekt här
      studenter = array
      student = objekt
*/

const studentPortal = {
  students: [
    {
      id: 1,
      firstName: 'Aron',
      lastName: 'Anderson',
      courses: ["Programming", "Physics"],
      birthYear: 1989,
      photo: 'images/aron.jpg',
    },
    {
      id: 2,
      firstName: 'Cecilia',
      lastName: 'Cornelius',
      courses: ["Programming", "Physics", "Math"],
      birthYear: 1990,
      photo: 'images/cecilia.jpg',
    },
    {
      id: 3,
      firstName: 'Benny',
      lastName: 'Bearsson',
      courses: ["Math", "Art", "English Litteratture"],
      birthYear: 1989,
      photo: 'images/benny.jpg',
    },
  ],
  addStudent: function (student) {
    this.students.push(student);
    studentView.printStudentButtons();
  },
  removeStudent: function (id) {
    //ta bort från students[]
  },
  getStudent: function (studentInfo) {
    //studentInfo är sträng med id förnamn och efternamn
    //Finns helt klart förbättringsmöjligheter i prestanda men räcker for now. 
    console.log(studentInfo)
    const infoArr = studentInfo.split(' ');
    //första elementet kommer alltid vara ID, jämnför det med ID på hela arrayen
    for (const student of this.students) {
      if (infoArr[0] == student.id) {
        return student;
      }
    }
    return { firstName: `Error! No student found` };
  },
  getStudentInfo: function () {

    // returnera ID och namn på alla studenter

    const arr = [];
    const studentsLength = this.students.length;
    //best practice att bra slå upp längden en gång istället för varige for loop

    for (let i = 0; i < studentsLength; i++) {
      arr.push(`${this.students[i].id} ${this.students[i].firstName} ${this.students[i].lastName}`);
    }
    return arr;
  },
  editStudentInfo: function (studentData) {
    const student = this.students[studentData.id - 1];
    student.firstName = studentData.firstName;
    student.lastName = studentData.lastName;
    student.birthYear = studentData.birthYear;
    student.courses = studentData.courses;
    studentView.printStudentButtons();
    studentView.printStudentInfo(`${student.id} ${student.firstName} ${student.lastName}`);
  }
};


const studentView = {
  currentStudentId: Number(),
  printStudentButtons: function () {
    const studentInfo = studentPortal.getStudentInfo();

    let studentsEl = document.querySelector("#student-buttons")
    studentsEl.innerHTML = "";
    for (let studentName of studentInfo) {
      let button = document.createElement('button');
      button.innerText = studentName;
      //addEventListener måste ha en funktion som callback, kör en anonym ES6 funktion vars callback är en metod på objektet. 
      button.addEventListener("click", (event) => this.printStudentInfo(studentName));
      studentsEl.append(button);
    };
  },
  printStudentInfo: function (studentName) {
    console.log(`student name från printStudentInfo ${studentName}`);
    const id = studentName.split(" ")[0];
    studentView.currentStudentId = id
    const studentObject = studentPortal.getStudent(studentName);
    const studentInfo = document.querySelector(".student-info");
    const studentData = document.querySelector(".student-data");
    const imageEl = document.querySelector(".student-info > img");
    const dataElements = document.querySelectorAll(".student-data > p");

    if (imageEl) { imageEl.remove(); }
    if (dataElements) {
      for (const element of dataElements) {
        element.remove();
      }
    }
    const img = document.createElement("img")
    for (const key in studentObject) {
      if (key !== "id") {
        if (studentObject[key].toString().includes('.jpg')) {
          img.src = studentObject[key];
          studentInfo.append(img)
        } else {
          const p = document.createElement("p")
          p.innerText = studentObject[key];
          p.setAttribute("contenteditable", "true");
          studentData.append(p)
        }
      }
    }

    const saveButton = document.createElement("button");
    saveButton.innerText = "Save";

    //higher order funktion?
    const studentInfoData = document.querySelectorAll('.student-data p')
  
    saveButton.addEventListener("click", function (event) {
      //få tag i rätt student 

      const newStudentInfo = {
        id: studentView.currentStudentId,
        firstName: studentInfoData[0].innerHTML,
        lastName: studentInfoData[1].innerHTML,
        courses: studentInfoData[2].innerHTML,
        birthYear: Number(studentInfoData[3].innerHTML),
      }
      // skicka stuent till edit student funktion
      studentPortal.editStudentInfo(newStudentInfo);

      saveButton.remove();
    })
    for (const node of studentInfoData) {
      node.addEventListener("click", () => {
        studentData.append(saveButton);
      })
    }

  },
}
const addForm = document.querySelector('#add-student');
addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = document.querySelectorAll('#add-student input[type="text"], #add-student input[type="number"]');
  const newStudent = {
    id: studentPortal.students.length + 1,
    firstName: formData[0].value,
    lastName: formData[1].value,
    birthYear: Number(formData[2].value),
  }
  studentPortal.addStudent(newStudent);
})
studentView.printStudentButtons();
