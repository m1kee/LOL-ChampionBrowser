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

// versión actual de la web
var version = "Versión 1.1.0";



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
	let t_body = $("#t_body");
	let cantidadRegistros = $("#span_cantidadRegistros");

	// instanciamos la cantidad en cero para poder contar cuantos campeones son los que se filtran
	let cantidad = 0;
	let tr = "";

	// variables para contener la informacion de cada uno de los campeones
	let img;
	let nombre;
	let titulo;
	let id;

	// si el nombre del campeon no viene vacio, aplicamos los filtros
	if(nombreCampeon != "")
	{
		$.each(listaCampeones.data, function(index, value){
			if(meContiene(value[1].name, nombreCampeon))
			{
				img = "<img src='" + url_championSquare + value[1].image.full + "' width='" + value[1].image.w + "' height='" + value[1].image.h + "'>";
				nombre = value[1].name;
				titulo = primerLetraMayuscula(value[1].title);
				id = value[1].id;

				tr += "<tr onclick='javascript:detalleCampeon(" + id + ")' id='" + id + "' class=\"clickable\"> ";
				tr += "<td style='text-align: center;'>" + img + "</td>";
				tr += "<td style=\"vertical-align: middle;\">" + nombre + "</td>";
				tr += "<td style=\"vertical-align: middle;\">" + titulo + "</td>";
				tr += "</tr>";
				
				cantidad++;
			}
		});

		// en caso de no encontrar ningun campeón, desplegamos un mensaje especial.
		if(cantidad == 0)
		{
			tr += "<tr> <td colspan=\"3\" style=\"text-align: center;\"> No se encontraron coincidencias. </td> </tr>";
		}
	}
	// si no, mostramos todos los campeones del juego
	else
	{
		$.each(listaCampeones.data, function(index, value){
			img = "<img src='" + url_championSquare + value[1].image.full + "' width='" + value[1].image.w + "' height='" + value[1].image.h + "'>";
			nombre = value[1].name;
			titulo = primerLetraMayuscula(value[1].title);
			id = value[1].id;

			tr += "<tr onclick='javascript:detalleCampeon(" + id + ")' id='" + id + "' class=\"clickable\"> ";
			tr += "<td style='text-align: center;'>" + img + "</td>";
			tr += "<td style=\"vertical-align: middle;\">" + nombre + "</td>";
			tr += "<td style=\"vertical-align: middle;\">" + titulo + "</td>";
			tr += "</tr>";

			cantidad++;
		});
	}

	// asignamos la cantidad de campeones filtrados, para mostrarle al usuario una cantidad
	cantidadRegistros.html(cantidad);
	// y le asociamos a la tabla los rows correspondientes
	t_body.html(tr);
}

