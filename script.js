var nomeInput = document.getElementById('nome');
var mInput = document.getElementById('m');
var fInput = document.getElementById('f');
var cInput = document.getElementById('c');
var iInput = document.getElementById('i');
var aInput = document.getElementById('a');
var profilePic = document.getElementById('profilePic');
var changePictureOverlay = document.getElementById('changePictureOverlay');

var ctx = document.getElementById('myChart').getContext('2d');
var introExtroCtx = document.getElementById('introExtroChart').getContext('2d');
var mentalSentimentalCtx = document.getElementById('mentalSentimentalChart').getContext('2d');

var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['M', 'F', 'C', 'I', 'A'],
        datasets: [{
            label: 'Personalidade Biológica',
            data: [],
            backgroundColor: ['#3498db', '#e74c3c', '#9b59b6', '#2ecc71', '#f39c12']
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        },
        plugins: {
            legend: {
                display: true
            },
            title: {
                display: true,
                color: '#fff'
            }
        }
    }
});

var introExtroChart = new Chart(introExtroCtx, {
    type: 'horizontalBar', // Alterado para 'horizontalBar'
    data: {
        labels: ['Introversão (I+F+A)', 'Extroversão (M+C)'],
        datasets: [{
            data: [],
            backgroundColor: ['#9b59b6', '#2ecc71']
        }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true,
                max: 100
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                color: '#fff',
                text: 'Taxa de Introversão e Extroversão de ' + nomeInput.value
            }
        }
    }
});

var mentalSentimentalChart = new Chart(mentalSentimentalCtx, {
    type: 'doughnut',
    data: {
        labels: ['Mental (A+I)', 'Sentimental (M+F+C)'],
        datasets: [{
            data: [],
            backgroundColor: ['#3498db', '#e74c3c'],
            color: '#fff'
        }]
    },
    options: {
        plugins: {
            legend: {
                display: true
            },
            title: {
                display: true,
                color: '#fff'
            }
        }
    }
});

function gerarGraficos() {
    var nome = nomeInput.value;
    var m = parseFloat(mInput.value) || 0;
    var f = parseFloat(fInput.value) || 0;
    var c = parseFloat(cInput.value) || 0;
    var i = parseFloat(iInput.value) || 0;
    var a = parseFloat(aInput.value) || 0;

    var total_mfcia = m + f + c + i + a;

    var prop_m = (m / total_mfcia) * 100;
    var prop_f = (f / total_mfcia) * 100;
    var prop_c = (c / total_mfcia) * 100;
    var prop_i = (i / total_mfcia) * 100;
    var prop_a = (a / total_mfcia) * 100;

    myChart.data.datasets[0].data = [prop_m, prop_f, prop_c, prop_i, prop_a];
    introExtroChart.data.datasets[0].data = [prop_i + prop_f + prop_a, prop_m + prop_c];
    mentalSentimentalChart.data.datasets[0].data = [prop_a + prop_i, prop_m + prop_f + prop_c];

    myChart.options.plugins.title.text = 'Distribuição da Personalidade Biológica de ' + nome;
    introExtroChart.options.plugins.title.text = 'Taxa de Introversão e Extroversão de ' + nome;
    mentalSentimentalChart.options.plugins.title.text = 'Taxa Mental e Sentimental de ' + nome;

    myChart.update();
    introExtroChart.update();
    mentalSentimentalChart.update();
}

function previewImage() {
    var input = document.getElementById('fileInput');

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            profilePic.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function clearImage() {
    profilePic.src = '';
    document.getElementById('fileInput').value = '';
}

function chooseProfilePicture() {
    document.getElementById('fileInput').click();
}

function exportToPDF() {
    var element = document.querySelector('.glassmorphism-container');
    html2pdf(element);
}

function exportToExcel() {
    var data = [
        ['Nome', 'M', 'F', 'C', 'I', 'A'],
        [nomeInput.value, mInput.value, fInput.value, cInput.value, iInput.value, aInput.value]
    ];

    var ws = XLSX.utils.aoa_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Personalidade');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;

    var fileName = 'Personalidade_' + today + '.xlsx';

    XLSX.writeFile(wb, fileName);
}

function toggleCharts() {
    var introExtroChartCanvas = document.getElementById('introExtroChart');
    var mentalSentimentalChartCanvas = document.getElementById('mentalSentimentalChart');

    if (introExtroChartCanvas.style.display === 'none') {
        introExtroChartCanvas.style.display = 'block';
        mentalSentimentalChartCanvas.style.display = 'none';
    } else {
        introExtroChartCanvas.style.display = 'none';
        mentalSentimentalChartCanvas.style.display = 'block';
    }
}
