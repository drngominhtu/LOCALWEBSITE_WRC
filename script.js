// Hàm tạo màu ngẫu nhiên
function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Hàm thêm giá trị vào biểu đồ
function addValueToGraph(graphContainer, valname, address) {
    const valueLabels = graphContainer.querySelector('.value-labels');
    const plotArea = graphContainer.querySelector('.plot-area');
    const color = generateRandomColor();

    // Đảm bảo valueLabels và plotArea tồn tại
    if (!valueLabels || !plotArea) {
        console.error('Graph container is missing required elements.');
        return;
    }

    // Thêm valname vào value-labels
    const newValueLabel = document.createElement('div');
    newValueLabel.className = 'val-label';
    newValueLabel.innerHTML = `
        <span class="color-dot" style="background-color: ${color};"></span>
        <span>${valname}</span>
    `;
    valueLabels.appendChild(newValueLabel);

    // Thêm dòng tương ứng vào plot-area
    const newLine = document.createElement('div');
    newLine.className = 'line';
    newLine.style.backgroundColor = color;
    newLine.style.height = '2px'; // Chiều cao ví dụ
    newLine.style.position = 'absolute';
    newLine.style.width = '100%'; // Chiều rộng ví dụ
    newLine.style.top = `${Math.random() * 100}%`; // Vị trí ngẫu nhiên để minh họa
    plotArea.appendChild(newLine);
}

// Hàm thêm biểu đồ con mới
function addNewSubgraph() {
    const subgraph1Container = document.querySelector('.subgraph1');
    const newSubgraph = document.createElement('div');
    const subgraphCount = subgraph1Container.querySelectorAll('div').length + 1;
    newSubgraph.className = `subgraph1_${subgraphCount}`;
    newSubgraph.innerHTML = `
        <div class="graphUI">
            <button class="delete-graph-btn">Delete</button>
            <div class="graph-container">
                <div class="y-axis">
                    <div class="y-labels">
                        <span>100</span>
                        <span>75</span>
                        <span>50</span>
                        <span>25</span>
                        <span>0</span>
                    </div>
                    <div class="value-labels">
                        <!-- Các giá trị sẽ được thêm động ở đây -->
                    </div>
                </div>
                <div class="graph-content">
                    <div class="grid"></div>
                    <div class="plot-area">
                        <!-- Các dòng sẽ được thêm động ở đây -->
                    </div>
                </div>
                <div class="x-axis">
                    <div class="x-labels">
                        <span>0s</span>
                        <span>30s</span>
                        <span>60s</span>
                        <span>90s</span>
                        <span>120s</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="addvalsbutton">
            <div class="addvalgraph">
                <div class="input-field">
                    <label for="valname">#Valname</label>
                    <input type="text" id="valname" placeholder="Nhập tên giá trị">
                </div>
                <div class="input-field">
                    <label for="address">#Address</label>
                    <input type="text" id="address" placeholder="Nhập địa chỉ">
                </div>
            </div>
            <div class="okbutton">
                <button>OK</button>
            </div>
        </div>
    `;
    subgraph1Container.appendChild(newSubgraph);

    // Thêm chức năng xóa cho biểu đồ con mới
    const deleteBtn = newSubgraph.querySelector('.delete-graph-btn');
    deleteBtn.addEventListener('click', () => {
        newSubgraph.remove();
    });

    // Thêm chức năng để thêm giá trị vào biểu đồ mới
    const okButton = newSubgraph.querySelector('.okbutton button');
    okButton.addEventListener('click', () => {
        const valnameInput = newSubgraph.querySelector('#valname');
        const addressInput = newSubgraph.querySelector('#address');
        const valname = valnameInput.value.trim();
        const address = addressInput.value.trim();

        if (valname && address) {
            addValueToGraph(newSubgraph.querySelector('.graph-container'), valname, address);
            valnameInput.value = '';
            addressInput.value = '';
        } else {
            alert('Vui lòng nhập cả tên giá trị và địa chỉ.');
        }
    });
}

// Hàm xử lý sự kiện nút thêm biểu đồ
function setupAddGraphButton() {
    document.querySelectorAll('.addgraphbutton button').forEach((button) => {
        button.addEventListener('click', addNewSubgraph);
    });
}

// Hàm xử lý sự kiện nút OK để thêm giá trị vào biểu đồ
function setupOkButton() {
    document.querySelectorAll('.addvalsbutton .okbutton button').forEach((button) => {
        button.addEventListener('click', (event) => {
            const addValsButton = event.target.closest('.addvalsbutton');
            const graphUI = addValsButton.previousElementSibling; // Lấy phần tử graphUI liền trước
            const graphContainer = graphUI.querySelector('.graph-container');
            const valnameInput = addValsButton.querySelector('#valname');
            const addressInput = addValsButton.querySelector('#address');
            const valname = valnameInput.value.trim();
            const address = addressInput.value.trim();

            if (valname && address) {
                addValueToGraph(graphContainer, valname, address);
                valnameInput.value = '';
                addressInput.value = '';
            } else {
                alert('Vui lòng nhập cả tên giá trị và địa chỉ.');
            }
        });
    });
}

// Hàm xử lý sự kiện cho biểu đồ mặc định (subgraph1_1)
function setupDefaultGraph() {
    document.querySelectorAll('.subgraph1_1 .okbutton button').forEach((button) => {
        button.addEventListener('click', () => {
            const graphContainer = button.closest('.graphUI').querySelector('.graph-container');
            const valnameInput = button.closest('.addvalsbutton').querySelector('#valname');
            const addressInput = button.closest('.addvalsbutton').querySelector('#address');
            const valname = valnameInput.value.trim();
            const address = addressInput.value.trim();

            if (valname && address) {
                addValueToGraph(graphContainer, valname, address);
                valnameInput.value = '';
                addressInput.value = '';
            } else {
                alert('Vui lòng nhập cả tên giá trị và địa chỉ.');
            }
        });
    });
}

// Hàm tải dữ liệu từ file data.txt và điền vào bảng
function loadDataToTables() {
    fetch('./data.txt') // Đảm bảo đường dẫn tương đối chính xác
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const rows = data.trim().split('\n').slice(1); // Bỏ dòng tiêu đề và loại bỏ khoảng trắng
            const table1Body = document.querySelector('.table1 tbody'); // Đảm bảo đúng selector
            const table2Body = document.querySelector('.table2 tbody'); // Đảm bảo đúng selector

            if (!table1Body || !table2Body) {
                console.error('Table elements not found.');
                return;
            }

            rows.forEach((row, index) => {
                const [valname, address] = row.split(',').map(item => item.trim()); // Loại bỏ khoảng trắng thừa
                if (valname && address) {
                    const tableRow = `<tr><td>${valname}</td><td>${address}</td></tr>`;
                    if (index % 2 === 0) {
                        table1Body.innerHTML += tableRow; // Điền vào bảng WatchR1
                    } else {
                        table2Body.innerHTML += tableRow; // Điền vào bảng WatchR2
                    }
                }
            });
        })
        .catch(error => console.error('Error loading data:', error));
}

// Hàm khởi tạo các sự kiện
function initialize() {
    setupAddGraphButton();
    setupOkButton();
    setupDefaultGraph();
    loadDataToTables(); // Thêm dòng này
}

// Gọi hàm khởi tạo khi tải trang
initialize();
