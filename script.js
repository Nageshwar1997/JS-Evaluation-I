// Declaring global variables
let baseURL = `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees`;
let currentPage = 1;
let perPage = 10;
let filteredEmployees = [];
let totalPages = 1;

// DOM elements
let departmentFilter = document.getElementById("department-filter");
let genderFilter = document.getElementById("gender-filter");
let sortSelect = document.getElementById("sort");
let prevPageBtn = document.getElementById("prev-page");
let nextPageBtn = document.getElementById("next-page");
let pageNumber = document.getElementById("page-number");
let tbody = document.getElementById("employee-data");

// Fetches employees from the API
function fetchEmployees() {
  let url = `${baseURL}?page=${currentPage}&limit=${perPage}`;
  fetch(url)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      // Store fetched data
      filteredEmployees = data.data;
      totalPages = data.totalPages;

      // Render the fetched employees
      renderEmployees(filteredEmployees);
    })
    .catch((err) => {
      console.log(err);
    });
}

// Renders the employees on the table
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
  // Update pagination buttons
  updatePaginationButtons();
}

// Event listeners for filters and pagination buttons
departmentFilter.addEventListener("change", sortbyDepartment);
genderFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applySort);
prevPageBtn.addEventListener("click", goPrevPage);
nextPageBtn.addEventListener("click", goNextPage);

// Filter employees based on selected gender
function applyFilters() {
  let selectedGender = genderFilter.value;

  filteredEmployees = filteredEmployees.filter((employee) => {
    return (
      (!selectedDepartment || employee.department == selectedDepartment) &&
      (!selectedGender || employee.gender == selectedGender)
    );
  });

  renderEmployees(filteredEmployees);
  applySort();
}

// Filter employees by department
function sortbyDepartment() {
  let selectedDepartment = departmentFilter.value;
  filteredEmployees = filteredEmployees.filter((employee) => {
    return !selectedDepartment || employee.department == selectedDepartment;
  });
  renderEmployees(filteredEmployees);
}

// Apply sorting to employees based on salary
function applySort() {
  let sortOrder = sortSelect.value;

  filteredEmployees.sort((a, b) => {
    return sortOrder == "asc" ? a.salary - b.salary : b.salary - a.salary;
  });

  renderEmployees(filteredEmployees);
}

// Go to the previous page
function goPrevPage() {
  if (currentPage > 1) {
    currentPage--;
  }
  fetchEmployees();
}

// Go to the next page
function goNextPage() {
  if (currentPage < totalPages) {
    currentPage++;
  }
  fetchEmployees();
}

// Update pagination buttons state
function updatePaginationButtons() {
  prevPageBtn.disabled = currentPage == 1;
  nextPageBtn.disabled = currentPage == totalPages;
  pageNumber.textContent = `Page ${currentPage}`;
}

// Initial fetch of employees
fetchEmployees();