// funcion que cambia el fondo de pantalla segun el id del campeon seleccionado
function detalleCampeon(id)
{
	// primero obtenemos la informacion de las skins del campeon gracias a su id
	$.ajax({
		url : url_champion + "/" + id + "?locale=" + locale + "&champData=all&api_key=" + key,
		type : "get",
		async: false,
		success : function(data) {
			// en caso de obtener una respuesta correcta desde RIOT GAMES, asignamos la imagen del campeon al fondo de la pantalla
			// y ademas el botón permitirá al usuario descargar dicha imagen.
			let body = $("body");
			let descarga_imagen = $("#descarga_imagen");
			let nombreCampeon = data.key;
			let skins = data.skins;
			let info = data.info;
			let lore = data.lore;
			let stats = data.stats;
			let tags = data.tags;
			let title = data.title;
			let spells = data.spells;
			let pasiva = data.passive;
			let allyTips = data.allytips;
			let enemyTips = data.enemytips;

			body.css('background-image', "url(" + url_splashArt + nombreCampeon + "_0.jpg)");
			body.css('background-repeat', 'no-repeat');
			body.css('background-size', '100% 100%');
			body.css('background-attachment', 'fixed');
			body.css('background-position', 'center');

			let modalTitle = primerLetraMayuscula(nombreCampeon) + " - " + primerLetraMayuscula(title);
			$.each(tags, function(index, value){
				modalTitle += "&nbsp;&nbsp;&nbsp;<span class=\"badge badge-primary\">" + value + "</span>&nbsp;";
			});

			let cuerpoModal = "";

			// Cuerpo modal
			cuerpoModal += "<div class=\"row\">";

			cuerpoModal += "<div class=\"col-2\">";
			cuerpoModal += "<img src='" + url_loadingScreenArt + nombreCampeon + "_0.jpg" + "' alt=\"nombreCampeon\" style=\"width: 100%; height: auto;\">";
			cuerpoModal += "<p style=\"text-align: center;\"><i>Skin por defecto</i></p>";
			cuerpoModal += "</div>";

			cuerpoModal += "<div class=\"col-10\">";

			// Stats - Habilidades
			cuerpoModal += "<div class=\"row\">";

			// Stats
			cuerpoModal += "<div class=\"col-3\">";
			cuerpoModal += "<span>Ataque: </span>";
			cuerpoModal += "<div class=\"progress\">";
			cuerpoModal += "<div class=\"progress-bar bg-success progress-bar-striped progress-bar-animated\" role=\"progressbar\" style=\"width: " + info.attack + "0%\" aria-valuenow=\"" + info.attack + "0\" aria-valuemin=\"0\" aria-valuemax=\"100\">" + info.attack + "</div>";
			cuerpoModal += "</div>";
			cuerpoModal += "<span>Defensa: </span>";
			cuerpoModal += "<div class=\"progress\">";
			cuerpoModal += "<div class=\"progress-bar bg-warning progress-bar-striped progress-bar-animated\" role=\"progressbar\" style=\"width: " + info.defense + "0%\" aria-valuenow=\"" + info.defense + "0\" aria-valuemin=\"0\" aria-valuemax=\"100\">" + info.defense + "</div>";
			cuerpoModal += "</div>";
			cuerpoModal += "<span>Magia: </span>";
			cuerpoModal += "<div class=\"progress\">";
			cuerpoModal += "<div class=\"progress-bar bg-info progress-bar-striped progress-bar-animated\" role=\"progressbar\" style=\"width: " + info.magic + "0%\" aria-valuenow=\"" + info.magic + "0\" aria-valuemin=\"0\" aria-valuemax=\"100\">" + info.magic + "</div>";
			cuerpoModal += "</div>";
			cuerpoModal += "<span>Dificultad: </span>";
			cuerpoModal += "<div class=\"progress\">";
			cuerpoModal += "<div class=\"progress-bar bg-danger progress-bar-striped progress-bar-animated\" role=\"progressbar\" style=\"width: " + info.difficulty + "0%\" aria-valuenow=\"" + info.difficulty + "0\" aria-valuemin=\"0\" aria-valuemax=\"100\">" + info.difficulty + "</div>";
			cuerpoModal += "</div>";
			cuerpoModal += "</div>";
			// Fin Stats

			// Habilidades
			cuerpoModal += "<div class=\"col-9\">";
			cuerpoModal += "<span>Habilidades: &nbsp;&nbsp;</span>";
			// pasiva
			cuerpoModal += "<img src='" + url_passive + pasiva.image.full + "' class=\"rounded\" aria-hidden=\"true\" rel=\"popover\" role=\"button\" data-html=\"true\" data-placement=\"bottom\" title='<b>" + pasiva.name + "</b>' data-content='" + pasiva.description + "' />&nbsp;&nbsp;";
			$.each(spells, function(index, value){
				cuerpoModal += "<img src='" + url_spells + value.image.full + "' class=\"rounded\" aria-hidden=\"true\" rel=\"popover\" role=\"button\" data-html=\"true\" data-placement=\"bottom\" title='<b>" + value.name + "</b>' data-content='" + value.description + " <br/> <b>Enfriamiento: &nbsp;&quot;</b>" + value.cooldownBurn + "&nbsp;segs.&quot;' />&nbsp;&nbsp;";
			});
			cuerpoModal += "</div>";
			// Fin Habilidades
			
			cuerpoModal += "</div>";
			// Fin Stats - Habilidades
			
			// Salto linea
			cuerpoModal += "<br/>";

			// Ally Tips
			cuerpoModal += "<span>Consejos<span>";
			cuerpoModal += "<ul>";
			$.each(allyTips, function(index, value){
				cuerpoModal += "<li>" + value + "</li>";
			});
			cuerpoModal += "</ul>";

			// Enemy Tips
			cuerpoModal += "<span>Como jugar contra " + nombreCampeon + "<span>";
			cuerpoModal += "<ul>";
			$.each(enemyTips, function(index, value){
				cuerpoModal += "<li>" + value + "</li>";
			});
			cuerpoModal += "</ul>";

			// Lore
			cuerpoModal += "<h5 style=\"text-align: center;\"><b>Historia</b><h5>";
			cuerpoModal += "<blockquote class=\"blockquote\">";
			cuerpoModal += "<p class=\"mb-0\"><small>" + lore + "</small></p>";
			cuerpoModal += "</blockquote>";
			// Fin Lore

			cuerpoModal += "</div>";

			cuerpoModal += "</div>";
			// Fin cuerpo modal

			$(".modal-title").html(modalTitle);
			$(".modal-body").html(cuerpoModal);
			$(".modal").modal('show');

			descarga_imagen.attr('href', url_splashArt + data.key + '_0.jpg');
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$(".modal-title").html('Ups...');
			$(".modal-body").html('<p><b>Algo ha salido mal :( </b></p><p>Si el error persiste envíe un correo a cb@help.com</p>');
			$(".modal").modal('show');
		}
	});
}

// funcion que cambia el fondo de pantalla segun el id del campeon
function setFondo(id)
{
	// primero obtenemos la informacion de las skins del campeon gracias a su id
	$.ajax({
		url : url_champion + "/" + id + "?locale=" + locale + "&champData=all&api_key=" + key,
		type : "get",
		async: false,
		success : function(data) {
			// en caso de obtener una respuesta correcta desde RIOT GAMES, asignamos la imagen del campeon al fondo de la pantalla
			// y ademas el botón permitirá al usuario descargar dicha imagen.
			let body = $("body");
			let descarga_imagen = $("#descarga_imagen");
			let nombreCampeon = data.key;

			body.css('background-image', "url(" + url_splashArt + nombreCampeon + "_0.jpg)");
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

// function que imprime la version actual de la página
function showVersion()
{
	document.write(version);
}
