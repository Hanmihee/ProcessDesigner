<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<!-- 합쳐지고 최소화된 최신 CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">

<!-- 부가적인 테마 -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">

<!-- 합쳐지고 최소화된 최신 자바스크립트 -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
<script src="http://code.jquery.com/jquery-1.12.4.js"></script>
</head>
<body>
	<div id="container">
		<div id="header" style="background: red; height: 250px;"></div>
		<div id="contents" class="row">
			<div id="left" class="col-sm-3">
				<div id="up" style="background: yellow; height: 400px;"></div>
				<div id="down" style="background: green; height: 400px"></div>
			</div>
			<div id="center" class="col-sm-6" style="background: blue; height: 800px;"></div>
			<div id="right" class="col-sm-3" style="background: purple; height: 800px;"></div>
		</div>
		<div id="footer" style="background: navy;"></div>
	</div>
</body>
</html>