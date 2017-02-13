<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Inicio</title>

	<link rel="shortcut icon" type="image/png" href="favicon.ico"/>

	<link rel="stylesheet" type="text/css" href="Resources/css/bootstrap.min.css">
	<script src="Resources/js/jquery-3.1.1.min.js" type="text/javascript"></script>
	<script src="Resources/js/tether.min.js" type="text/javascript"></script>
	<script src="Resources/js/bootstrap.min.js" type="text/javascript"></script>

	<script>
		var listaCampeones;

		$(function(){
			obtenerCampeones();	
			buscarCampeon("");

			// selecciona a Annie como el primer fondo de pantalla
			cambiaFondo(1);

			/*$("tr").click(function(){
				alert($(this).attr('id'));
			});*/

			$("#txt_nombreCampeon").keyup(function(){
				var nombreCampeon = $("#txt_nombreCampeon");
				buscarCampeon(nombreCampeon.val());
			})

			
			
			

		});

		// Obtenemos la lista de todos los campeones del juego y los metemos en la variable global listaCampeones
		function obtenerCampeones(){
			$.ajax({
				url : "https://global.api.pvp.net/api/lol/static-data/las/v1.2/champion?locale=es_ES&dataById=true&champData=image&api_key=RGAPI-ab9cb372-e420-4a47-9018-066a36810c31",
				type : "get",
				async: false,
				success : function(data) {
					listaCampeones = data.data;
				},
				error: function(error) {
					alert("Ha ocurrido un error: " + error.statusText);
				}
			});
		}

		// Obtiene el o los campeones que corresponda segun texto ingresado
		function buscarCampeon(nombreCampeon)
		{
			var t_body = $("#t_body");
			//var card_columns = $(".card-columns");

			var cantidad = 0;
			var tr = "";
			var cards = "";

			var img;
			var nombre;
			var titulo;
			var id;
			//var source;

			if(nombreCampeon != "")
			{
				$.each(listaCampeones, function(index, value){

					if(meContiene(value.name, nombreCampeon))
					{
						img = "<img src='http://ddragon.leagueoflegends.com/cdn/7.3.1/img/champion/" + value.image.full + "' width='" + value.image.w + "' height='" + value.image.h + "'>";
						//source = "http://ddragon.leagueoflegends.com/cdn/7.3.1/img/champion/" + value.image.full;
						nombre = value.name;
						titulo = FirstLetterCase(value.title);
						id = value.id;

						tr += "<tr onclick='javascript:cambiaFondo(" + id + ")'> <td style='text-align: center;'>" + img + "</td> <td>" + nombre + "</td> <td>" + titulo + "</td> </tr>";

						/*cards += "<div class=\"card\">";
						cards += "<img class=\"card-img-top img-fluid\" src='" + source + "' alt=\"Card image cap\">";
						cards += "<div class=\"card-block\">";
						cards += "<h4 class=\"card-title\">" + nombre + "</h4>";
						cards += "<p class=\"card-text\">" + titulo + "</p>";
						cards += "</div>";
						cards += "</div>";*/

						cantidad++;
					}
				});

				if(cantidad == 0)
				{
					tr += "<tr> <td colspan=\"3\" style=\"text-align: center;\"> No se encontraron coincidencias. </td> </tr>";
				}
			}
			else
			{
				$.each(listaCampeones, function(index, value){

					img = "<img src='http://ddragon.leagueoflegends.com/cdn/7.3.1/img/champion/" + value.image.full + "' width='" + value.image.w + "' height='" + value.image.h + "'>";
					//source = "http://ddragon.leagueoflegends.com/cdn/7.3.1/img/champion/" + value.image.full;
					nombre = value.name;
					titulo = FirstLetterCase(value.title);
					id = value.id;

					tr += "<tr onclick='javascript:cambiaFondo(" + id + ")'> <td style='text-align: center;'>" + img + "</td> <td>" + nombre + "</td> <td>" + titulo + "</td> </tr>";

					/*cards += "<div class=\"card\">";
					cards += "<img class=\"card-img-top img-fluid\" src='" + source + "' alt=\"Card image cap\">";
					cards += "<div class=\"card-block\">";
					cards += "<h4 class=\"card-title\">" + nombre + "</h4>";
					cards += "<p class=\"card-text\">" + titulo + "</p>";
					cards += "</div>";
					cards += "</div>";*/

					cantidad++;
				});
			}

			$("#span_cantidadRegistros").html(cantidad);
			t_body.html(tr);
			//card_columns.html(cards);
		}

		// funcion que cambia el fondo de pantalla segun el id del campeon seleccionado
		function cambiaFondo(id)
		{
			$.ajax({
				url : "https://global.api.pvp.net/api/lol/static-data/las/v1.2/champion/" + id + "?champData=skins&api_key=RGAPI-ab9cb372-e420-4a47-9018-066a36810c31",
				type : "get",
				async: false,
				success : function(data) {
					var body = $("body");
					var descarga_imagen = $("#descarga_imagen");
					body.css('background-image', "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + data.key + "_0.jpg)");
					body.css('background-repeat', 'no-repeat');
					body.css('background-size', '100% 100%');
					body.css('background-attachment', 'fixed');
					body.css('background-position', 'center');

					descarga_imagen.attr('href','http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + data.key + '_0.jpg');

				},
				error: function(error) {
					alert("Ha ocurrido un error: " + error.statusText);
				}
			});
		}

		function FirstLetterCase(string){
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		function meContiene(cadena, string)
		{
			if(cadena.toLowerCase().indexOf(string.toLowerCase()) != -1){
				return true;
			}
			else
			{
				return false;
			}
		}

	</script>
	
	<style>
		#t_body tr { 
            cursor: pointer;
		}
	</style>
</head>
<body>

	<div class="container">
		<div class="row">
			<div class="col-12">
				
			</div>
		</div>
		<br>
		<div class="row">
			<div class="col-4 offset-3">
				<input type="text" id="txt_nombreCampeon" data-provide="typeahead" class="form-control" placeholder="Ingresa el Nombre del Campeón">
			</div>
			<div class="col-2">
				<a id="descarga_imagen" href="#" download class="btn btn-success"> Descarga Wallpaper </a>
			</div>
		</div>

		<br><br>

		<p style="color: white;"> <b> Cantidad Registros:  </b> <span id="span_cantidadRegistros"></span> </p>

		<table id="tb_campeones" class="table table-bordered table-hover table-inverse table-sm" style="opacity: 0.8;">
			<thead>
				<tr>
					<!-- <th style="width: 10%;">ID</th> -->
					<th style="width: 5%;">Imagen</th>
					<th style="width: 25%;">Nombre Campeón</th>
					<th style="width: 70%;">Titulo</th>
				</tr>
			</thead>
			<tbody id="t_body">

			</tbody>
		</table>

		<div class="row" id="footer">
			<div class="col-12">
				<p style="text-align: center; color: white;"> <i> Version 1.0.0 </i> </p>	
			</div>
		</div>
		

	<!-- <div class="card-columns">
	</div> -->

	</div>
</body>
</html>