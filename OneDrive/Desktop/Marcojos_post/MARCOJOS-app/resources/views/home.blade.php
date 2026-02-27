<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HOME</title>
</head>
<body>
    <div class="card mb-4">
        <div class="card-header">Categories</div>
            <div class="card-body">
                <div class="row">  
                    <div class="col-sm-6">
                        <ul class="list-unstyled mb-D">
                            @foreach ($categories as $category)
                            <li><a href="#!">{{ $category }}</a></li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
         </div>
    </div>
</body>
</html>