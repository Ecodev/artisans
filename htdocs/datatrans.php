<html>
    <head>
        <script>

            // doc : https://api-reference.datatrans.ch/#failed-unsuccessful-authorization-response
            var message = {
                type: '<?php echo isset($_REQUEST['errorMessage']) ? 'error' : 'success' ?>',
                message: '',
                detail:  <?php echo json_encode($_REQUEST) ?>
            };
            parent.postMessage(message, "*");
        </script>
        <style>
            body {
                background: rgba(0, 0, 0, 0.5);
                color: white
            }
        </style>
    </head>
    <body>
        <?php

        //        echo "<pre>";
        //        print_r($_REQUEST);
        //        echo "</pre>";

        ?>
    </body>
</html>
