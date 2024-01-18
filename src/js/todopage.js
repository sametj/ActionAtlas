import { API_BASE_URL } from "./APIURL.js";

const tasksList = document.querySelector(".tasks");
const tags = document.querySelectorAll(".tag");
const days = document.querySelectorAll(".day");
const addTask = document.querySelector(".add-button");
const alert = document.querySelector(".alert-section");
const dateElement = document.querySelector("#date");
const deleteButtons = document.querySelectorAll(".delete-button");
const editButtons = document.querySelectorAll(".edit-button");
const saveButtons = document.querySelectorAll(".save-button");
const cancelButtons = document.querySelectorAll(".cancel-button");
const displayUsername = document.querySelector("#user-name");
const logOutBtn = document.querySelector(".logout-button");
const completedTasks = document.querySelector("#completed-todos");
const pendingTasks = document.querySelector("#current-todos");

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("user");

//displaying date
const date = new Date();
const format = {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
};
const today = date.toLocaleDateString("en-US", format);
dateElement.innerHTML = today;

//displaying tasks
const getTodo = (todo) => {
  let html = "";
  todo.forEach((element) => {
    html += `  <li class="task ${element.tag}">
          <div class="task-div" id="${element.id}">${element.task} </div>
          <div class="buttons-div">
            <button class="edit-button">Edit</button>
            <button class="save-button">Save</button>
            <button class="cancel-button">Cancel</button>
            <button class="delete-button">Delete</button>
            <input type="checkbox" class="checkbox" ${
              element.completed === true ? "checked" : ""
            } />
          </div>
         
        </li>`;
    tasksList.innerHTML = html;
  });
};

const getTodoCompleted = (todo) => {
  let html = "";
  todo.forEach((element) => {
    html += `  <li class="task ${element.tag}">
          <div class="task-div" id="${element.id}">${element.task}</div>
          <input type="checkbox" class="checkbox" checked />
        </li>`;
    tasksList.innerHTML = html;
  });
};

//selecting day
days.forEach((day) => {
  day.addEventListener("click", () => {
    days.forEach((day) => {
      tasksList.innerHTML = "";
      day.classList.remove("active");
    });
    day.classList.add("active");
    fetch(API_BASE_URL + `${userId}/todos/${day.id}`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        getTodo(data);
        window.location.href = `#${day.id}`;
      });
  });
});

//selecting tag
tags.forEach((tag) => {
  tag.addEventListener("click", () => {
    if (tag.classList.contains("selected")) {
      tag.classList.remove("selected");
    } else {
      tags.forEach((tag) => {
        tag.classList.remove("selected");
      });
      tag.classList.add("selected");
    }
  });
});

//adding task
addTask.addEventListener("click", () => {
  const taskText = document.querySelector(".task-input");
  const selectedDay = document.querySelector(".active").id;
  const selectedTag = document.querySelector(".selected");
  const task = taskText.value;
  if (task == "") {
    alert.innerHTML = "Please enter a task";
    alert.classList.add("show");
    setTimeout(() => {
      alert.classList.remove("show");
    }, 3000);
  } else if (!selectedTag) {
    alert.innerHTML = "Please select a tag";
    alert.classList.add("show");
    setTimeout(() => {
      alert.classList.remove("show");
    }, 3000);
  } else {
    taskText.value = "";
    alert.innerHTML = "Task added successfully";
    alert.classList.add("show");
    alert.style.backgroundColor = "green";
    setTimeout(() => {
      alert.classList.remove("show");
    }, 3000);
    const tag = selectedTag.classList[1];
    fetch(API_BASE_URL + `${userId}/addtodo`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        task: task,
        day: selectedDay,
        tag: tag,
        completed: false,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const html = `  <li class="task ${tag}">
          <div class="task-div" id="${data.id}">${task} </div>
          <div class="buttons-div">
            <button class="edit-button">Edit</button>
            <button class="save-button">Save</button>
            <button class="cancel-button">Cancel</button>
            <button class="delete-button">Delete</button>
          </div>
          <input type="checkbox" class="checkbox" />
        </li>`;
        tasksList.innerHTML += html;
      });
  }
});

