// variables globales 
var listaCampeones; // contiene la lista completa de campiones de league of legends
var key = "RGAPI-ab9cb372-e420-4a47-9018-066a36810c31"; // contiene la key para la api de riot games
var locale = "es_ES"; // establece el idioma, en caso de no estar, toma el idioma de la region en la que se encuentra
var url_champion = "https://global.api.pvp.net/api/lol/static-data/las/v1.2/champion"; // si se le agrega /{id} traerá la información del campeon solicitado

// url's static data 
var url_profileIcon = "http://ddragon.leagueoflegends.com/cdn/7.3.3/img/profileicon/"; // recibe el id de la imagen y su formato ej: 588.png
var url_splashArt = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"; // recibe nombre de campeon y el numero de skin ej: Aatrox_0.jpg 
var url_loadingScreenArt = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/"; // recibe nombre de campeon y el numero de skin ej: Aatrox_0.jpg 
var url_championSquare = "http://ddragon.leagueoflegends.com/cdn/7.3.3/img/champion/"; // recibe el nombre del campeon y su formato ej: Aatrox.png
var url_passive = "http://ddragon.leagueoflegends.com/cdn/7.3.3/img/passive/"; // recibe el nombre de la imagen ej: Anivia_P.png 
var url_spells = "http://ddragon.leagueoflegends.com/cdn/7.3.3/img/spell/"; // recibe el nombre del hechizo con su formato ej: FlashFrost.png o SummonerFlash.png
var url_items = "http://ddragon.leagueoflegends.com/cdn/7.3.3/img/item/"; // recibe el id del item ej: 1001.png -- son las botas 
var url_masteries = "http://ddragon.leagueoflegends.com/cdn/7.3.3/img/mastery/"; // recibe el id de la maestria ej: 6111.png
var url_runes = "http://ddragon.leagueoflegends.com/cdn/7.3.3/img/rune/"; // recibe el id de la runa ej: 8001.png
var url_scoreBoards = "http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/"; // recibe champion, gold, items, minion, score, spells y formato png ej: champion.png



// Obtenemos la lista de todos los campeones del juego, junto con su respectivo champData y los metemos en la variable global listaCampeones
function obtenerCampeones(champData){
	$.ajax({
		url : url_champion + "?locale=" + locale +  "&champData=" + champData + "&api_key=" + key,
		type : "get",
		async: false,
		success : function(data) {
			listaCampeones = data;
			// de esta forma ordenamos el JSON por el nombre del campeón
			listaCampeones.data = Object.entries(listaCampeones.data).sort(OrdenarPorNombreAscendente);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$(".modal-title").html('Ups...');
			$(".modal-body").html('<p><b>Algo ha salido mal :( </b></p><p>Si el error persiste envíe un correo a cb@help.com</p>');
			$(".modal").modal('show');
		}
	});
}

// Obtiene el o los campeones que corresponda segun texto ingresado
function buscarCampeon(nombreCampeon)
{
	var t_body = $("#t_body");
	var cantidadRegistros = $("#span_cantidadRegistros");

	var cantidad = 0;
	var tr = "";
	var cards = "";

	var img;
	var nombre;
	var titulo;
	var id;

	if(nombreCampeon != "")
	{
		$.each(listaCampeones.data, function(index, value){
			if(meContiene(value[1].name, nombreCampeon))
			{
				img = "<img src='" + url_championSquare + value[1].image.full + "' width='" + value[1].image.w + "' height='" + value[1].image.h + "'>";
				nombre = value[1].name;
				titulo = primerLetraMayuscula(value[1].title);
				id = value[1].id;

				tr += "<tr onclick='javascript:cambiaFondo(" + id + ")' id='" + id + "' class=\"clickable\"> <td style='text-align: center;'>" + img + "</td> <td>" + nombre + "</td> <td>" + titulo + "</td> </tr>";
				
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
		$.each(listaCampeones.data, function(index, value){
			img = "<img src='" + url_championSquare + value[1].image.full + "' width='" + value[1].image.w + "' height='" + value[1].image.h + "'>";
			nombre = value[1].name;
			titulo = primerLetraMayuscula(value[1].title);
			id = value[1].id;

			tr += "<tr onclick='javascript:cambiaFondo(" + id + ")' id='" + id + "' class=\"clickable\"> <td style='text-align: center;'>" + img + "</td> <td>" + nombre + "</td> <td>" + titulo + "</td> </tr>";
			cantidad++;
		});
	}

	cantidadRegistros.html(cantidad);
	t_body.html(tr);
}

// funcion que cambia el fondo de pantalla segun el id del campeon seleccionado
function cambiaFondo(id)
{
	$.ajax({
		url : url_champion + "/" + id + "?champData=skins&api_key=" + key,
		type : "get",
		async: false,
		success : function(data) {
			var body = $("body");
			var descarga_imagen = $("#descarga_imagen");
			body.css('background-image', "url(" + url_splashArt + data.key + "_0.jpg)");
			body.css('background-repeat', 'no-repeat');
			body.css('background-size', '100% 100%');
			body.css('background-attachment', 'fixed');
			body.css('background-position', 'center');

			descarga_imagen.attr('href', url_splashArt + data.key + '_0.jpg');

		},
		error: function(jqXHR, textStatus, errorThrown) {
			$(".modal-title").html('Ups...');
			$(".modal-body").html('<p><b>Algo ha salido mal :( </b></p><p>Si el error persiste envíe un correo a cb@help.com</p>');
			$(".modal").modal('show');
		}
	});
}

// orden ascendente por el name del campeón
function OrdenarPorNombreAscendente(x,y) {
	return ((x[0] == y[0]) ? 0 : ((x[0] > y[0]) ? 1 : -1 ));
}

