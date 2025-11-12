// Data storage
let students = [
    { rollNo: '001', name: 'Rahul Sharma', class: '10th A', contact: '9876543210' },
    { rollNo: '002', name: 'Priya Patel', class: '10th A', contact: '9876543211' },
    { rollNo: '003', name: 'Amit Kumar', class: '10th B', contact: '9876543212' }
];

let fees = [
    { rollNo: '001', totalFees: 50000, paidAmount: 50000, dueDate: '2025-03-15', status: 'Paid' },
    { rollNo: '002', totalFees: 50000, paidAmount: 30000, dueDate: '2025-03-20', status: 'Partial' },
    { rollNo: '003', totalFees: 50000, paidAmount: 0, dueDate: '2025-03-25', status: 'Pending' }
];

let library = [
    { rollNo: '001', bookTitle: 'Mathematics Grade 10', issueDate: '2025-11-01', returnDate: '2025-11-15', status: 'Issued' },
    { rollNo: '002', bookTitle: 'Science Fundamentals', issueDate: '2025-10-20', returnDate: '2025-11-05', status: 'Returned' }
];

let marks = [
    { rollNo: '001', math: 85, science: 90, english: 78, history: 82 },
    { rollNo: '002', math: 92, science: 88, english: 85, history: 90 }
];

let attendance = [
    { rollNo: '001', date: '2025-11-11', status: 'Present' },
    { rollNo: '002', date: '2025-11-11', status: 'Present' },
    { rollNo: '003', date: '2025-11-11', status: 'Absent' }
];

// Initialize
function init() {
    renderStudents();
    renderFees();
    renderLibrary();
    renderMarks();
    renderAttendance();
    updateStudentDropdowns();
}

// Navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Students functions
function renderStudents() {
    const tbody = document.getElementById('studentsTable');
    tbody.innerHTML = '';

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><h3>No students found</h3><p>Add your first student to get started</p></td></tr>';
        return;
    }

    students.forEach(student => {
        tbody.innerHTML += `
            <tr>
                <td>${student.rollNo}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteStudent('${student.rollNo}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

function addStudent(e) {
    e.preventDefault();
    const student = {
        rollNo: document.getElementById('rollNo').value,
        name: document.getElementById('studentName').value,
        class: document.getElementById('studentClass').value,
        contact: document.getElementById('contact').value
    };
    students.push(student);
    renderStudents();
    updateStudentDropdowns();
    closeModal('studentModal');
    e.target.reset();
}

function deleteStudent(rollNo) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.rollNo !== rollNo);
        renderStudents();
        updateStudentDropdowns();
    }
}

function searchStudents(query) {
    const tbody = document.getElementById('studentsTable');
    const filtered = students.filter(s => 
        s.rollNo.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.class.toLowerCase().includes(query.toLowerCase())
    );

    tbody.innerHTML = '';
    filtered.forEach(student => {
        tbody.innerHTML += `
            <tr>
                <td>${student.rollNo}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteStudent('${student.rollNo}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Fees functions
function renderFees() {
    const tbody = document.getElementById('feesTable');
    tbody.innerHTML = '';

    let totalAmount = 0;
    let collectedAmount = 0;

    fees.forEach(fee => {
        const student = students.find(s => s.rollNo === fee.rollNo);
        if (!student) return;

        totalAmount += fee.totalFees;
        collectedAmount += fee.paidAmount;
        const pending = fee.totalFees - fee.paidAmount;

        let statusBadge = '';
        if (fee.paidAmount >= fee.totalFees) {
            statusBadge = '<span class="badge badge-success">Paid</span>';
        } else if (fee.paidAmount > 0) {
            statusBadge = '<span class="badge badge-warning">Partial</span>';
        } else {
            statusBadge = '<span class="badge badge-danger">Pending</span>';
        }

        tbody.innerHTML += `
            <tr>
                <td>${student.rollNo}</td>
                <td>${student.name}</td>
                <td>₹${fee.totalFees}</td>
                <td>₹${fee.paidAmount}</td>
                <td>₹${pending}</td>
                <td>${fee.dueDate}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteFees('${fee.rollNo}')">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById('totalFees').textContent = `₹${totalAmount}`;
    document.getElementById('collectedFees').textContent = `₹${collectedAmount}`;
    document.getElementById('pendingFees').textContent = `₹${totalAmount - collectedAmount}`;
}

function addFees(e) {
    e.preventDefault();
    const fee = {
        rollNo: document.getElementById('feesStudent').value,
        totalFees: parseInt(document.getElementById('totalAmount').value),
        paidAmount: parseInt(document.getElementById('paidAmount').value),
        dueDate: document.getElementById('dueDate').value
    };
    fees.push(fee);
    renderFees();
    closeModal('feesModal');
    e.target.reset();
}

function deleteFees(rollNo) {
    if (confirm('Are you sure you want to delete this fee record?')) {
        fees = fees.filter(f => f.rollNo !== rollNo);
        renderFees();
    }
}

// Library functions
function renderLibrary() {
    const tbody = document.getElementById('libraryTable');
    tbody.innerHTML = '';

    library.forEach((record, idx) => {
        const student = students.find(s => s.rollNo === record.rollNo);
        if (!student) return;

        const statusBadge = record.status === 'Issued' 
            ? '<span class="badge badge-warning">Issued</span>'
            : '<span class="badge badge-success">Returned</span>';

        tbody.innerHTML += `
            <tr>
                <td>${student.rollNo}</td>
                <td>${student.name}</td>
                <td>${record.bookTitle}</td>
                <td>${record.issueDate}</td>
                <td>${record.returnDate}</td>
                <td>${statusBadge}</td>
                <td>
                    ${record.status === 'Issued' ? `<button class="btn btn-success" onclick="returnBook(${idx})">Return</button>` : ''}
                    <button class="btn btn-danger" onclick="deleteLibraryRecord(${idx})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function issueBook(e) {
    e.preventDefault();
    const record = {
        rollNo: document.getElementById('libraryStudent').value,
        bookTitle: document.getElementById('bookTitle').value,
        issueDate: document.getElementById('issueDate').value,
        returnDate: document.getElementById('returnDate').value,
        status: 'Issued'
    };
    library.push(record);
    renderLibrary();
    closeModal('libraryModal');
    e.target.reset();
}

function returnBook(idx) {
    library[idx].status = 'Returned';
    renderLibrary();
}

function deleteLibraryRecord(idx) {
    if (confirm('Are you sure you want to delete this library record?')) {
        library.splice(idx, 1);
        renderLibrary();
    }
}

// Marks functions
function renderMarks() {
    const tbody = document.getElementById('marksTable');
    tbody.innerHTML = '';

    marks.forEach((record, idx) => {
        const student = students.find(s => s.rollNo === record.rollNo);
        if (!student) return;

        const total = record.math + record.science + record.english + record.history;
        const percentage = (total / 400 * 100).toFixed(2);
        const grade = calculateGrade(percentage);

        tbody.innerHTML += `
            <tr>
                <td>${student.rollNo}</td>
                <td>${student.name}</td>
                <td>${record.math}</td>
                <td>${record.science}</td>
                <td>${record.english}</td>
                <td>${record.history}</td>
                <td>${total}</td>
                <td>${percentage}%</td>
                <td><span class="badge badge-info">${grade}</span></td>
                <td>
                    <button class="btn btn-danger" onclick="deleteMarks(${idx})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function calculateGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'D';
}

function addMarks(e) {
    e.preventDefault();
    const record = {
        rollNo: document.getElementById('marksStudent').value,
        math: parseInt(document.getElementById('mathMarks').value),
        science: parseInt(document.getElementById('scienceMarks').value),
        english: parseInt(document.getElementById('englishMarks').value),
        history: parseInt(document.getElementById('historyMarks').value)
    };
    marks.push(record);
    renderMarks();
    closeModal('marksModal');
    e.target.reset();
}

function deleteMarks(idx) {
    if (confirm('Are you sure you want to delete this marks record?')) {
        marks.splice(idx, 1);
        renderMarks();
    }
}

// Attendance functions
function renderAttendance() {
    const tbody = document.getElementById('attendanceTable');
    tbody.innerHTML = '';

    attendance.forEach((record, idx) => {
        const student = students.find(s => s.rollNo === record.rollNo);
        if (!student) return;

        let statusBadge = '';
        if (record.status === 'Present') {
            statusBadge = '<span class="badge badge-success">Present</span>';
        } else if (record.status === 'Absent') {
            statusBadge = '<span class="badge badge-danger">Absent</span>';
        } else {
            statusBadge = '<span class="badge badge-warning">Leave</span>';
        }

        tbody.innerHTML += `
            <tr>
                <td>${student.rollNo}</td>
                <td>${student.name}</td>
                <td>${record.date}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteAttendance(${idx})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function markAttendance(e) {
    e.preventDefault();
    const record = {
        rollNo: document.getElementById('attendanceStudent').value,
        date: document.getElementById('attendanceDate').value,
        status: document.getElementById('attendanceStatus').value
    };
    attendance.push(record);
    renderAttendance();
    closeModal('attendanceModal');
    e.target.reset();
}

function deleteAttendance(idx) {
    if (confirm('Are you sure you want to delete this attendance record?')) {
        attendance.splice(idx, 1);
        renderAttendance();
    }
}

// Update dropdowns
function updateStudentDropdowns() {
    const selects = ['feesStudent', 'libraryStudent', 'marksStudent', 'attendanceStudent'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select Student</option>';
        students.forEach(student => {
            select.innerHTML += `<option value="${student.rollNo}">${student.rollNo} - ${student.name}</option>`;
        });
    });
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Set default date to today
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;
    document.getElementById('issueDate').value = today;
}

// Initialize the app
window.onload = function() {
    init();
    setDefaultDates();
};