export const draftTemplate = () => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF</title>
    <style>
        html {
            font-size: 20px;
        }

        p {
            margin: 4px;
        }

        body {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
            max-height: 100vh;
            font-size: 16px;
        }

        .header {
            height: 20vh;
            padding: 0 11vw;
            display: flex;
            justify-content: end;
            align-items: center;
        }

        .main {
            display: flex;
            flex-direction: column;
            margin: 0 2vw 2vw 2vw;
            padding: 0 2vw 5vh 2vw;
        }

        .heading {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 20vh;

        }

        .heading h1 {
            font-size: 26px;
            text-transform: uppercase;
            font-weight: 400;
            margin-top: 170px;
        }

        .heading__user {
            font-size: 12px;
        }

        .heading__info {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
        }

        .heading__invoice {
            margin-top: 165px;
            margin-right: 30px;
        }

        .heading__date {
            margin-bottom: 6px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }

        table th {
            text-align: left;
            font-weight: 400;
        }

        .table_head__description {
            width: 50%
        }

        thead {
            border-bottom: 2px solid #000;
        }

        tfoot {
            border-top: 2px solid #dcd4d4df;
        }

        thead .table_head__amount {
            width: 20%;
            text-align: right;
        }

        th,
        td {
            padding: 5px 0;
        }
    </style>
</head>
<body>
    <div class="main">
        <div class="heading">
            <div class="heading__user">
                <h1>Draft pdf</h1>
                <p>This is draft pdf</p>
            </div>
        </div>
    </div>
</body>
</html>`;
};
