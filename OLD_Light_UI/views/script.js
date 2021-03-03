function show_cat_income() {
    document.getElementById('show-income').style.display = 'block';
    document.getElementById('show-expenses').style.display = 'none';
}

function show_cat_expenses() {
    document.getElementById('show-expenses').style.display = 'block';
    document.getElementById('show-income').style.display = 'none';
}

const amount = document.getElementById('amount')
const form = document.getElementById('form')
const errorElement = document.getElementById('notification')

if (form) {
    form.addEventListener('submit', (e) => {
        let messages = []
        if (amount) {
            if (isNaN(amount.value)) {
                messages.push('Invalid Amount...')
            }

            if (messages.length > 0) {
                e.preventDefault()
                errorElement.innerText = messages.join(', ')
                errorElement.style.color = "#FF4B00";

            }
        }
    })
}


function exportPDF() {
    let sTable = document.getElementById('data_Table').innerHTML;

    let style = "<style>";
    style = style + "table {width: 70%;font: 17px Calibri;}";
    style = style + "table, th, td {border: solid 1px #000; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: left;}";
    style = style + "</style>";


    let win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    win.document.write('<title>S & D Budget-Sheet</title>');
    win.document.write(style);
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write('<br><br><br><center><strong>S & D Budget-Sheet</strong><br>(Report)<br><br></center>');
    win.document.write(sTable);
    win.document.write('</body></html>');

    win.document.close();

    win.print();
}

function searchTable() {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("dataTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}