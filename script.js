let baseURL = `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees`;
let currentPage = 1;
let perPage = 10;
let filteredEmployees = [];
let totalPages = 1;

let departmentFilter = document.getElementById("department-filter");
let genderFilter = document.getElementById("gender-filter");
let sortSelect = document.getElementById("sort");
let prevPageBtn = document.getElementById("prev-page");
let nextPageBtn = document.getElementById("next-page");
let pageNumber = document.getElementById("page-number");
let tbody = document.getElementById("employee-data");

function fetchEmployees() {
  let url = `${baseURL}?page=${currentPage}&limit=${perPage}`;
  fetch(url)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      // console.log(data.data);
      filteredEmployees = data.data;
      totalPages = data.totalPages;
      //   console.log(totalPages);

      renderEmployees(filteredEmployees);
    })
    .catch((err) => {
      console.log(err);
    });
}

function renderEmployees(employees) {
  tbody.innerHTML = null;

  employees.forEach((employee, index) => {
    let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${employee.name}</td>
                <td>${employee.gender}</td>
                <td>${employee.department}</td>
                <td>${employee.salary}</td>
            </tr>
        `;

    tbody.innerHTML += row;
  });
  updatePaginationButtons();
}

departmentFilter.addEventListener("change", applyFilters);
genderFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applySort);
prevPageBtn.addEventListener("click", goPrevPage);
nextPageBtn.addEventListener("click", goNextPage);

function applyFilters() {
  let selectedDepartment = departmentFilter.value;
  let selectedGender = genderFilter.value;

  //   console.log(selectedGender);

  filteredEmployees = filteredEmployees.filter((employee) => {
    return (
      (!selectedDepartment || employee.department == selectedDepartment) &&
      (!selectedGender || employee.gender == selectedGender)
    );
  });

  applySort();
  renderEmployees(filteredEmployees);
}

function applySort() {
  let sortOrder = sortSelect.value;

  filteredEmployees.sort((a, b) => {
    return sortOrder == "asc" ? a.salary - b.salary : b.salary - a.salary;
  });

  renderEmployees(filteredEmployees);
}

function goPrevPage() {
  if (currentPage > 1) {
    currentPage--;
  }
  fetchEmployees();
}

function goNextPage() {
  if (currentPage < totalPages) {
    currentPage++;
  }
  fetchEmployees();
}

function updatePaginationButtons() {
  prevPageBtn.disabled = currentPage == 1;
  nextPageBtn.disabled = currentPage == totalPages;
  pageNumber.textContent = `Page ${currentPage}`;
}

fetchEmployees();
