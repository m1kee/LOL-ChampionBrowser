// variables globales 
var listaCampeones; // contiene la lista completa de campiones de league of legends
var key = "RGAPI-ab9cb372-e420-4a47-9018-066a36810c31"; // contiene la key de desarrollo para la api de riot games
var locale = "es_ES"; // establece el idioma, en caso de no estar, toma el idioma de la region en la que se encuentra
var url_champion = "https://global.api.pvp.net/api/lol/static-data/las/v1.2/champion"; // si se le agrega /{id} traerá la información del campeon solicitado
var url_championFreeToPlay = "https://las.api.pvp.net/api/lol/las/v1.2/champion?freeToPlay=true" + "&api_key=" + key; // url de champs free to play

// url's static data 
var url_profileIcon = "http://ddragon.leagueoflegends.com/cdn/7.4.3/img/profileicon/"; // recibe el id de la imagen y su formato ej: 588.png
var url_splashArt = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"; // recibe nombre de campeon y el numero de skin ej: Aatrox_0.jpg 
var url_loadingScreenArt = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/"; // recibe nombre de campeon y el numero de skin ej: Aatrox_0.jpg 
var url_championSquare = "http://ddragon.leagueoflegends.com/cdn/7.4.3/img/champion/"; // recibe el nombre del campeon y su formato ej: Aatrox.png
var url_passive = "http://ddragon.leagueoflegends.com/cdn/7.2.1/img/passive/"; // recibe el nombre de la imagen ej: Anivia_P.png 
var url_spells = "http://ddragon.leagueoflegends.com/cdn/7.2.1/img/spell/"; // recibe el nombre del hechizo con su formato ej: FlashFrost.png o SummonerFlash.png
var url_items = "http://ddragon.leagueoflegends.com/cdn/7.2.1/img/item/"; // recibe el id del item ej: 1001.png -- son las botas 
var url_masteries = "http://ddragon.leagueoflegends.com/cdn/7.2.1/img/mastery/"; // recibe el id de la maestria ej: 6111.png
var url_runes = "http://ddragon.leagueoflegends.com/cdn/7.2.1/img/rune/"; // recibe el id de la runa ej: 8001.png
var url_scoreBoards = "http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/"; // recibe champion, gold, items, minion, score, spells y formato png ej: champion.png

var url_invocador_by_name = "https://las.api.pvp.net/api/lol/LAS/v1.4/summoner/by-name/"; // se agrega el nombre del campeon, y la key como query string

// versión actual de la web
var version = "Versión 1.1.0";

// Actualizacion 
// parche actual del lol
var lol_current_version;
var cdn;
var champion;
var profileicon;
var item;
var sticker;
var map;
var mastery;
var language;
var summoner;
var rune;

// obtenemos las versiones para cada uno de los metodos para obtencion de datos de la api de Riot games
$.ajax({
	url : "https://global.api.pvp.net/api/lol/static-data/las/v1.2/realm?&api_key=" + key,
	type : "get",
	async: false,
	success : function(data) {
		lol_current_version = data.v;
		cdn = data.cdn;
		champion = data.n.champion;
		profileicon = data.n.profileicon;
		item = data.n.item;
		sticker = data.n.sticker;
		map = data.n.map;
		mastery = data.n.mastery;
		language = data.n.language;
		summoner = data.n.summoner;
		rune = data.n.rune;

		url_profileIcon = cdn + "/" + profileicon + "/img/profileicon/";
		url_championSquare = cdn + "/" + champion + "/img/champion/"; 
		url_passive = cdn + "/" + champion + "/img/passive/"; 
		url_spells = cdn + "/" + champion + "/img/spell/"; 
		url_items = cdn + "/" + item + "/img/item/"; 
		url_masteries = cdn + "/" + mastery + "/img/mastery/"; 
		url_runes = cdn + "/" + rune + "/img/rune/"; 


	},
	error: function(jqXHR, textStatus, errorThrown) {
		$(".modal-title").html('Ups...');
		$(".modal-body").html('<p><b>Algo ha salido mal :( </b></p><p>Si el error persiste envíe un correo a cb@help.com</p>');
		$(".modal").modal('show');
	}
});

// Fin actualizacion



