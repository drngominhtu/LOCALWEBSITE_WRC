// Object để lưu trữ các biểu đồ
const charts = {};

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
    const color = generateRandomColor();

    // Đảm bảo valueLabels tồn tại
    if (!valueLabels) {
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

    // Cập nhật dữ liệu cho biểu đồ
    const chartId = graphContainer.querySelector('canvas').id;
    const chart = charts[chartId];

    if (chart) {
        // Thêm dữ liệu mới vào biểu đồ
        chart.data.datasets.push({
            label: valname,
            data: Array.from({ length: chart.data.labels.length }, () => Math.random() * 100),
            borderColor: color,
            fill: false
        });
        chart.update();
    } else {
        console.error(`Chart with ID ${chartId} not found.`);
    }
}

// Hàm tạo biểu đồ
function createChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0s', '30s', '60s', '90s', '120s'],
            datasets: []
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    return chart;
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
                <canvas id="myLineChart${subgraphCount}"></canvas>
                <div class="value-labels">
                    <!-- Các giá trị sẽ được thêm động ở đây -->
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

    // Tạo biểu đồ mới
    const canvasId = `myLineChart${subgraphCount}`;
    charts[canvasId] = createChart(canvasId);

    // Thêm chức năng xóa cho biểu đồ con mới
    const deleteBtn = newSubgraph.querySelector('.delete-graph-btn');
    deleteBtn.addEventListener('click', () => {
        newSubgraph.remove();
        delete charts[canvasId]; // Xóa biểu đồ khỏi object charts
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

// Hàm tải dữ liệu từ file data.txt và điền vào bảng
function loadDataToTables() {
    fetch('./data.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const rows = data.trim().split('\n').slice(1); // Bỏ dòng tiêu đề và loại bỏ khoảng trắng
            const table1Body = document.querySelector('.table1 tbody');
            const table2Body = document.querySelector('.table2 tbody');

            if (!table1Body || !table2Body) {
                console.error('Table elements not found.');
                return;
            }

            rows.forEach((row, index) => {
                const [valname, address] = row.split(',').map(item => item.trim());
                if (valname && address) {
                    const tableRow = `<tr><td>${valname}</td><td>${address}</td></tr>`;
                    if (index % 2 === 0) {
                        table1Body.innerHTML += tableRow;
                    } else {
                        table2Body.innerHTML += tableRow;
                    }
                }
            });
        })
        .catch(error => console.error('Error loading data:', error));
}

// Hàm xử lý sự kiện cho biểu đồ mặc định
function setupDefaultGraph(graphId, containerSelector) {
    const graphContainer = document.querySelector(containerSelector);
    const okButton = graphContainer.querySelector('.okbutton button');

    if (!graphContainer || !okButton) {
        console.error(`Default graph container or OK button not found for ${graphId}`);
        return;
    }

    // Thêm sự kiện cho nút OK
    okButton.addEventListener('click', () => {
        const valnameInput = graphContainer.querySelector('#valname');
        const addressInput = graphContainer.querySelector('#address');
        const valname = valnameInput.value.trim();
        const address = addressInput.value.trim();

        if (valname && address) {
            addValueToGraph(graphContainer.querySelector('.graph-container'), valname, address);
            valnameInput.value = '';
            addressInput.value = '';
        } else {
            alert('Vui lòng nhập cả tên giá trị và địa chỉ.');
        }
    });

    // Tạo biểu đồ mặc định
    charts[graphId] = createChart(graphId);
}

// Hàm khởi tạo các sự kiện
function initialize() {
    setupAddGraphButton();
    loadDataToTables();

    // Thiết lập biểu đồ mặc định cho từng trang
    if (document.getElementById('myLineChart')) {
        setupDefaultGraph('myLineChart', '.subgraph1_1');
    }
    if (document.getElementById('myLineChartR1')) {
        setupDefaultGraph('myLineChartR1', '.subgraph1_1');
    }
    if (document.getElementById('myLineChartR2')) {
        setupDefaultGraph('myLineChartR2', '.subgraph1_1');
    }
}

// Gọi hàm khởi tạo khi tải trang
initialize();