//Deleting task
document.addEventListener("click", (e) => {
  const selectedDay = document.querySelector(".active").id;
  if (e.target.classList.contains("delete-button")) {
    const id = e.target.parentElement.parentElement.children[0].id;
    console.log(id);
    fetch(API_BASE_URL + `${userId}/deletetodo/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        alert.classList.add("show");
        alert.innerHTML = "Task deleted successfully";
        alert.style.backgroundColor = "green";
        setTimeout(() => {
          alert.classList.remove("show");
        }, 3000);
        tasksList.removeChild(e.target.parentElement.parentElement);
      });
  }
});

//Editing task
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-button")) {
    const id = e.target.parentElement.parentElement.children[0].id;

    //Getting Buttons and checkbox
    const deleteButton = e.target.parentElement.children[3];
    const editButton = e.target.parentElement.children[0];
    const saveButton = e.target.parentElement.children[1];
    const cancelButton = e.target.parentElement.children[2];
    const checkbox = e.target.parentElement.children[4];

    console.log(deleteButton);
    console.log(editButton);
    console.log(saveButton);
    console.log(cancelButton);
    console.log(checkbox);

    //hiding buttons
    deleteButton.style.display = "none";
    editButton.style.display = "none";
    saveButton.style.display = "block";
    cancelButton.style.display = "block";
    checkbox.classList.add("hide");

    //Getting task
    const task = e.target.parentElement.parentElement.children[0];

    const taskText = task.innerText;
    const taskInput = document.createElement("input");
    taskInput.classList.add("edit-input");
    taskInput.value = taskText;
    task.innerText = "";
    task.appendChild(taskInput);

    //save task
    cancelButton.addEventListener("click", () => {
      task.innerText = taskText;
      deleteButton.style.display = "block";
      editButton.style.display = "block";
      saveButton.style.display = "none";
      cancelButton.style.display = "none";
      checkbox.classList.remove("hide");
    });

    saveButton.addEventListener("click", () => {
      const newTask = taskInput.value;
      fetch(API_BASE_URL + `${userId}/edittodo/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          task: newTask,
        }),
      }).then(() => {
        alert.classList.add("show");
        alert.innerHTML = "Task updated successfully";
        alert.style.backgroundColor = "green";
        setTimeout(() => {
          alert.classList.remove("show");
        }, 3000);
        task.innerText = newTask;
        deleteButton.style.display = "block";
        editButton.style.display = "block";
        saveButton.style.display = "none";
        cancelButton.style.display = "none";
        checkbox.classList.remove("hide");
      });
    });
  }
});

//Completing task
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkbox")) {
    const id = e.target.parentElement.parentElement.children[0].id;
    e.target.parentElement.classList.add("completed");
    fetch(API_BASE_URL + `${userId}/edittodo/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        completed: e.target.checked,
      }),
    }).then((data) => {
      if (e.target.checked) {
        alert.classList.add("show");
        alert.innerHTML = "Task completed successfully";
        alert.style.backgroundColor = "green";
        setTimeout(() => {
          alert.classList.remove("show");
        }, 3000);
      }
    });
  }
});

//Filtering tasks by tag
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("tag")) {
    if (e.target.classList.contains("selected")) {
      const tag = e.target.classList[1];
      fetch(API_BASE_URL + `${userId}/todos/filter/${tag}`, {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          tasksList.innerHTML = "";
          getTodo(data);
        });
    }
  }
});

//Displaying completed
completedTasks.addEventListener("click", () => {
  let activeDay = document.querySelector(".active").id;
  fetch(API_BASE_URL + `${userId}/${activeDay}/completed`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      tasksList.innerHTML = "";
      getTodoCompleted(data);
    });
});

pendingTasks.addEventListener("click", () => {
  let activeDay = document.querySelector(".active").id;
  fetch(API_BASE_URL + `${userId}/${activeDay}/pending`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      tasksList.innerHTML = "";
      getTodo(data);
    });
});

logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  localStorage.removeItem("userid");
  window.location.href = "/index.html";
});
window.onload = () => {
  const day = today.split(",")[0].toLowerCase();
  const defaultDay = document.querySelector(`#${day}`);
  defaultDay.classList.add("active");
  fetch(API_BASE_URL + `${userId}/todos/${day}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      getTodo(data);
    });
  displayUsername.innerHTML = localStorage.getItem("username");
};