// Obtenemos la lista de todos los campeones del juego, junto con su respectivo champData y los metemos en la variable global listaCampeones
function obtenerCampeones(champData){
	$.ajax({
		url : url_champion + "?locale=" + locale +  "&champData=" + champData + "&version=" + champion + "&api_key=" + key,
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
		url : url_champion + "/" + id + "?locale=" + locale + "&version=" + champion + "&champData=all&api_key=" + key,
		type : "get",
		async: false,
		success : function(data) {
			// en caso de obtener una respuesta correcta desde RIOT GAMES, asignamos la imagen del campeon al fondo de la pantalla
			// y ademas el botón permitirá al usuario descargar dicha imagen.
			let body = $("body");
			let descarga_imagen = $("#descarga_imagen");
			let nombreCampeon = data.name;
			let ChampKey = data.key;
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

			body.css('background-image', "url(" + url_splashArt + ChampKey + "_0.jpg)");
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
			cuerpoModal += "<img src='" + url_loadingScreenArt + ChampKey + "_0.jpg" + "' alt=\"" + nombreCampeon + "\" style=\"width: 100%; height: auto;\">";
			//cuerpoModal += "<p style=\"text-align: center;\"><i>Skin por defecto</i></p>";
			cuerpoModal += "</div>";

			cuerpoModal += "<div class=\"col-10\">";

			// Stats - Habilidades
			cuerpoModal += "<div class=\"row\">";

			// Stats
			cuerpoModal += "<div class=\"col-3\">";
			cuerpoModal += "<span>Ataque: </span>";
			cuerpoModal += "<div class=\"progress\">";
			cuerpoModal += "<div class=\"progress-bar bg-success progress-bar-animated\" role=\"progressbar\" style=\"width: " + info.attack + "0%\" aria-valuenow=\"" + info.attack + "0\" aria-valuemin=\"0\" aria-valuemax=\"100\">" + info.attack + "</div>";
			cuerpoModal += "</div>";
			cuerpoModal += "<span>Defensa: </span>";
			cuerpoModal += "<div class=\"progress\">";
			cuerpoModal += "<div class=\"progress-bar bg-warning progress-bar-animated\" role=\"progressbar\" style=\"width: " + info.defense + "0%\" aria-valuenow=\"" + info.defense + "0\" aria-valuemin=\"0\" aria-valuemax=\"100\">" + info.defense + "</div>";
			cuerpoModal += "</div>";
			cuerpoModal += "<span>Magia: </span>";
			cuerpoModal += "<div class=\"progress\">";
			cuerpoModal += "<div class=\"progress-bar bg-info progress-bar-animated\" role=\"progressbar\" style=\"width: " + info.magic + "0%\" aria-valuenow=\"" + info.magic + "0\" aria-valuemin=\"0\" aria-valuemax=\"100\">" + info.magic + "</div>";
			cuerpoModal += "</div>";
			cuerpoModal += "<span>Dificultad: </span>";
			cuerpoModal += "<div class=\"progress\">";
			cuerpoModal += "<div class=\"progress-bar bg-danger progress-bar-animated\" role=\"progressbar\" style=\"width: " + info.difficulty + "0%\" aria-valuenow=\"" + info.difficulty + "0\" aria-valuemin=\"0\" aria-valuemax=\"100\">" + info.difficulty + "</div>";
			cuerpoModal += "</div>";
			cuerpoModal += "</div>";
			// Fin Stats

			// Habilidades
			cuerpoModal += "<div class=\"col-9\">";
			cuerpoModal += "<span>Habilidades: &nbsp;&nbsp;</span>";
			// pasiva
			cuerpoModal += "<img src=\"" + url_passive + pasiva.image.full + "\" class=\"rounded\" aria-hidden=\"true\" rel=\"popover\" role=\"button\" data-html=\"true\" data-placement=\"bottom\" title=\"<b>" + pasiva.name + "</b>\" data-content=\"" + pasiva.sanitizedDescription + "\" />&nbsp;&nbsp;";
			$.each(spells, function(index, value){
				cuerpoModal += "<img src=\"" + url_spells + value.image.full + "\" class=\"rounded\" aria-hidden=\"true\" rel=\"popover\" role=\"button\" data-html=\"true\" data-placement=\"bottom\" title=\"<b>" + value.name + "</b>\" data-content=\"" + value.sanitizedDescription + " <br/> <b>Enfriamiento: &nbsp;&quot;</b>" + value.cooldownBurn + "&nbsp;segs.&quot;\" />&nbsp;&nbsp;";
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
			// Fin Tips

			// Skins
			cuerpoModal += "<h5 style=\"text-align: center;\"><b>Skins</b><h5>";
			$.each(skins, function(index, value){
				// data-animation="false" es la forma de arreglar que el modal no se cierra al tener los tooltips
				if(value.name == "default")
				{
					cuerpoModal += "<img src=\"" + url_loadingScreenArt + ChampKey + "_" + value.num + ".jpg" + "\" alt=\"" + value.name + "\" style=\"width: 128px; height: auto;\" rel=\"tooltip\" role=\"button\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-animation=\"false\" data-html=\"true\" data-placement=\"bottom\" title=\"<b>" + nombreCampeon + "\"> &nbsp;&nbsp;";					
				}
				else
				{
					cuerpoModal += "<img src=\"" + url_loadingScreenArt + ChampKey + "_" + value.num + ".jpg" + "\" alt=\"" + value.name + "\" style=\"width: 128px; height: auto;\" rel=\"tooltip\" role=\"button\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-animation=\"false\" data-html=\"true\" data-placement=\"bottom\" title=\"<b>" + value.name + "\"> &nbsp;&nbsp;";
				}
				
			});
			// Fin Skins

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
			$('[rel="tooltip"]').tooltip();

			descarga_imagen.attr('href', url_splashArt + ChampKey + '_0.jpg');
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

			descarga_imagen.attr('href', url_splashArt + nombreCampeon + '_0.jpg');
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


// Funcion que retorna el footer de la página
// Footer version 1.0
function footer()
{
	let html = ""; 
	html += "<div class=\"row\" id=\"footer\">";
	html += "<div class=\"col-12\">";
	html +=	"<p style=\"text-align: center; color: white;\"> <i> Versión " + lol_current_version + "</i> </p>";
	html +=	"</div>";
	html +=	"</div>"; 

	document.write(html);
}

// funcion que genera el html de un modal sencillo, con un solo botón para cerrar el modal
function modal()
{
	let html = "";
	html += "<div class=\"modal fade\">";
	html += "<div class=\"modal-dialog modal-lg\" role=\"document\">";
	html += "<div class=\"modal-content\">";
	html += "<div class=\"modal-header\">";
	html += "<h5 class=\"modal-title\"></h5>";
	html += "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">";
	html += "<span aria-hidden=\"true\">&times;</span>";
	html += "</button>";
	html += "</div>";
	html += "<div class=\"modal-body\">";
	html += "</div>";
	html += "<div class=\"modal-footer\">";
	html += "<button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Cerrar</button>";
	html += "</div>";
	html += "</div>";
	html += "</div>";
	html += "</div>";

	document.write(html);
}

// function que genera el html de la barra de navegacion, el cual recibe el nombre de la pagina en la que se encuentra para indicar que pestaña es la que se encuentra activa
// Navbar version 1.0
function navbar(nombrePagina)
{
	let html = "";
	html += "<div class=\"row\">";
	html += "<div class=\"col-12\">";
	html += "<span style=\"color: white;\">Coded by Shaauro</span>";
	html += "</div>";
	html += "</div>";
	html += "<nav class=\"navbar navbar-toggleable-md navbar-inverse bg-inverse\">";
	html += "<button class=\"navbar-toggler navbar-toggler-right\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarNavAltMarkup\" aria-controls=\"navbarNavAltMarkup\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">";
	html += "<span class=\"navbar-toggler-icon\"></span>";
	html += "</button>";
	html += "<a class=\"navbar-brand col-2\" href=\"index.html\">Champion Browser</a>";
	html += "<div class=\"collapse navbar-collapse col-3\" id=\"navbarNavAltMarkup\">";
	html += "<div class=\"navbar-nav\">";
	html += "<a class=\"nav-item nav-link index\" href=\"index.html\">Inicio</a>";
	html += "<a class=\"nav-item nav-link champions\" href=\"champions.html\">Campeones</a>";
	html += "<a class=\"nav-item nav-link testing\" href=\"testing.html\">Testing</a>";
	html += "</div>";
	html += "</div>";
	html += "<div class=\"form-inline col-7\">";
	html += "<select class=\"custom-select col-4\">";
	html += "<option value=\"br\">Brazil</option>";
	html += "<option value=\"eune\">EU Nordic & East</option>";
	html += "<option value=\"euw\">EU West</option>";
	html += "<option value=\"jp\">Japan</option>";
	html += "<option value=\"kr\">Korea</option>";
	html += "<option value=\"lan\">Latin America North</option>";
	html += "<option value=\"las\" selected>Latin America South</option>";
	html += "<option value=\"na\">North America</option>";
	html += "<option value=\"oce\">Oceania</option>";
	html += "<option value=\"ru\">Russia</option>";
	html += "<option value=\"tr\">Turkey</option>";
	html += "</select>";
	html += "<input class=\"form-control col-6\" id=\"txt_nombreInvocador\" maxLength=\"30\" type=\"text\" placeholder=\"Nombre Invocador\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"bottom\" data-trigger=\"manual\" title=\"Debe ingresar un nombre de invocador.\" />";
	html += "<button class=\"btn btn-outline-success form-control col-2\" id=\"btnBuscar\" type=\"button\" onclick=\"javascript:obtieneIdInvocador();\">Buscar</button>";
	html += "</div>";
	html += "</nav>";
	html += "<br/>";

	document.write(html);

	// seteamos el link activo
	$("." + nombrePagina).addClass("active");
	$("." + nombrePagina).attr('href','#');
}

// funcion que genera el html de los campones que se encuentran gratuitos
function rotacionSemanal()
{
	let html = "";
	$.ajax({
		url: url_championFreeToPlay,
		type : "get",
		success : function(data) {
			$.each(data.champions, function(index, value){
				$.ajax({
					url: url_champion + "/" + value.id + "?locale=" + locale + "&champData=all&api_key=" + key,
					type: "get",
					async: false,
					success: function(campeon){
						html += "<img src='" + url_championSquare + campeon.key + ".png' class=\"rounded\" style=\"width: 80px; height: auto;\" role=\"button\"  aria-hidden=\"true\" data-toggle=\"tooltip\" data-animation=\"false\" data-html=\"true\" data-placement=\"bottom\" title=\"<b>" + campeon.name + "</b><br/>" + campeon.title + "\"/>&nbsp;&nbsp;";
					}, 
					error: function(jqXHR, textStatus, errorThrown) {
						console.log("algo salió mal");
					}
				});
			});
			$("#campeonesGratuitos").html(html);
			$('[data-toggle="tooltip"]').tooltip();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$(".modal-title").html('Ups...');
			$(".modal-body").html('<p><b>Algo ha salido mal :( </b></p><p>Si el error persiste envíe un correo a cb@help.com</p>');
			$(".modal").modal('show');
		}
	});
}

function formatText(text)
{
	return text.replace("'", "&quot;");
}

// Esta funcion separa una cadena de texto por sus espacios en blanco, luego la vuelve a unir formateada con %20
function formatURLText(text)
{
	var array = text.split(' ');
	var finalText = "";
	for (var i = 0; i < array.length; i++) {
		
		if(i==array.length-1)
		{
			finalText += array[i];
		}
		else
		{
			finalText += array[i] + "%20";
		}

	}

	return finalText;
	//return text.replace(" ", "%20");
}

function obtieneIdInvocador()
{
	// por ahora solo funcionara en la region de las 
	// nombre de invocador ingresado
	let nombreInvocador = $("#txt_nombreInvocador").val();
	
	if(nombreInvocador != "")
	{
		$("#txt_nombreInvocador").removeClass('danger');
		$("#txt_nombreInvocador").tooltip('hide');

		// ultima version de las pruebas pa hacer funcionar esta mierda xd
		$.ajax({
			url: url_invocador_by_name + formatURLText(nombreInvocador) + '?api_key=' + key,
			type: 'get',
			dataType: 'json',
			success : function(data) {
				console.log(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				switch (jqXHR.status)
				{
					case 404: 
						$(".modal-title").html('Ups...');
						$(".modal-body").html('<p>No hay ningun invocador con ese nombre.</p>');
						$(".modal").modal('show');
						break;
					case 200: 
						$(".modal-title").html('Ups...');
						$(".modal-body").html('<p>Parse Error.</p>');
						$(".modal").modal('show');
						break; 
					default:
						$(".modal-title").html('Ups...');
						$(".modal-body").html('<p>Error Desconocido.</p>');
						$(".modal").modal('show');
						break;
				}

				console.log(jqXHR);
				console.log("textStatus: " + textStatus);
				console.log("errorThrown: " + errorThrown);
				
			}
		});
		
	}
	else
	{
		$("#txt_nombreInvocador").addClass('danger');
		$("#txt_nombreInvocador").tooltip('show');
	}
	
}

function getVarsUrl(url){
    //var url= location.search.replace("?", "");
    var url = url.replace("?","");
    var arrUrl = url.split("&");
    var urlObj={};   
    for(var i=0; i<arrUrl.length; i++){
        var x= arrUrl[i].split("=");
        urlObj[x[0]]=x[1]
    }
    return urlObj;
}


